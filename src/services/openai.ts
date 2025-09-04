import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openaiClient: OpenAI | null = null;

if (apiKey && apiKey !== 'your_openai_api_key_here') {
  openaiClient = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatWithGPT = async (messages: ChatMessage[]): Promise<string> => {
  if (!openaiClient) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an AI healthcare training assistant for Cultural Staffing Solutions, specializing in Northern Ireland's healthcare system (HSC). 
      You help healthcare professionals with:
      - Training and development guidance
      - Healthcare procedures and best practices
      - NMC (Nursing and Midwifery Council) standards and regulations
      - Cultural sensitivity in healthcare settings
      - Professional development advice
      
      Be helpful, professional, and provide accurate information relevant to healthcare workers in Northern Ireland.`
    };

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI API key in the .env file.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your OpenAI account.');
      }
    }
    throw new Error('Failed to get response from AI. Please try again.');
  }
};

export const isOpenAIConfigured = (): boolean => {
  return apiKey !== undefined && apiKey !== 'your_openai_api_key_here' && apiKey.length > 0;
};