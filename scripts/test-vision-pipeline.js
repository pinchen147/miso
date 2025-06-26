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

async function simulateVisionAnalysis(scenario) {
  // Mock Gemini vision analysis (this would normally analyze camera frame)
  const visionResults = {
    'steak_searing': {
      objects: ['steak', 'pan', 'spatula'],
      actions: ['searing', 'cooking'],
      cookingState: 'steak is browning on one side, showing good sear marks',
      description: 'Steak is being seared in a hot pan with good browning'
    },
    'onion_chopping': {
      objects: ['onion', 'knife', 'cutting board'],
      actions: ['chopping', 'dicing'],
      cookingState: 'onions are being diced into small pieces',
      description: 'Onions are being chopped on a cutting board with a knife'
    },
    'beef_stirfry': {
      objects: ['beef', 'wok', 'bell pepper', 'oil'],
      actions: ['stir-frying', 'tossing'],
      cookingState: 'beef and vegetables are being stir-fried in hot oil',
      description: 'Beef and bell peppers are being stir-fried in a wok'
    }
  };
  
  return visionResults[scenario] || visionResults['steak_searing'];
}

async function findRelevantContext(visionAnalysis, currentStep) {
  const start = Date.now();
  
  // Create contextual query from vision analysis and current step
  const contextQuery = [
    visionAnalysis.description,
    `Current step: ${currentStep}`,
    `Objects: ${visionAnalysis.objects.join(', ')}`,
    `Actions: ${visionAnalysis.actions.join(', ')}`
  ].join(' • ');
  
  // Generate embedding for the contextual query
  const { embedding: queryEmbedding, duration: embeddingDuration } = await generateEmbedding(contextQuery);
  
  // Fetch all recipe steps and ingredients
  const { data: steps } = await supabase
    .from('recipe_steps')
    .select('id, recipe_id, step_number, instruction, embedding');
    
  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('id, name, embedding');
  
  // Calculate similarities
  const similarities = [];
  
  // Check steps
  for (const step of steps) {
    if (step.embedding) {
      const stepEmbedding = Array.isArray(step.embedding) ? step.embedding : JSON.parse(step.embedding);
      const similarity = cosineSimilarity(queryEmbedding, stepEmbedding);
      if (similarity > 0.25) { // Threshold filter
        similarities.push({
          type: 'step',
          content: step.instruction,
          stepNumber: step.step_number,
          similarity: similarity,
          id: step.id
        });
      }
    }
  }
  
  // Check ingredients
  for (const ingredient of ingredients) {
    if (ingredient.embedding) {
      const ingredientEmbedding = Array.isArray(ingredient.embedding) ? ingredient.embedding : JSON.parse(ingredient.embedding);
      const similarity = cosineSimilarity(queryEmbedding, ingredientEmbedding);
      if (similarity > 0.3) { // Higher threshold for ingredients
        similarities.push({
          type: 'ingredient',
          content: ingredient.name,
          similarity: similarity,
          id: ingredient.id
        });
      }
    }
  }
  
  similarities.sort((a, b) => b.similarity - a.similarity);
  const searchDuration = Date.now() - start;
  
  return {
    query: contextQuery,
    results: similarities.slice(0, 5), // Top 5 results
    timing: {
      embedding: embeddingDuration,
      search: searchDuration - embeddingDuration,
      total: searchDuration
    }
  };
}

async function generateGuidance(visionAnalysis, context) {
  const start = Date.now();
  
  // Simulate GPT-4 guidance generation (simplified)
  const guidancePrompts = {
    'steak_searing': [
      "Perfect! Your steak is developing nice sear marks. Don't flip it yet - let it cook for another 2-3 minutes.",
      "The browning looks great. Make sure the pan stays hot and avoid moving the steak around.",
      "Those sear marks indicate good caramelization. Prepare to flip when you see moisture beading on top."
    ],
    'onion_chopping': [
      "Good technique! Try to keep your fingers curled and use a rocking motion with the knife.",
      "Nice dicing! Uniform pieces will cook evenly. Take your time for consistent results.",
      "Perfect size for this recipe. The onions will cook down nicely when added to the pan."
    ],
    'beef_stirfry': [
      "Great! Keep the beef moving in the wok to ensure even cooking on all sides.",
      "The high heat is perfect for stir-frying. Don't overcrowd the pan.",
      "Add the bell peppers when the beef is about 70% cooked for best texture."
    ]
  };
  
  // Simulate context-aware guidance
  const baseGuidance = guidancePrompts[visionAnalysis.objects.includes('steak') ? 'steak_searing' : 
                                      visionAnalysis.objects.includes('onion') ? 'onion_chopping' : 'beef_stirfry'];
  
  const guidance = baseGuidance[Math.floor(Math.random() * baseGuidance.length)];
  
  const duration = Date.now() - start;
  
  return {
    guidance,
    duration,
    context: context.results.slice(0, 3).map(r => r.content)
  };
}

async function testVisionPipeline() {
  console.log('🎥 Testing Vision Pipeline with RAG...\n');
  
  const scenarios = [
    {
      name: 'Searing Steak',
      vision: 'steak_searing',
      currentStep: 'Heat the pan and sear the steak for 3-4 minutes'
    },
    {
      name: 'Chopping Onions',
      vision: 'onion_chopping', 
      currentStep: 'Dice the onions into small pieces'
    },
    {
      name: 'Stir-frying Beef',
      vision: 'beef_stirfry',
      currentStep: 'Stir-fry beef and vegetables over high heat'
    }
  ];
  
  const results = [];
  
  for (const scenario of scenarios) {
    console.log(`🔍 Testing: ${scenario.name}`);
    const pipelineStart = Date.now();
    
    // Step 1: Vision Analysis (simulated)
    const visionStart = Date.now();
    const visionAnalysis = await simulateVisionAnalysis(scenario.vision);
    const visionDuration = Date.now() - visionStart;
    
    // Step 2: RAG Context Retrieval
    const context = await findRelevantContext(visionAnalysis, scenario.currentStep);
    
    // Step 3: Guidance Generation
    const guidance = await generateGuidance(visionAnalysis, context);
    
    const totalDuration = Date.now() - pipelineStart;
    
    console.log(`  Vision: ${visionAnalysis.description}`);
    console.log(`  Context Query: ${context.query.substring(0, 80)}...`);
    console.log(`  Top Match: ${context.results[0]?.content || 'None'} (${(context.results[0]?.similarity * 100 || 0).toFixed(1)}%)`);
    console.log(`  Guidance: ${guidance.guidance}`);
    console.log(`  ⏱️ Timing: ${totalDuration}ms (Vision: ${visionDuration}ms, RAG: ${context.timing.total}ms, Guidance: ${guidance.duration}ms)\n`);
    
    results.push({
      scenario: scenario.name,
      timing: {
        vision: visionDuration,
        embedding: context.timing.embedding,
        search: context.timing.search,
        guidance: guidance.duration,
        total: totalDuration
      },
      accuracy: context.results[0]?.similarity || 0
    });
  }
  
  // Performance Summary
  console.log('📊 Pipeline Performance Summary');
  const avgTiming = results.reduce((acc, r) => ({
    vision: acc.vision + r.timing.vision,
    embedding: acc.embedding + r.timing.embedding,
    search: acc.search + r.timing.search,
    guidance: acc.guidance + r.timing.guidance,
    total: acc.total + r.timing.total
  }), { vision: 0, embedding: 0, search: 0, guidance: 0, total: 0 });
  
  Object.keys(avgTiming).forEach(key => {
    avgTiming[key] = Math.round(avgTiming[key] / results.length);
  });
  
  console.log(`Average Vision Analysis: ${avgTiming.vision}ms`);
  console.log(`Average Embedding Generation: ${avgTiming.embedding}ms`);
  console.log(`Average Similarity Search: ${avgTiming.search}ms`);
  console.log(`Average Guidance Generation: ${avgTiming.guidance}ms`);
  console.log(`Average Total Pipeline: ${avgTiming.total}ms`);
  
  const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
  console.log(`Average Context Accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
  
  const isRealTime = avgTiming.total < 1000;
  console.log(`\n${isRealTime ? '🚀' : '⚠️'} Real-time Performance: ${isRealTime ? 'EXCELLENT' : 'NEEDS OPTIMIZATION'}`);
  console.log(`${avgAccuracy > 0.3 ? '🎯' : '⚠️'} Context Relevance: ${avgAccuracy > 0.3 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
  
  return results;
}

// Run the test
if (require.main === module) {
  testVisionPipeline()
    .then((results) => {
      console.log('\n✅ Vision pipeline test completed successfully!');
    })
    .catch((error) => {
      console.error('\n❌ Vision pipeline test failed:', error);
      process.exit(1);
    });
}

module.exports = { testVisionPipeline };