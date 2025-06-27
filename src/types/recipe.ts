export interface Recipe {
  id: string;
  user_id?: string;
  title: string;
  description: string | null;
  cuisine_type: string | null;
  created_at?: string;
  image_url: string | null;
  time: number | null;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
  required_cookware?: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  embedding?: any;
  }

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number | null;
  unit: string | null;
  preparation: string | null;
  ingredient?: Ingredient;
}

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  embedding?: any;
}