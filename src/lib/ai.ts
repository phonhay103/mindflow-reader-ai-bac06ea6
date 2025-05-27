import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("Missing VITE_GOOGLE_API_KEY environment variable");
}

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", // Luôn luôn sử dụng gemini-2.0-flash
  apiKey,
  temperature: 0.7,
});

// Create a base prompt template
const basePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a highly intelligent AI assistant that helps analyze and understand documents."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// Create a chain that includes chat history
export const createChain = (history: Array<HumanMessage | AIMessage | SystemMessage> = []) => {
  const chain = basePrompt.pipe(model).pipe(new StringOutputParser());
  return {
    invoke: (input: string) => chain.invoke({ input, history })
  };
};

// Helper function to format chat history
export const formatChatHistory = (messages: { role: string; content: string }[]): Array<HumanMessage | AIMessage | SystemMessage> => {
  return messages.map((msg) => {
    if (msg.role === "system") {
      return new SystemMessage(msg.content);
    }
    if (msg.role === "assistant") {
      return new AIMessage(msg.content);
    }
    return new HumanMessage(msg.content);
  });
};
