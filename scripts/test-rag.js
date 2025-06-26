const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize clients
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function testSimilaritySearch() {
  console.log('🧪 Testing RAG similarity search...\n');

  const testQueries = [
    {
      name: 'Chopping onions',
      query: 'chopping onions with knife on cutting board',
    },
    {
      name: 'Heating oil in pan',
      query: 'heating oil in frying pan on stove',
    },
    {
      name: 'Adding garlic',
      query: 'adding minced garlic to hot oil',
    },
    {
      name: 'Simmering sauce',
      query: 'sauce bubbling and simmering in pot',
    },
    {
      name: 'Plating dish',
      query: 'plating finished dish on white plate',
    },
  ];

  for (const testCase of testQueries) {
    console.log(`📝 Testing: ${testCase.name}`);
    console.log(`Query: "${testCase.query}"`);
    
    try {
      const startTime = Date.now();
      
      // Generate embedding
      const embedding = await generateEmbedding(testCase.query);
      const embeddingTime = Date.now() - startTime;
      
      // Test similar steps search
      const { data: steps, error: stepsError } = await supabase.rpc('get_similar_steps', {
        query_embedding: embedding,
        match_threshold: 0.5, // Lower threshold for testing
        match_count: 3,
      });
      
      const totalTime = Date.now() - startTime;
      
      if (stepsError) {
        console.log(`❌ Error: ${stepsError.message}`);
      } else if (!steps || steps.length === 0) {
        console.log('⚠️  No similar steps found');
      } else {
        console.log(`✅ Found ${steps.length} similar steps (${totalTime}ms total, ${embeddingTime}ms embedding)`);
        steps.forEach((step, i) => {
          console.log(`   ${i + 1}. Step ${step.step_number}: "${step.instruction.substring(0, 60)}..." (similarity: ${step.similarity.toFixed(3)})`);
        });
      }
      
      // Test similar ingredients search
      const { data: ingredients, error: ingredientsError } = await supabase.rpc('get_similar_ingredients', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 3,
      });
      
      if (ingredientsError) {
        console.log(`❌ Ingredients Error: ${ingredientsError.message}`);
      } else if (ingredients && ingredients.length > 0) {
        console.log(`🥕 Found ${ingredients.length} similar ingredients:`);
        ingredients.forEach((ing, i) => {
          console.log(`   ${i + 1}. ${ing.name} (similarity: ${ing.similarity.toFixed(3)})`);
        });
      }
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
    }
    
    console.log('─'.repeat(60));
  }
}

async function testDatabaseSetup() {
  console.log('🔍 Checking database setup...\n');
  
  try {
    // Check if pgvector extension is enabled
    const { data: extensions } = await supabase
      .from('pg_extension')
      .select('extname')
      .eq('extname', 'vector');
    
    if (extensions && extensions.length > 0) {
      console.log('✅ pgvector extension is enabled');
    } else {
      console.log('❌ pgvector extension not found');
      return false;
    }
    
    // Check if embedding columns exist and have data
    const { data: recipesWithEmbeddings } = await supabase
      .from('recipes')
      .select('id, title')
      .not('embedding', 'is', null)
      .limit(5);
    
    console.log(`✅ Found ${recipesWithEmbeddings?.length || 0} recipes with embeddings`);
    
    const { data: stepsWithEmbeddings } = await supabase
      .from('recipe_steps')
      .select('id, instruction')
      .not('embedding', 'is', null)
      .limit(5);
    
    console.log(`✅ Found ${stepsWithEmbeddings?.length || 0} recipe steps with embeddings`);
    
    const { data: ingredientsWithEmbeddings } = await supabase
      .from('ingredients')
      .select('id, name')
      .not('embedding', 'is', null)
      .limit(5);
    
    console.log(`✅ Found ${ingredientsWithEmbeddings?.length || 0} ingredients with embeddings`);
    
    return true;
  } catch (error) {
    console.log(`❌ Database setup check failed: ${error.message}`);
    return false;
  }
}

async function benchmarkLatency() {
  console.log('\n⏱️  Benchmarking latency...\n');
  
  const testQuery = 'stirring vegetables in hot pan with wooden spoon';
  const iterations = 5;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    try {
      const embedding = await generateEmbedding(testQuery);
      
      await Promise.all([
        supabase.rpc('get_similar_steps', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5,
        }),
        supabase.rpc('get_similar_ingredients', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 5,
        }),
      ]);
      
      const totalTime = Date.now() - startTime;
      times.push(totalTime);
      console.log(`Iteration ${i + 1}: ${totalTime}ms`);
    } catch (error) {
      console.log(`Iteration ${i + 1} failed: ${error.message}`);
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log(`\n📊 Latency Statistics:`);
    console.log(`   Average: ${avgTime.toFixed(0)}ms`);
    console.log(`   Min: ${minTime}ms`);
    console.log(`   Max: ${maxTime}ms`);
    
    if (avgTime > 3000) {
      console.log('⚠️  Average latency is high (>3s). Consider optimizing.');
    } else if (avgTime > 1000) {
      console.log('⚡ Average latency is acceptable (1-3s).');
    } else {
      console.log('🚀 Average latency is excellent (<1s).');
    }
  }
}

async function main() {
  console.log('🍽️  Miso AI RAG System Test Suite\n');
  
  // Test database setup
  const dbOk = await testDatabaseSetup();
  if (!dbOk) {
    console.log('\n❌ Database setup issues found. Please run the setup SQL first.');
    return;
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test similarity search
  await testSimilaritySearch();
  
  // Benchmark latency
  await benchmarkLatency();
  
  console.log('\n🎉 RAG system testing completed!');
  console.log('\nNext steps:');
  console.log('1. Run embedding generation: node scripts/generate-embeddings.js');
  console.log('2. Adjust match_threshold based on similarity scores');
  console.log('3. Monitor latency in production');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  testSimilaritySearch, 
  testDatabaseSetup, 
  benchmarkLatency 
};