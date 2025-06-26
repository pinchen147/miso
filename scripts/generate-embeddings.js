const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
require('dotenv').config();

// Initialize clients - you'll need to add these env vars
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
);

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

const EMBEDDING_MODEL = 'text-embedding-3-small'; // More cost-effective
const BATCH_SIZE = 50; // Process in batches to avoid rate limits

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

async function embedRecipes() {
  console.log('🍽️  Generating embeddings for recipes...');
  
  // Fetch recipes without embeddings
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, description, cuisine_type')
    .is('embedding', null);

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  console.log(`Found ${recipes.length} recipes without embeddings`);

  for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
    const batch = recipes.slice(i, i + BATCH_SIZE);
    
    for (const recipe of batch) {
      try {
        // Create rich text representation for embedding
        const recipeText = [
          recipe.title,
          recipe.description || '',
          recipe.cuisine_type || '',
        ].filter(Boolean).join(' • ');

        const embedding = await generateEmbedding(recipeText);

        const { error: updateError } = await supabase
          .from('recipes')
          .update({ embedding })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError);
        } else {
          console.log(`✅ Generated embedding for recipe: ${recipe.title}`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process recipe ${recipe.id}:`, error);
      }
    }
  }
}

async function embedRecipeSteps() {
  console.log('📋 Generating embeddings for recipe steps...');
  
  // Fetch steps without embeddings
  const { data: steps, error } = await supabase
    .from('recipe_steps')
    .select('id, recipe_id, step_number, instruction')
    .is('embedding', null);

  if (error) {
    console.error('Error fetching recipe steps:', error);
    return;
  }

  console.log(`Found ${steps.length} recipe steps without embeddings`);

  for (let i = 0; i < steps.length; i += BATCH_SIZE) {
    const batch = steps.slice(i, i + BATCH_SIZE);
    
    for (const step of batch) {
      try {
        // Create contextual text for the step
        const stepText = `Step ${step.step_number}: ${step.instruction}`;
        
        const embedding = await generateEmbedding(stepText);

        const { error: updateError } = await supabase
          .from('recipe_steps')
          .update({ embedding })
          .eq('id', step.id);

        if (updateError) {
          console.error(`Error updating step ${step.id}:`, updateError);
        } else {
          console.log(`✅ Generated embedding for step ${step.step_number} of recipe ${step.recipe_id}`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process step ${step.id}:`, error);
      }
    }
  }
}

async function embedIngredients() {
  console.log('🥕 Generating embeddings for ingredients...');
  
  // Fetch ingredients without embeddings (or with placeholder embeddings)
  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('id, name, properties, embedding')
    .or('embedding.is.null,embedding.eq.[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]');

  if (error) {
    console.error('Error fetching ingredients:', error);
    return;
  }

  console.log(`Found ${ingredients.length} ingredients without embeddings`);

  for (let i = 0; i < ingredients.length; i += BATCH_SIZE) {
    const batch = ingredients.slice(i, i + BATCH_SIZE);
    
    for (const ingredient of batch) {
      try {
        // Create rich text for ingredient
        let ingredientText = ingredient.name;
        
        if (ingredient.properties && Array.isArray(ingredient.properties)) {
          const properties = ingredient.properties.join(', ');
          ingredientText += ` • Properties: ${properties}`;
        }

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
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process ingredient ${ingredient.id}:`, error);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting embedding generation process...');
  
  try {
    await embedRecipes();
    await embedRecipeSteps();
    await embedIngredients();
    
    console.log('🎉 Embedding generation completed successfully!');
  } catch (error) {
    console.error('❌ Embedding generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateEmbedding, embedRecipes, embedRecipeSteps, embedIngredients };