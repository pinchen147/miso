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
  const start = Date.now();
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  const duration = Date.now() - start;
  return { embedding: response.data[0].embedding, duration };
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function testBasicEmbeddings() {
  console.log('🧪 Testing Basic Embedding System...\n');

  // Test 1: Database connectivity and data retrieval
  console.log('📊 Test 1: Database Connectivity');
  const start1 = Date.now();
  
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, title, description, embedding')
    .limit(3);

  const { data: steps, error: stepsError } = await supabase
    .from('recipe_steps')
    .select('id, instruction, embedding')
    .limit(5);

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('id, name, embedding')
    .limit(5);

  const dbDuration = Date.now() - start1;

  if (recipesError || stepsError || ingredientsError) {
    console.log('❌ Database connectivity failed');
    console.error('Errors:', { recipesError, stepsError, ingredientsError });
    return;
  }

  console.log(`✅ Retrieved ${recipes.length} recipes, ${steps.length} steps, ${ingredients.length} ingredients`);
  console.log(`⏱️  Database query latency: ${dbDuration}ms\n`);

  // Test 2: Embedding generation latency
  console.log('🤖 Test 2: OpenAI Embedding Generation');
  const testQueries = [
    "I'm chopping onions and they're starting to brown",
    "The steak looks medium rare",
    "I need to add salt and pepper"
  ];

  const embeddingResults = [];
  for (const query of testQueries) {
    const result = await generateEmbedding(query);
    embeddingResults.push(result);
    console.log(`✅ "${query}" - ${result.duration}ms`);
  }

  const avgEmbeddingTime = embeddingResults.reduce((sum, r) => sum + r.duration, 0) / embeddingResults.length;
  console.log(`⏱️  Average embedding generation: ${avgEmbeddingTime.toFixed(0)}ms\n`);

  // Test 3: Manual similarity search
  console.log('🔍 Test 3: Manual Similarity Search');
  const queryEmbedding = embeddingResults[0].embedding;
  
  const start3 = Date.now();
  const similarities = [];

  // Test against recipe steps
  for (const step of steps) {
    if (step.embedding) {
      const stepEmbedding = Array.isArray(step.embedding) ? step.embedding : JSON.parse(step.embedding);
      const similarity = cosineSimilarity(queryEmbedding, stepEmbedding);
      similarities.push({
        type: 'step',
        content: step.instruction,
        similarity: similarity
      });
    }
  }

  // Test against ingredients
  for (const ingredient of ingredients) {
    if (ingredient.embedding) {
      const ingredientEmbedding = Array.isArray(ingredient.embedding) ? ingredient.embedding : JSON.parse(ingredient.embedding);
      const similarity = cosineSimilarity(queryEmbedding, ingredientEmbedding);
      similarities.push({
        type: 'ingredient',
        content: ingredient.name,
        similarity: similarity
      });
    }
  }

  similarities.sort((a, b) => b.similarity - a.similarity);
  const searchDuration = Date.now() - start3;

  console.log(`Query: "${testQueries[0]}"`);
  console.log('Top 3 matches:');
  similarities.slice(0, 3).forEach((match, i) => {
    console.log(`  ${i + 1}. [${match.type}] ${match.content} (${(match.similarity * 100).toFixed(1)}%)`);
  });
  console.log(`⏱️  Manual similarity search: ${searchDuration}ms\n`);

  // Test 4: End-to-end latency simulation
  console.log('🚀 Test 4: End-to-End Latency Simulation');
  const start4 = Date.now();
  
  // Simulate the full pipeline: query → embedding → search → results
  const simulationQuery = "I'm searing the steak in the pan";
  const { embedding: simEmbedding, duration: simEmbedDuration } = await generateEmbedding(simulationQuery);
  
  // Simulate searching through all data
  const allSimilarities = [];
  
  for (const step of steps) {
    if (step.embedding) {
      const stepEmbedding = Array.isArray(step.embedding) ? step.embedding : JSON.parse(step.embedding);
      const similarity = cosineSimilarity(simEmbedding, stepEmbedding);
      allSimilarities.push({
        type: 'step',
        content: step.instruction,
        similarity: similarity
      });
    }
  }

  allSimilarities.sort((a, b) => b.similarity - a.similarity);
  const totalDuration = Date.now() - start4;

  console.log(`Query: "${simulationQuery}"`);
  console.log('Best match:');
  if (allSimilarities.length > 0) {
    const best = allSimilarities[0];
    console.log(`  ${best.content} (${(best.similarity * 100).toFixed(1)}% match)`);
  }
  console.log(`⏱️  Total end-to-end latency: ${totalDuration}ms`);
  console.log(`   - Embedding generation: ${simEmbedDuration}ms`);
  console.log(`   - Similarity search: ${totalDuration - simEmbedDuration}ms\n`);

  // Performance Summary
  console.log('📈 Performance Summary');
  console.log(`Database query: ${dbDuration}ms`);
  console.log(`Embedding generation: ${avgEmbeddingTime.toFixed(0)}ms (average)`);
  console.log(`Similarity search: ${searchDuration}ms`);
  console.log(`End-to-end pipeline: ${totalDuration}ms`);
  
  const isPerformant = totalDuration < 2000 && avgEmbeddingTime < 1000;
  console.log(`\n${isPerformant ? '🎉' : '⚠️'} Performance: ${isPerformant ? 'EXCELLENT' : 'NEEDS OPTIMIZATION'}`);
  
  if (!isPerformant) {
    console.log('\n💡 Optimization suggestions:');
    if (avgEmbeddingTime > 800) console.log('  - Consider caching frequent queries');
    if (searchDuration > 200) console.log('  - Enable pgvector extension for faster similarity search');
    if (totalDuration > 2000) console.log('  - Consider reducing embedding dimensions or batch processing');
  }

  return {
    dbLatency: dbDuration,
    embeddingLatency: avgEmbeddingTime,
    searchLatency: searchDuration,
    totalLatency: totalDuration,
    performant: isPerformant
  };
}

// Run the test
if (require.main === module) {
  testBasicEmbeddings()
    .then((results) => {
      console.log('\n✅ Test completed successfully!');
    })
    .catch((error) => {
      console.error('\n❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testBasicEmbeddings };