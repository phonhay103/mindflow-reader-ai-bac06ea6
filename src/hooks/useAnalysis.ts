
import { useState } from 'react';
import { AnalysisResults } from '@/types/feature';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createChain, formatChatHistory } from '@/lib/ai';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const { toast } = useToast();

  const analyzeKnowledgeGraph = async (extractedText: string) => {
    try {
      setIsAnalyzing(true);
      console.log('Calling knowledge graph API...');
      const { data, error } = await supabase.functions.invoke('generate-knowledge-graph', {
        body: { text: extractedText }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Knowledge graph response:', data);
      
      setAnalysisResults(prev => ({
        ...prev,
        'knowledge-graph': {
          title: "Knowledge Graph",
          content: data.knowledgeGraph
        }
      }));

      toast({
        title: "Knowledge Graph tạo thành công!",
        description: "Sơ đồ tri thức đã được tạo từ nội dung văn bản.",
      });
    } catch (error) {
      console.error('Error generating knowledge graph:', error);
      toast({
        title: "Lỗi tạo Knowledge Graph",
        description: "Không thể tạo sơ đồ tri thức. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeSummary = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const chain = createChain(formatChatHistory(chatHistory));
      const prompt = `Hãy tóm tắt toàn diện nội dung văn bản sau bằng tiếng Việt. Tập trung vào các ý chính và điểm quan trọng:

${text}

Hãy định dạng tóm tắt với các bullet points để dễ đọc hơn. Bao gồm:
- Chủ đề chính
- Các ý tưởng quan trọng
- Kết luận hoặc thông điệp chính`;

      const summary = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'summary': {
          title: "Tóm tắt nội dung",
          content: summary
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: `Tóm tắt: ${text}` },
        { role: "assistant", content: summary }
      ]);

      toast({
        title: "Tóm tắt thành công!",
        description: "Nội dung đã được tóm tắt bằng AI.",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Lỗi tạo tóm tắt",
        description: "Không thể tóm tắt nội dung. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeMindMap = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const chain = createChain(formatChatHistory(chatHistory));
      const prompt = `Tạo một sơ đồ tư duy phân cấp bằng tiếng Việt từ văn bản sau. Sử dụng emoji và thụt lề phù hợp để trực quan hóa tốt hơn:

${text}

Định dạng như cấu trúc cây với các chủ đề chính và chủ đề phụ. Ví dụ:
🌟 Chủ đề chính
  📌 Điểm quan trọng 1
    ➤ Chi tiết 1
    ➤ Chi tiết 2
  📌 Điểm quan trọng 2
    ➤ Chi tiết 1
    ➤ Chi tiết 2

Hãy tạo sơ đồ tư duy chi tiết và có cấu trúc.`;

      const mindmap = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'mindmap': {
          title: "Sơ đồ tư duy",
          content: mindmap
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: `Tạo mind map: ${text}` },
        { role: "assistant", content: mindmap }
      ]);

      toast({
        title: "Sơ đồ tư duy tạo thành công!",
        description: "Sơ đồ tư duy đã được tạo bằng AI.",
      });
    } catch (error) {
      console.error('Error generating mind map:', error);
      toast({
        title: "Lỗi tạo sơ đồ tư duy",
        description: "Không thể tạo sơ đồ tư duy. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeFAQ = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const chain = createChain(formatChatHistory(chatHistory));
      const prompt = `Tạo danh sách câu hỏi thường gặp và câu trả lời bằng tiếng Việt dựa trên văn bản sau:

${text}

Tạo 5-8 câu hỏi phổ biến mà người đọc có thể có về nội dung này. Mỗi câu hỏi cần có câu trả lời chi tiết và dễ hiểu.

Định dạng đầu ra như một mảng JSON với các object có thuộc tính 'question' và 'answer':
[
  {
    "question": "Câu hỏi 1?",
    "answer": "Câu trả lời chi tiết 1"
  },
  {
    "question": "Câu hỏi 2?", 
    "answer": "Câu trả lời chi tiết 2"
  }
]

Chỉ trả về JSON, không có text khác.`;

      const faqResponse = await chain.invoke(prompt);

      // Parse the response into the expected format
      let faqContent;
      try {
        faqContent = JSON.parse(faqResponse);
      } catch (parseError) {
        console.error('Failed to parse FAQ JSON, using fallback format');
        // Fallback: create FAQ from text response
        const lines = faqResponse.split('\n').filter(line => line.trim());
        faqContent = [];
        let currentQuestion = '';
        let currentAnswer = '';
        
        for (const line of lines) {
          if (line.includes('?')) {
            if (currentQuestion && currentAnswer) {
              faqContent.push({ question: currentQuestion, answer: currentAnswer });
            }
            currentQuestion = line.trim();
            currentAnswer = '';
          } else if (line.trim() && currentQuestion) {
            currentAnswer += line.trim() + ' ';
          }
        }
        
        if (currentQuestion && currentAnswer) {
          faqContent.push({ question: currentQuestion, answer: currentAnswer.trim() });
        }
      }

      setAnalysisResults(prev => ({
        ...prev,
        'faq': {
          title: "Câu hỏi thường gặp",
          content: faqContent
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: `Tạo FAQ: ${text}` },
        { role: "assistant", content: faqResponse }
      ]);

      toast({
        title: "FAQ tạo thành công!",
        description: "Danh sách câu hỏi thường gặp đã được tạo bằng AI.",
      });
    } catch (error) {
      console.error('Error generating FAQ:', error);
      toast({
        title: "Lỗi tạo FAQ",
        description: "Không thể tạo danh sách câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeTimeline = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const chain = createChain(formatChatHistory(chatHistory));
      const prompt = `Tạo một dòng thời gian theo thứ tự thời gian bằng tiếng Việt từ văn bản sau. Trích xuất và sắp xếp các sự kiện theo ngày tháng hoặc thời kỳ:

${text}

Nếu văn bản không có thông tin thời gian cụ thể, hãy tạo timeline logic dựa trên trình tự diễn ra của các ý tưởng hoặc chủ đề.

Định dạng đầu ra với các mốc thời gian rõ ràng và mô tả sự kiện. Ví dụ:
📅 2020: Sự kiện quan trọng đầu tiên
📅 2021: Phát triển tiếp theo  
📅 2022: Kết quả cuối cùng

Hoặc nếu không có thời gian cụ thể:
📋 Bước 1: Giới thiệu vấn đề
📋 Bước 2: Phân tích nguyên nhân
📋 Bước 3: Đưa ra giải pháp`;

      const timeline = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'timeline': {
          title: "Dòng thời gian",
          content: timeline
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: `Tạo timeline: ${text}` },
        { role: "assistant", content: timeline }
      ]);

      toast({
        title: "Timeline tạo thành công!",
        description: "Dòng thời gian đã được tạo bằng AI.",
      });
    } catch (error) {
      console.error('Error generating timeline:', error);
      toast({
        title: "Lỗi tạo timeline",
        description: "Không thể tạo dòng thời gian. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeFeature = async (feature: string, text: string) => {
    if (!text.trim()) {
      toast({
        title: "Lỗi",
        description: "Không có nội dung để phân tích. Vui lòng tải lên file PDF trước.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      switch (feature) {
        case 'knowledge-graph':
          await analyzeKnowledgeGraph(text);
          break;
        case 'summary':
          await analyzeSummary(text);
          break;
        case 'mindmap':
          await analyzeMindMap(text);
          break;
        case 'faq':
          await analyzeFAQ(text);
          break;
        case 'timeline':
          await analyzeTimeline(text);
          break;
        default:
          console.error('Unknown feature:', feature);
          toast({
            title: "Lỗi",
            description: "Tính năng không được hỗ trợ.",
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error('Error in analyzeFeature:', error);
      toast({
        title: "Lỗi phân tích",
        description: "Đã xảy ra lỗi khi phân tích nội dung. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analysisResults,
    analyzeFeature
  };
};
