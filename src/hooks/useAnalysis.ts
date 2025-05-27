
import { useState } from 'react';
import { AnalysisResults } from '@/types/feature';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  const { toast } = useToast();

  const analyzeKnowledgeGraph = async (extractedText: string) => {
    try {
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
    }
  };

  const analyzeMockFeature = (feature: string, fileName: string) => {
    const mockResults = {
      summary: {
        title: "Tóm tắt nội dung",
        content: `Cuốn sách "${fileName}" tập trung vào chủ đề trí tuệ nhân tạo và machine learning. Nội dung chính bao gồm:
        
• Giới thiệu về AI và các khái niệm cơ bản
• Các thuật toán machine learning phổ biến  
• Ứng dụng thực tế của AI trong cuộc sống
• Hướng dẫn triển khai các mô hình AI
• Xu hướng phát triển tương lai của AI

Cuốn sách phù hợp cho người mới bắt đầu và có kinh nghiệm trong lĩnh vực công nghệ.`
      },
      mindmap: {
        title: "Sơ đồ tư duy",
        content: `
🧠 TRÍNH TỨ NHÂN TẠO
├── 📚 Kiến thức cơ bản
│   ├── Machine Learning
│   ├── Deep Learning  
│   └── Neural Networks
├── 🔧 Thuật toán
│   ├── Supervised Learning
│   ├── Unsupervised Learning
│   └── Reinforcement Learning
├── 💡 Ứng dụng
│   ├── Computer Vision
│   ├── Natural Language Processing
│   └── Robotics
└── 🚀 Tương lai
    ├── AGI (Artificial General Intelligence)
    ├── Quantum Computing
    └── AI Ethics`
      },
      faq: {
        title: "Câu hỏi thường gặp",
        content: [
          {
            question: "AI khác gì với Machine Learning?",
            answer: "AI là khái niệm tổng quát về máy móc có thể thực hiện các tác vụ thông minh, còn Machine Learning là một nhánh con của AI tập trung vào việc học từ dữ liệu."
          },
          {
            question: "Làm thế nào để bắt đầu học AI?",
            answer: "Nên bắt đầu với toán học cơ bản (statistics, linear algebra), sau đó học Python và các thư viện như scikit-learn, TensorFlow."
          },
          {
            question: "AI có thể thay thế con người không?",
            answer: "AI có thể tự động hóa nhiều công việc nhưng cũng tạo ra cơ hội việc làm mới. Quan trọng là con người cần thích ứng và học kỹ năng mới."
          }
        ]
      },
      timeline: {
        title: "Dòng thời gian",
        content: [
          { year: "1950", event: "Alan Turing đề xuất 'Turing Test'" },
          { year: "1956", event: "Thuật ngữ 'Artificial Intelligence' được đặt ra" },
          { year: "1980s", event: "Expert Systems phát triển mạnh" },
          { year: "1997", event: "Deep Blue của IBM thắng Gary Kasparov" },
          { year: "2006", event: "Geoffrey Hinton giới thiệu Deep Learning" },
          { year: "2012", event: "AlexNet cách mạng hóa Computer Vision" },
          { year: "2016", event: "AlphaGo thắng Lee Sedol" },
          { year: "2020", event: "GPT-3 ra mắt với 175 billion parameters" },
          { year: "2023", event: "ChatGPT và cuộc cách mạng AI generative" }
        ]
      }
    };
    
    setAnalysisResults(prev => ({
      ...prev,
      [feature]: mockResults[feature as keyof typeof mockResults]
    }));
  };

  const analyzeContent = async (feature: string, extractedText: string, fileName: string, onFeatureSelect: (feature: string) => void) => {
    setIsAnalyzing(true);
    onFeatureSelect(feature);
    
    if (feature === 'knowledge-graph') {
      await analyzeKnowledgeGraph(extractedText);
      setIsAnalyzing(false);
      return;
    }
    
    // Simulate AI analysis for other features
    setTimeout(() => {
      analyzeMockFeature(feature, fileName);
      setIsAnalyzing(false);
    }, 2000);
  };

  return {
    isAnalyzing,
    analysisResults,
    analyzeContent
  };
};
