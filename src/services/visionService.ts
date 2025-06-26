import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key not found in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeFrame(base64Image: string): Promise<VisionAnalysisResult> {
    try {
      const prompt = `
        Analyze this cooking scene image and identify:
        1. Visible objects (pans, bowls, cutting boards, etc.)
        2. Current cooking actions (chopping, stirring, heating, etc.)
        3. Cooking tools and equipment
        4. Visible ingredients
        5. Current cooking state (preparing, cooking, plating, unknown)
        6. Your confidence level (0-1)
        
        Respond in JSON format:
        {
          "objects": ["list of visible objects"],
          "actions": ["list of current actions"],
          "cookingTools": ["list of cooking tools"],
          "ingredients": ["list of visible ingredients"],
          "cookingState": "preparing|cooking|plating|unknown",
          "confidence": 0.85,
          "summary": "Brief description of what's happening in the scene"
        }
        
        Be specific but concise. Focus on cooking-relevant details.
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const parsed = JSON.parse(text.replace(/```json\n?|```\n?/g, ''));
      
      return {
        objects: parsed.objects || [],
        actions: parsed.actions || [],
        cookingTools: parsed.cookingTools || [],
        ingredients: parsed.ingredients || [],
        cookingState: parsed.cookingState || 'unknown',
        confidence: parsed.confidence || 0.5,
        summary: parsed.summary || 'Unable to analyze scene',
      };
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

  async generateStepGuidance(
    visionResult: VisionAnalysisResult,
    currentStep: string,
    relevantContext: string[]
  ): Promise<string> {
    try {
      const prompt = `
        You are an AI cooking assistant. Based on the current cooking scene and recipe step, provide helpful guidance.

        Current Step: "${currentStep}"
        
        Scene Analysis:
        - Objects visible: ${visionResult.objects.join(', ')}
        - Current actions: ${visionResult.actions.join(', ')}
        - Cooking tools: ${visionResult.cookingTools.join(', ')}
        - Ingredients visible: ${visionResult.ingredients.join(', ')}
        - Cooking state: ${visionResult.cookingState}
        - Scene summary: ${visionResult.summary}
        
        Relevant Context from Recipe Database:
        ${relevantContext.join('\n')}
        
        Provide:
        1. Assessment of current progress
        2. Next action needed
        3. Tips or warnings if applicable
        4. Encouragement
        
        Keep response conversational, helpful, and under 100 words.
        Speak directly to the cook using "you" language.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Step guidance generation error:', error);
      return `Continue with: ${currentStep}`;
    }
  }
}

export const visionService = new VisionService();