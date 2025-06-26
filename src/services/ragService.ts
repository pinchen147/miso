import OpenAI from 'openai';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { VisionAnalysisResult } from './visionService';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key not found in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

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
  properties: any;
  similarity: number;
}

export interface RAGContext {
  relevantSteps: RelevantStep[];
  relevantIngredients: RelevantIngredient[];
  embedding: number[];
}

export class RAGService {
  private embeddingCache = new Map<string, number[]>();

  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!;
    }

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      const embedding = response.data[0].embedding;
      
      // Cache the result (limit cache size to prevent memory issues)
      if (this.embeddingCache.size > 100) {
        const firstKey = this.embeddingCache.keys().next().value;
        this.embeddingCache.delete(firstKey);
      }
      this.embeddingCache.set(text, embedding);

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

  async generateContextualGuidance(
    visionResult: VisionAnalysisResult,
    currentStep: string,
    context: RAGContext,
    previousSteps?: string[]
  ): Promise<string> {
    try {
      const systemPrompt = `You are Miso AI, an expert cooking assistant. Analyze the current cooking scene and provide helpful, encouraging guidance.

CURRENT SITUATION:
Step: "${currentStep}"
Scene: ${visionResult.summary}
Objects visible: ${visionResult.objects.join(', ')}
Actions detected: ${visionResult.actions.join(', ')}
Cooking tools: ${visionResult.cookingTools.join(', ')}
Ingredients visible: ${visionResult.ingredients.join(', ')}
Cooking state: ${visionResult.cookingState}

RELEVANT CONTEXT FROM RECIPE DATABASE:
${context.relevantSteps.map(step => 
  `• Step ${step.step_number}: ${step.instruction} (similarity: ${step.similarity.toFixed(2)})`
).join('\n')}

RELEVANT INGREDIENTS:
${context.relevantIngredients.map(ing => 
  `• ${ing.name} (similarity: ${ing.similarity.toFixed(2)})`
).join('\n')}

${previousSteps ? `PREVIOUS STEPS COMPLETED:\n${previousSteps.join('\n')}` : ''}

INSTRUCTIONS:
1. Assess current progress vs expected step
2. Provide specific next action
3. Include helpful tips from similar contexts
4. Be encouraging and conversational
5. Keep response under 150 words
6. Use "you" language, speak directly to the cook`;

      const userPrompt = `What should I do next in this cooking step?`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || `Continue with: ${currentStep}`;
    } catch (error) {
      console.error('Error generating contextual guidance:', error);
      return `Continue with: ${currentStep}`;
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