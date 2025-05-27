
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userQuestion: string): string => {
    const responses = {
      "tóm tắt": "Dựa trên nội dung đã phân tích, cuốn sách tập trung vào việc giới thiệu các khái niệm cơ bản về AI và machine learning. Tác giả trình bày một cách dễ hiểu về cách AI hoạt động và ứng dụng trong thực tế.",
      "khái niệm": "Các khái niệm chính bao gồm: Machine Learning, Deep Learning, Neural Networks, và các thuật toán AI cơ bản. Cuốn sách cũng đề cập đến ethical AI và tương lai của công nghệ này.",
      "thông điệp": "Tác giả muốn truyền tải rằng AI không phải là thứ gì đó xa vời mà là công nghệ có thể được áp dụng để giải quyết các vấn đề thực tế. Quan trọng là phải hiểu và sử dụng AI một cách có trách nhiệm.",
      "điểm mới": "Điểm mới lạ là cách tác giả kết hợp lý thuyết với các ví dụ thực tế, giúp người đọc dễ dàng hình dung và áp dụng kiến thức vào công việc.",
      "áp dụng": "Kiến thức trong sách có thể áp dụng vào nhiều lĩnh vực như phân tích dữ liệu, tự động hóa quy trình, và phát triển sản phẩm thông minh."
    };

    for (const [key, response] of Object.entries(responses)) {
      if (userQuestion.toLowerCase().includes(key)) {
        return response;
      }
    }

    return "Đây là một câu hỏi thú vị! Dựa trên nội dung sách, tôi có thể giúp bạn hiểu rõ hơn về chủ đề này. Bạn có thể cụ thể hóa câu hỏi để tôi trả lời chính xác hơn không?";
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
                  <p className="text-sm">{message.text}</p>
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              className="flex-1"
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
