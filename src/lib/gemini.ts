import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import { VISION_PROMPT, getGuidancePrompt } from '@/prompts';

const apiKey = Constants.expoConfig?.extra?.geminiApiKey;

console.log('🤖 Gemini API key status:', apiKey ? 'FOUND' : 'MISSING');
console.log('🤖 API key length:', apiKey?.length || 0);

if (!apiKey) {
  throw new Error('Gemini API key not found in app configuration');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface VisionAnalysisResult {
  objects: string[];
  actions: string[];
  cookingTools: string[];
  ingredients: string[];
  cookingState: string;
  confidence: number;
  summary: string;
}

export interface ChatResponse {
  text: string;
  confidence: number;
}

export class GeminiService {
  private visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Fast model for vision analysis
  private chatModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // More capable model for text generation

  async analyzeFrame(base64Image: string): Promise<VisionAnalysisResult> {
    try {
      console.log('🤖 Using Gemini 2.5 Flash for vision analysis');
      const result = await this.visionModel.generateContent([
        VISION_PROMPT,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const text = result.response.text();
      
      // Clean and parse JSON response
      try {
        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?|```\n?/g, '').trim();
        
        // Try to extract JSON if there's extra text
        let jsonText = cleanText;
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          jsonText = cleanText.substring(jsonStart, jsonEnd + 1);
        }
        
        const parsed = JSON.parse(jsonText);
        return {
          objects: parsed.objects || [],
          actions: parsed.actions || [],
          cookingTools: parsed.cookingTools || [],
          ingredients: parsed.ingredients || [],
          cookingState: parsed.cookingState || 'unknown',
          confidence: parsed.confidence || 0.8,
          summary: parsed.summary || 'Cooking scene analysis'
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini vision response:', parseError);
        console.error('Original text:', text);
        
        // If JSON parsing fails, create a reasonable response from the text
        return {
          objects: [],
          actions: [],
          cookingTools: [],
          ingredients: [],
          cookingState: 'unknown',
          confidence: 0.3,
          summary: text.substring(0, 150) || 'Unable to analyze scene'
        };
      }
    } catch (error) {
      console.error('Gemini vision analysis error:', error);
      throw new Error(`Vision analysis failed: ${error}`);
    }
  }

  async chat(prompt: string, retries: number = 2): Promise<ChatResponse> {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        console.log(`🤖 Gemini chat attempt ${attempt}/${retries + 1} using 1.5 Pro`);
        
        const result = await this.chatModel.generateContent(prompt);
        const text = result.response.text();
        
        console.log('🤖 ✅ Gemini chat successful');
        return {
          text,
          confidence: 0.9
        };
      } catch (error) {
        console.error(`🤖 ❌ Gemini chat attempt ${attempt} failed:`, error);
        
        if (attempt <= retries) {
          const delay = attempt * 1000; // 1s, 2s delay
          console.log(`🤖 ⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // All retries failed
        console.error('🤖 ❌ All Gemini chat attempts failed');
        throw new Error(`Chat completion failed after ${retries + 1} attempts: ${error}`);
      }
    }
    
    // This should never be reached
    throw new Error('Unexpected error in chat method');
  }

  async generateGuidance(
    currentStep: string,
    visionSummary: string,
    relevantContext: string[]
  ): Promise<string> {
    const prompt = getGuidancePrompt(currentStep, visionSummary, relevantContext);
    const response = await this.chat(prompt);
    return response.text;
  }
}

export const geminiService = new GeminiService();