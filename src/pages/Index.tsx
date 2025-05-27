
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { PDFUpload } from '../components/PDFUpload';
import { FeaturePanel } from '../components/FeaturePanel';
import { ChatInterface } from '../components/ChatInterface';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [activeFeature, setActiveFeature] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      setUploadedFile(file);
      // Simulate PDF text extraction (in real app, you'd use pdf-parse)
      const mockText = `Đây là nội dung được trích xuất từ file PDF: ${file.name}. 
      Nội dung sách bao gồm các chương về AI, machine learning, và các ứng dụng thực tế. 
      Cuốn sách cung cấp kiến thức cơ bản về trí tuệ nhân tạo và cách áp dụng vào cuộc sống.`;
      
      setExtractedText(mockText);
      toast({
        title: "Upload thành công!",
        description: `File ${file.name} đã được xử lý và sẵn sàng phân tích.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi upload",
        description: "Không thể xử lý file PDF. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureSelect = (feature: string) => {
    setActiveFeature(feature);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!uploadedFile ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                AI Book Reader
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Tải lên file PDF và khám phá sức mạnh của AI trong việc phân tích và hiểu nội dung sách
              </p>
            </div>
            
            <PDFUpload 
              onFileUpload={handleFileUpload} 
              isLoading={isLoading}
            />
            
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  📄
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Tóm tắt thông minh</h3>
                <p className="text-gray-600 text-sm">AI tạo ra bản tóm tắt ngắn gọn và chính xác nhất</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  🗺️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mind Map</h3>
                <p className="text-gray-600 text-sm">Trực quan hóa kiến thức với sơ đồ tư duy</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  ❓
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">FAQ</h3>
                <p className="text-gray-600 text-sm">Câu hỏi thường gặp được tạo tự động</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  ⏰
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Timeline</h3>
                <p className="text-gray-600 text-sm">Dòng thời gian các sự kiện quan trọng</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FeaturePanel 
                extractedText={extractedText}
                activeFeature={activeFeature}
                onFeatureSelect={handleFeatureSelect}
                fileName={uploadedFile.name}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ChatInterface extractedText={extractedText} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
