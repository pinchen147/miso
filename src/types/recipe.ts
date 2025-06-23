export interface Recipe {
  id: string;
  title: string;
  description: string;
  featured?: boolean;
  cuisine?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  estimatedTime?: number; // in minutes
  ingredients?: Ingredient[];
  steps?: RecipeStep[];
  image?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  duration?: number; // in minutes
  temperature?: number;
  ingredients?: string[]; // ingredient IDs involved in this step
}