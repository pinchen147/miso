import { openaiService } from '@/lib/openai';
import { geminiService } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { VisionAnalysisResult } from './visionService';
import { RecipeStep } from '@/types/recipe';
import { getRagPrompt } from '@/prompts';
import { ragCache, embeddingCache, createCacheKey } from '@/utils/cache';

export interface RelevantStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  similarity: number;
}

export interface RelevantIngredient {
  id: string;
  name: string;
  similarity: number;
}

export interface RAGContext {
  relevantSteps: RelevantStep[];
  relevantIngredients: RelevantIngredient[];
  embedding: number[];
}

export class RAGService {
  async generateEmbedding(text: string): Promise<number[]> {
    const cacheKey = createCacheKey('embedding', text);
    
    // Check cache first
    const cached = embeddingCache.get(cacheKey);
    if (cached) {
      console.log('Embedding cache hit');
      return cached;
    }

    try {
      const embedding = await openaiService.embedSingleText(text);
      
      // Cache the result
      embeddingCache.set(cacheKey, embedding);

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async getRelevantContext(
    visionResult: VisionAnalysisResult,
    currentStep: string,
    matchThreshold: number = 0.7,
    maxResults: number = 5
  ): Promise<RAGContext> {
    try {
      // Create query text from vision analysis and current step
      const queryText = this.createQueryText(visionResult, currentStep);
      
      // Generate embedding for the query
      const embedding = await this.generateEmbedding(queryText);

      // Get relevant steps and ingredients in parallel
      const [relevantSteps, relevantIngredients] = await Promise.all([
        this.getSimilarSteps(embedding, matchThreshold, maxResults),
        this.getSimilarIngredients(embedding, matchThreshold, maxResults),
      ]);

      return {
        relevantSteps,
        relevantIngredients,
        embedding,
      };
    } catch (error) {
      console.error('Error getting relevant context:', error);
      return {
        relevantSteps: [],
        relevantIngredients: [],
        embedding: [],
      };
    }
  }

  private createQueryText(visionResult: VisionAnalysisResult, currentStep: string): string {
    const queryParts = [
      `Current step: ${currentStep}`,
      `Scene: ${visionResult.summary}`,
      `Objects: ${visionResult.objects.join(', ')}`,
      `Actions: ${visionResult.actions.join(', ')}`,
      `Tools: ${visionResult.cookingTools.join(', ')}`,
      `Ingredients: ${visionResult.ingredients.join(', ')}`,
      `State: ${visionResult.cookingState}`,
    ].filter(part => !part.endsWith(': ') && !part.endsWith(': unknown'));

    return queryParts.join(' • ');
  }

  private async getSimilarSteps(
    embedding: number[],
    matchThreshold: number,
    matchCount: number
  ): Promise<RelevantStep[]> {
    try {
      const { data, error } = await supabase.rpc('get_similar_steps', {
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (error) {
        console.error('Error fetching similar steps:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSimilarSteps:', error);
      return [];
    }
  }

  private async getSimilarIngredients(
    embedding: number[],
    matchThreshold: number,
    matchCount: number
  ): Promise<RelevantIngredient[]> {
    try {
      const { data, error } = await supabase.rpc('get_similar_ingredients', {
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (error) {
        console.error('Error fetching similar ingredients:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSimilarIngredients:', error);
      return [];
    }
  }

  async generateGuidance(
    currentStep: RecipeStep,
    visionResult: VisionAnalysisResult,
    completedSteps: RecipeStep[] = [],
    k: number = 4
  ): Promise<string> {
    try {
      console.log('🍳 Generating cooking guidance...');
      
      const summary = [
        `Current step #${currentStep.step_number}: ${currentStep.instruction}`,
        `Completed: ${completedSteps.map(s => s.instruction).join('; ')}`,
        `Vision sees: ${visionResult.objects.join(', ')}`,
        visionResult.actions.length 
          ? `Vision detected actions: ${visionResult.actions.join(', ')}`
          : '',
        `Cooking state: ${visionResult.cookingState}`,
        `Scene summary: ${visionResult.summary}`
      ].filter(Boolean).join('\n');

      console.log('🍳 Context summary prepared');

      const embedding = await this.generateEmbedding(summary);
      console.log('🍳 Embedding generated');

      const [relevantSteps, relevantIngredients] = await Promise.all([
        this.getSimilarSteps(embedding, 0.6, k),
        this.getSimilarIngredients(embedding, 0.6, k)
      ]);
      
      console.log('🍳 RAG context retrieved:', {
        steps: relevantSteps.length,
        ingredients: relevantIngredients.length
      });

      const prompt = getRagPrompt(
        currentStep.instruction,
        visionResult.summary,
        relevantSteps.map(s => s.instruction),
        relevantIngredients.map(i => i.name)
      );

      console.log('🍳 Calling Gemini for guidance...');
      const result = await geminiService.chat(prompt);
      
      console.log('🍳 ✅ Guidance generated successfully');
      return result.text || `Continue with: ${currentStep.instruction}`;

    } catch (error) {
      console.error('🍳 ❌ Error in generateGuidance - Full error:', error);
      console.error('🍳 ❌ Error type:', typeof error);
      console.error('🍳 ❌ Error message:', error instanceof Error ? error.message : String(error));
      
      // Return a helpful fallback
      return `Continue with: ${currentStep.instruction}`;
    }
  }

  // Test function for validation
  async testSimilaritySearch(query: string): Promise<{
    steps: RelevantStep[];
    ingredients: RelevantIngredient[];
    queryEmbedding: number[];
  }> {
    const embedding = await this.generateEmbedding(query);
    const steps = await this.getSimilarSteps(embedding, 0.5, 3);
    const ingredients = await this.getSimilarIngredients(embedding, 0.5, 3);
    
    return {
      steps,
      ingredients,
      queryEmbedding: embedding,
    };
  }
}

export const ragService = new RAGService();