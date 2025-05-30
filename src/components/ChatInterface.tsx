
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb, Trash2, RefreshCw } from 'lucide-react';
import { createChain } from '@/lib/ai';
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
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Xin chào! Tôi đã phân tích nội dung PDF của bạn. Hãy hỏi tôi bất kỳ điều gì về cuốn sách này!',
      sender: 'ai',
      timestamp: new Date()
    }]);
    setChatHistory([]);
    toast({
      title: "Đã xóa cuộc trò chuyện",
      description: "Lịch sử chat đã được làm mới.",
    });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

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
      const chain = createChain(chatHistory); // Pass the array directly
      const prompt = `Bạn là một AI assistant chuyên về phân tích sách và văn bản. Dựa trên nội dung sau đây:

${extractedText}

Hãy trả lời câu hỏi của người dùng một cách chi tiết và hữu ích bằng tiếng Việt. Nếu câu hỏi không liên quan đến nội dung, hãy gợi ý người dùng hỏi về nội dung sách.

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
      
      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: aiResponse }
      ]);

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.',
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
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <Card className="h-[600px] lg:h-[700px] flex flex-col shadow-lg">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="text-lg">AI Assistant</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearChat}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 border'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'ai' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 border rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-blue-600" />
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
          <div className="flex items-center space-x-2 text-sm text-gray-600">
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
                className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                disabled={isTyping}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về nội dung sách..."
              onKeyPress={handleKeyPress}
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={isTyping}
            />
            <Button 
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
