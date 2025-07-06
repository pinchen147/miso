import { geminiService, VisionAnalysisResult as GeminiVisionResult } from '@/lib/gemini';
import { Recipe } from '@/types/recipe';
import { VISION_PROMPT, getSubstitutionPrompt } from '@/prompts';
import { visionCache, createCacheKey } from '@/utils/cache';

export interface VisionAnalysisResult {
  objects: string[];
  actions: string[];
  cookingTools: string[];
  ingredients: string[];
  cookingState: 'preparing' | 'cooking' | 'plating' | 'unknown';
  confidence: number;
  summary: string;
}

export class VisionService {
  async analyzeFrame(base64Image: string): Promise<VisionAnalysisResult> {
    // Create cache key from image hash (simplified)
    const imageHash = base64Image.substring(0, 20);
    const cacheKey = createCacheKey('vision', imageHash);
    
    // Check cache first
    const cached = visionCache.get(cacheKey);
    if (cached) {
      console.log('Vision analysis cache hit');
      return cached;
    }

    try {
      // Use gemini service for vision analysis
      const result = await geminiService.analyzeFrame(base64Image);
      
      // Convert cooking state to our expected format
      const analysisResult: VisionAnalysisResult = {
        objects: result.objects,
        actions: result.actions,
        cookingTools: result.cookingTools,
        ingredients: result.ingredients,
        cookingState: this.mapCookingState(result.cookingState),
        confidence: result.confidence,
        summary: result.summary,
      };

      // Cache the result
      visionCache.set(cacheKey, analysisResult);
      
      return analysisResult;
    } catch (error) {
      console.error('Vision analysis error:', error);
      
      // Return fallback result
      return {
        objects: [],
        actions: [],
        cookingTools: [],
        ingredients: [],
        cookingState: 'unknown',
        confidence: 0,
        summary: 'Error analyzing scene',
      };
    }
  }

  private mapCookingState(geminiState: string): 'preparing' | 'cooking' | 'plating' | 'unknown' {
    // Map Gemini's cooking states to our expected format
    switch (geminiState.toLowerCase()) {
      case 'preparing':
        return 'preparing';
      case 'cooking':
        return 'cooking';
      case 'plating':
        return 'plating';
      case 'not_cooking':
      case 'idle':
      case 'unknown':
      default:
        return 'unknown';
    }
  }

  async generateRecipeIntro(recipe: Recipe, detectedTools: string[]): Promise<string> {
    const requiredTools = recipe.required_cookware || [];
    const missingTools = requiredTools.filter(tool => !detectedTools.includes(tool));

    try {
      const prompt = getSubstitutionPrompt(recipe.title, detectedTools, requiredTools, missingTools);
      const result = await geminiService.chat(prompt);
      
      return result.text;
    } catch (error) {
      console.error('Recipe intro generation error:', error);
      return `Welcome to the "${recipe.title}" recipe! Let's get started.`;
    }
  }
}

export const visionService = new VisionService();