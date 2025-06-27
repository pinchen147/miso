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
      
      // Convert to our interface format
      const analysisResult: VisionAnalysisResult = {
        objects: result.objects,
        actions: result.actions,
        cookingTools: result.objects.filter(obj => 
          ['pan', 'pot', 'knife', 'spoon', 'spatula', 'bowl', 'plate'].some(tool => 
            obj.toLowerCase().includes(tool)
          )
        ),
        ingredients: result.objects.filter(obj => 
          ['onion', 'garlic', 'tomato', 'pepper', 'meat', 'fish', 'vegetable'].some(ingredient => 
            obj.toLowerCase().includes(ingredient)
          )
        ),
        cookingState: this.determineCookingState(result.actions),
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

  private determineCookingState(actions: string[]): 'preparing' | 'cooking' | 'plating' | 'unknown' {
    const actionString = actions.join(' ').toLowerCase();
    
    if (actionString.includes('chop') || actionString.includes('prep') || actionString.includes('wash')) {
      return 'preparing';
    }
    if (actionString.includes('cook') || actionString.includes('fry') || actionString.includes('boil') || actionString.includes('sauté')) {
      return 'cooking';
    }
    if (actionString.includes('plate') || actionString.includes('serve')) {
      return 'plating';
    }
    
    return 'unknown';
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