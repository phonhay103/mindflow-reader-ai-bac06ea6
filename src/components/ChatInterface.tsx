
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb } from 'lucide-react';
import { createChain, formatChatHistory } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  extractedText: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ extractedText }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi đã phân tích nội dung PDF của bạn. Hãy hỏi tôi bất kỳ điều gì về cuốn sách này!',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestions = [
    "Tóm tắt chương đầu tiên",
    "Các khái niệm chính trong sách là gì?",
    "Tác giả muốn truyền tải thông điệp gì?",
    "Những điểm mới lạ trong cuốn sách?",
    "Áp dụng kiến thức này như thế nào?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Create AI response using Google AI
      const chain = createChain(formatChatHistory(chatHistory));
      const prompt = `Bạn là một AI assistant chuyên về phân tích sách và văn bản. Dựa trên nội dung sau đây:

${extractedText}

Hãy trả lời câu hỏi của người dùng một cách chi tiết và hữu ích bằng tiếng Việt:

Câu hỏi: ${text}

Trả lời dựa trên nội dung đã được cung cấp và kiến thức của bạn.`;

      const aiResponse = await chain.invoke(prompt);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update chat history
      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: aiResponse }
      ]);

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Lỗi AI Chat",
        description: "Không thể tạo phản hồi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>Chat với AI Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'ai' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="space-y-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Gợi ý câu hỏi:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(suggestion)}
                className="text-xs"
                disabled={isTyping}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về nội dung sách..."
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage(inputValue)}
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
