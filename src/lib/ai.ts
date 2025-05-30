
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const API_KEY = 'AIzaSyBvKMw4KxRzYCq7V6b0n5s9Qh2F3j8P1kL9'; // Replace with actual API key

export const createChain = (chatHistory: Array<{ role: string; content: string }>) => {
  const model = new ChatGoogleGenerativeAI({
    apiKey: API_KEY,
    model: 'gemini-pro', // Use 'model' instead of 'modelName'
    temperature: 0.7,
  });

  return {
    invoke: async (prompt: string) => {
      try {
        const response = await model.invoke(prompt);
        return response.content as string;
      } catch (error) {
        console.error('AI API Error:', error);
        throw new Error('Không thể kết nối với AI service');
      }
    }
  };
};

export const formatChatHistory = (history: Array<{ role: string; content: string }>) => {
  return history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
};
