
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Map, HelpCircle, Clock, Sparkles, Network } from 'lucide-react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeaturePanelProps {
  extractedText: string;
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
  fileName: string;
}

export const FeaturePanel: React.FC<FeaturePanelProps> = ({
  extractedText,
  activeFeature,
  onFeatureSelect,
  fileName
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const analyzeContent = async (feature: string) => {
    setIsAnalyzing(true);
    onFeatureSelect(feature);
    
    if (feature === 'knowledge-graph') {
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
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }
    
    // Simulate AI analysis for other features
    setTimeout(() => {
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
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Phân tích nội dung: {fileName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant={activeFeature === 'summary' ? 'default' : 'outline'}
              onClick={() => analyzeContent('summary')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span>Tóm tắt</span>
            </Button>
            
            <Button
              variant={activeFeature === 'mindmap' ? 'default' : 'outline'}
              onClick={() => analyzeContent('mindmap')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Map className="w-6 h-6" />
              <span>Mind Map</span>
            </Button>
            
            <Button
              variant={activeFeature === 'knowledge-graph' ? 'default' : 'outline'}
              onClick={() => analyzeContent('knowledge-graph')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Network className="w-6 h-6" />
              <span>Knowledge Graph</span>
            </Button>
            
            <Button
              variant={activeFeature === 'faq' ? 'default' : 'outline'}
              onClick={() => analyzeContent('faq')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <HelpCircle className="w-6 h-6" />
              <span>FAQ</span>
            </Button>
            
            <Button
              variant={activeFeature === 'timeline' ? 'default' : 'outline'}
              onClick={() => analyzeContent('timeline')}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Clock className="w-6 h-6" />
              <span>Timeline</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeFeature && (
        <Card>
          <CardContent className="pt-6">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {activeFeature === 'knowledge-graph' 
                      ? 'Đang tạo Knowledge Graph với Google AI...' 
                      : 'Đang phân tích nội dung với AI...'
                    }
                  </p>
                </div>
              </div>
            ) : analysisResults[activeFeature] ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {analysisResults[activeFeature].title}
                </h3>
                
                {activeFeature === 'knowledge-graph' ? (
                  <KnowledgeGraph data={analysisResults[activeFeature].content} />
                ) : activeFeature === 'faq' ? (
                  <div className="space-y-4">
                    {analysisResults[activeFeature].content.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          {item.question}
                        </h4>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : activeFeature === 'timeline' ? (
                  <div className="space-y-4">
                    {analysisResults[activeFeature].content.map((item: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-blue-600">
                            {item.year}
                          </span>
                        </div>
                        <div className="flex-1 pt-4">
                          <p className="text-gray-800">{item.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {analysisResults[activeFeature].content}
                    </pre>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
