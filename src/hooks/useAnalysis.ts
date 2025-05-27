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
      const prompt = `Please provide a comprehensive summary of the following text in Vietnamese. Focus on the main ideas and key points:\n\n${text}\n\nFormat the summary with bullet points for better readability.`;
      const summary = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'summary': {
          title: "Tóm tắt nội dung",
          content: summary
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: summary }
      ]);

      toast({
        title: "Tóm tắt thành công!",
        description: "Nội dung đã được tóm tắt.",
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
      const prompt = `Create a hierarchical mind map in Vietnamese from the following text. Use emojis and proper indentation for better visualization:\n\n${text}\n\nFormat it as a tree structure with main topics and subtopics.`;
      const mindmap = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'mindmap': {
          title: "Sơ đồ tư duy",
          content: mindmap
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: mindmap }
      ]);

      toast({
        title: "Sơ đồ tư duy tạo thành công!",
        description: "Sơ đồ tư duy đã được tạo từ nội dung.",
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
      const prompt = `Generate a list of frequently asked questions and answers in Vietnamese based on the following text:\n\n${text}\n\nFormat the output as an array of objects with 'question' and 'answer' properties.`;
      const faqResponse = await chain.invoke(prompt);

      // Parse the response into the expected format
      const faqContent = JSON.parse(faqResponse);

      setAnalysisResults(prev => ({
        ...prev,
        'faq': {
          title: "Câu hỏi thường gặp",
          content: faqContent
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: faqResponse }
      ]);

      toast({
        title: "FAQ tạo thành công!",
        description: "Danh sách câu hỏi thường gặp đã được tạo.",
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
      const prompt = `Create a chronological timeline in Vietnamese from the following text. Extract and organize events by their dates or periods:\n\n${text}\n\nFormat the output with clear date markers and descriptions of events.`;
      const timeline = await chain.invoke(prompt);

      setAnalysisResults(prev => ({
        ...prev,
        'timeline': {
          title: "Dòng thời gian",
          content: timeline
        }
      }));

      setChatHistory(prev => [...prev, 
        { role: "human", content: text },
        { role: "assistant", content: timeline }
      ]);

      toast({
        title: "Timeline tạo thành công!",
        description: "Dòng thời gian đã được tạo từ nội dung.",
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
      }
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
