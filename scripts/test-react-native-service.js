// Test the React Native RAG service
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

// Mock the RAG service
class MockRAGService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    });
    
    this.supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    );
    
    this.embeddingCache = new Map();
  }

  async generateEmbedding(text) {
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text);
    }

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    const embedding = response.data[0].embedding;
    this.embeddingCache.set(text, embedding);
    return embedding;
  }

  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async findRelevantContext(visionAnalysis, currentStep, maxResults = 5) {
    const start = Date.now();

    // Create contextual query
    const contextQuery = [
      visionAnalysis.description || 'cooking scene',
      `Current step: ${currentStep}`,
      `Objects: ${(visionAnalysis.objects || []).join(', ')}`,
      `Actions: ${(visionAnalysis.actions || []).join(', ')}`
    ].join(' • ');

    // Generate embedding
    const queryEmbedding = await this.generateEmbedding(contextQuery);

    // Fetch recipe steps
    const { data: steps } = await this.supabase
      .from('recipe_steps')
      .select('id, recipe_id, step_number, instruction, embedding');

    // Fetch ingredients  
    const { data: ingredients } = await this.supabase
      .from('ingredients')
      .select('id, name, properties, embedding');

    // Calculate similarities
    const relevantSteps = [];
    const relevantIngredients = [];

    // Process steps
    if (steps) {
      for (const step of steps) {
        if (step.embedding) {
          const stepEmbedding = Array.isArray(step.embedding) ? step.embedding : JSON.parse(step.embedding);
          const similarity = this.cosineSimilarity(queryEmbedding, stepEmbedding);
          
          if (similarity > 0.3) {
            relevantSteps.push({
              id: step.id,
              recipe_id: step.recipe_id,
              step_number: step.step_number,
              instruction: step.instruction,
              similarity: similarity
            });
          }
        }
      }
    }

    // Process ingredients
    if (ingredients) {
      for (const ingredient of ingredients) {
        if (ingredient.embedding) {
          const ingredientEmbedding = Array.isArray(ingredient.embedding) ? ingredient.embedding : JSON.parse(ingredient.embedding);
          const similarity = this.cosineSimilarity(queryEmbedding, ingredientEmbedding);
          
          if (similarity > 0.35) {
            relevantIngredients.push({
              id: ingredient.id,
              name: ingredient.name,
              properties: ingredient.properties,
              similarity: similarity
            });
          }
        }
      }
    }

    // Sort and limit results
    relevantSteps.sort((a, b) => b.similarity - a.similarity);
    relevantIngredients.sort((a, b) => b.similarity - a.similarity);

    const totalTime = Date.now() - start;

    return {
      relevantSteps: relevantSteps.slice(0, maxResults),
      relevantIngredients: relevantIngredients.slice(0, maxResults),
      embedding: queryEmbedding,
      query: contextQuery,
      timing: totalTime
    };
  }

  async generateGuidance(visionAnalysis, context, currentStep) {
    // Simulate guidance generation (in real app this would call GPT-4)
    const contextText = [
      `Current step: ${currentStep}`,
      `Scene: ${visionAnalysis.description}`,
      'Relevant steps:',
      ...context.relevantSteps.slice(0, 3).map(s => `- ${s.instruction}`),
      'Relevant ingredients:',
      ...context.relevantIngredients.slice(0, 3).map(i => `- ${i.name}`)
    ].join('\n');

    // Simple guidance based on context
    const step = context.relevantSteps[0];
    if (step) {
      const guidance = this.generateStepGuidance(step, visionAnalysis);
      return {
        guidance,
        context: contextText,
        confidence: step.similarity
      };
    }

    return {
      guidance: "Continue with your current step. You're doing great!",
      context: contextText,
      confidence: 0.5
    };
  }

  generateStepGuidance(step, visionAnalysis) {
    const instruction = step.instruction.toLowerCase();
    
    if (instruction.includes('sear') || instruction.includes('brown')) {
      return "Perfect! I can see good browning. Let it sear for the full time to develop flavor.";
    }
    
    if (instruction.includes('stir') || instruction.includes('toss')) {
      return "Keep stirring to ensure even cooking. The movement looks good!";
    }
    
    if (instruction.includes('chop') || instruction.includes('dice')) {
      return "Nice knife work! Uniform pieces will cook evenly.";
    }
    
    if (instruction.includes('heat') || instruction.includes('oil')) {
      return "The pan temperature looks right. Ready for the next ingredient.";
    }
    
    return `Good progress on: ${step.instruction}`;
  }
}

async function testReactNativeIntegration() {
  console.log('📱 Testing React Native RAG Service Integration...\n');

  const ragService = new MockRAGService();

  // Test scenarios mimicking real app usage
  const testScenarios = [
    {
      name: 'Steak Searing - Step 2',
      visionAnalysis: {
        objects: ['steak', 'pan', 'oil'],
        actions: ['searing', 'browning'],
        description: 'Steak is being seared in hot pan with oil, showing brown crust formation',
        cookingState: 'browning'
      },
      currentStep: 'Season and sear one side: Rub salt and pepper evenly over the entire surface of the steak right before cooking'
    },
    {
      name: 'Beef Stir-fry - Step 4', 
      visionAnalysis: {
        objects: ['beef', 'wok', 'bell pepper', 'oil'],
        actions: ['stir-frying', 'tossing'],
        description: 'Beef strips and bell peppers being stir-fried in wok over high heat',
        cookingState: 'cooking'
      },
      currentStep: 'Cook the beef: Add the marinated beef to the wok and stir-fry until it just changes color'
    },
    {
      name: 'Ingredient Recognition',
      visionAnalysis: {
        objects: ['onion', 'garlic', 'cutting board'],
        actions: ['chopping'],
        description: 'Diced onions and minced garlic on cutting board ready for cooking',
        cookingState: 'prep'
      },
      currentStep: 'Prepare aromatics: Dice the onions and mince the garlic'
    }
  ];

  const results = [];

  for (const scenario of testScenarios) {
    console.log(`🧪 Testing: ${scenario.name}`);
    const start = Date.now();

    try {
      // Step 1: Find relevant context using RAG
      const context = await ragService.findRelevantContext(
        scenario.visionAnalysis, 
        scenario.currentStep
      );

      // Step 2: Generate guidance
      const guidance = await ragService.generateGuidance(
        scenario.visionAnalysis,
        context,
        scenario.currentStep
      );

      const totalTime = Date.now() - start;

      console.log(`  Vision: ${scenario.visionAnalysis.description}`);
      console.log(`  Top Match: ${context.relevantSteps[0]?.instruction || 'None'} (${(context.relevantSteps[0]?.similarity * 100 || 0).toFixed(1)}%)`);
      console.log(`  Guidance: ${guidance.guidance}`);
      console.log(`  Confidence: ${(guidance.confidence * 100).toFixed(1)}%`);
      console.log(`  ⏱️ Total: ${totalTime}ms (RAG: ${context.timing}ms)\n`);

      results.push({
        scenario: scenario.name,
        ragTiming: context.timing,
        totalTiming: totalTime,
        accuracy: context.relevantSteps[0]?.similarity || 0,
        relevantStepsFound: context.relevantSteps.length,
        relevantIngredientsFound: context.relevantIngredients.length
      });

    } catch (error) {
      console.error(`  ❌ Failed: ${error.message}\n`);
      results.push({
        scenario: scenario.name,
        error: error.message
      });
    }
  }

  // Performance analysis
  console.log('📊 Integration Performance Summary');
  const successfulTests = results.filter(r => !r.error);
  
  if (successfulTests.length > 0) {
    const avgRAGTiming = successfulTests.reduce((sum, r) => sum + r.ragTiming, 0) / successfulTests.length;
    const avgTotalTiming = successfulTests.reduce((sum, r) => sum + r.totalTiming, 0) / successfulTests.length;
    const avgAccuracy = successfulTests.reduce((sum, r) => sum + r.accuracy, 0) / successfulTests.length;
    const avgStepsFound = successfulTests.reduce((sum, r) => sum + r.relevantStepsFound, 0) / successfulTests.length;
    const avgIngredientsFound = successfulTests.reduce((sum, r) => sum + r.relevantIngredientsFound, 0) / successfulTests.length;

    console.log(`Average RAG latency: ${avgRAGTiming.toFixed(0)}ms`);
    console.log(`Average total latency: ${avgTotalTiming.toFixed(0)}ms`);
    console.log(`Average context accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`Average relevant steps found: ${avgStepsFound.toFixed(1)}`);
    console.log(`Average relevant ingredients found: ${avgIngredientsFound.toFixed(1)}`);

    const isProductionReady = avgTotalTiming < 1500 && avgAccuracy > 0.4;
    console.log(`\n${isProductionReady ? '🚀' : '⚠️'} Production Readiness: ${isProductionReady ? 'READY' : 'NEEDS OPTIMIZATION'}`);

    // Test caching performance
    console.log('\n🗄️ Testing Embedding Cache Performance...');
    const cacheStart = Date.now();
    
    // Re-run same query to test cache
    await ragService.findRelevantContext(
      testScenarios[0].visionAnalysis,
      testScenarios[0].currentStep
    );
    
    const cacheTime = Date.now() - cacheStart;
    console.log(`Cached query latency: ${cacheTime}ms`);
    console.log(`Cache speedup: ${(avgRAGTiming / cacheTime).toFixed(1)}x faster`);

  } else {
    console.log('❌ All tests failed');
  }

  return results;
}

// Run the test
if (require.main === module) {
  testReactNativeIntegration()
    .then((results) => {
      console.log('\n✅ React Native integration test completed!');
    })
    .catch((error) => {
      console.error('\n❌ Integration test failed:', error);
      process.exit(1);
    });
}

module.exports = { testReactNativeIntegration };