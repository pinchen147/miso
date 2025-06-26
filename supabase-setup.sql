-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns to existing tables (if not already present)
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

ALTER TABLE public.recipe_steps 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

ALTER TABLE public.ingredients 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS recipes_embedding_idx 
ON public.recipes USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS recipe_steps_embedding_idx 
ON public.recipe_steps USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS ingredients_embedding_idx 
ON public.ingredients USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- RPC function for similar steps search
CREATE OR REPLACE FUNCTION get_similar_steps(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  recipe_id uuid,
  step_number int,
  instruction text,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    recipe_steps.id,
    recipe_steps.recipe_id,
    recipe_steps.step_number,
    recipe_steps.instruction,
    1 - (recipe_steps.embedding <=> query_embedding) as similarity
  FROM recipe_steps
  WHERE recipe_steps.embedding IS NOT NULL
    AND 1 - (recipe_steps.embedding <=> query_embedding) > match_threshold
  ORDER BY recipe_steps.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RPC function for similar recipes search
CREATE OR REPLACE FUNCTION get_similar_recipes(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  cuisine_type text,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    recipes.id,
    recipes.title,
    recipes.description,
    recipes.cuisine_type,
    1 - (recipes.embedding <=> query_embedding) as similarity
  FROM recipes
  WHERE recipes.embedding IS NOT NULL
    AND 1 - (recipes.embedding <=> query_embedding) > match_threshold
  ORDER BY recipes.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RPC function for ingredient analysis
CREATE OR REPLACE FUNCTION get_similar_ingredients(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  properties jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    ingredients.id,
    ingredients.name,
    ingredients.properties,
    1 - (ingredients.embedding <=> query_embedding) as similarity
  FROM ingredients
  WHERE ingredients.embedding IS NOT NULL
    AND 1 - (ingredients.embedding <=> query_embedding) > match_threshold
  ORDER BY ingredients.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;