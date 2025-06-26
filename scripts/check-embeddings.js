const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkEmbeddings() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('name, embedding')
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample ingredient embeddings:');
    data.forEach(ingredient => {
      const embedding = Array.isArray(ingredient.embedding) ? ingredient.embedding : JSON.parse(ingredient.embedding);
      const hasRealEmbedding = !embedding.every(val => val === 0);
      console.log(`${ingredient.name}: ${hasRealEmbedding ? '✅ Real embedding' : '❌ Placeholder'}`);
    });
  }
}

checkEmbeddings();