const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize clients
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small';

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function fixIngredientEmbeddings() {
  console.log('🥕 Fixing ingredient embeddings...');
  
  // Fetch all ingredients
  const { data: allIngredients, error } = await supabase
    .from('ingredients')
    .select('id, name, embedding');

  if (error) {
    console.error('Error fetching ingredients:', error);
    return;
  }

  // Filter ingredients that need embeddings (null or placeholder zeros)
  const ingredients = allIngredients.filter(ingredient => {
    if (!ingredient.embedding) return true;
    // Check if embedding is a placeholder (all zeros)
    const embeddingArray = Array.isArray(ingredient.embedding) ? ingredient.embedding : JSON.parse(ingredient.embedding);
    return embeddingArray.every(val => val === 0);
  });

  console.log(`Found ${ingredients.length} ingredients needing real embeddings`);

  for (const ingredient of ingredients) {
    try {
      // Create rich text for ingredient
      let ingredientText = ingredient.name;


      console.log(`Generating embedding for: ${ingredientText}`);
      const embedding = await generateEmbedding(ingredientText);

      const { error: updateError } = await supabase
        .from('ingredients')
        .update({ embedding })
        .eq('id', ingredient.id);

      if (updateError) {
        console.error(`Error updating ingredient ${ingredient.id}:`, updateError);
      } else {
        console.log(`✅ Generated embedding for ingredient: ${ingredient.name}`);
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process ingredient ${ingredient.id}:`, error);
    }
  }

  console.log('🎉 Ingredient embedding generation completed!');
}

// Run the script
if (require.main === module) {
  fixIngredientEmbeddings();
}