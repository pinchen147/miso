import OpenAI from 'openai';
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

if (!apiKey) {
  throw new Error('OpenAI API key not found in app configuration');
}

const openai = new OpenAI({
  apiKey,
});

export class OpenAIService {
  async embedText(texts: string[]): Promise<number[][]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('OpenAI embedding error:', error);
      throw new Error(`Failed to generate embeddings: ${error}`);
    }
  }

  async embedSingleText(text: string): Promise<number[]> {
    const embeddings = await this.embedText([text]);
    return embeddings[0];
  }
}

export const openaiService = new OpenAIService();