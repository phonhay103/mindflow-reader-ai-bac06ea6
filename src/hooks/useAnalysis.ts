
import { useState } from 'react';
import { createChain } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/types/feature';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});
  const { toast } = useToast();

  const analyzeFeature = async (feature: string, extractedText: string) => {
    setIsAnalyzing(true);
    
    try {
      const chain = createChain([]);
      let prompt = '';
      let title = '';

      switch (feature) {
        case 'summary':
          title = 'Tóm tắt nội dung';
          prompt = `Hãy tóm tắt nội dung sau đây một cách ngắn gọn và dễ hiểu bằng tiếng Việt:\n\n${extractedText}`;
          break;
        case 'knowledge-graph':
          title = 'Sơ đồ tư duy';
          prompt = `Tạo một sơ đồ tư duy (mind map) từ nội dung sau. Trả về dưới dạng JSON với nodes và edges:\n\n${extractedText}`;
          break;
        case 'faq':
          title = 'Câu hỏi thường gặp';
          prompt = `Tạo 5-7 câu hỏi thường gặp và câu trả lời từ nội dung sau bằng tiếng Việt:\n\n${extractedText}`;
          break;
        case 'timeline':
          title = 'Dòng thời gian';
          prompt = `Tạo một timeline (dòng thời gian) các sự kiện quan trọng từ nội dung sau bằng tiếng Việt:\n\n${extractedText}`;
          break;
        case 'key-insights':
          title = 'Phân tích chuyên sâu';
          prompt = `Phân tích và đưa ra những insight (hiểu biết sâu sắc) chính từ nội dung sau bằng tiếng Việt:\n\n${extractedText}`;
          break;
        default:
          throw new Error('Unknown feature');
      }

      const result = await chain.invoke(prompt);
      
      let content = result;
      
      // Parse JSON for specific features
      if (feature === 'knowledge-graph') {
        try {
          content = JSON.parse(result);
        } catch {
          content = { nodes: [], edges: [] };
        }
      } else if (feature === 'faq') {
        try {
          content = JSON.parse(result);
        } catch {
          // Fallback to simple text parsing
          content = result.split('\n\n').map((item: string, index: number) => ({
            question: `Câu hỏi ${index + 1}`,
            answer: item
          }));
        }
      } else if (feature === 'timeline') {
        try {
          content = JSON.parse(result);
        } catch {
          // Fallback to simple text parsing
          content = result.split('\n').filter((line: string) => line.trim()).map((item: string) => ({
            year: '2024',
            event: item
          }));
        }
      }

      setAnalysisResults(prev => ({
        ...prev,
        [feature]: { title, content }
      }));

      toast({
        title: "Phân tích hoàn thành!",
        description: `${title} đã được tạo thành công.`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Lỗi phân tích",
        description: "Không thể phân tích nội dung. Vui lòng thử lại.",
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
