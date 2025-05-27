
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
      
      // Simulate PDF text extraction with more comprehensive sample text
      const mockText = `Trí tuệ nhân tạo (AI) đang thay đổi thế giới một cách mạnh mẽ và toàn diện. Cuốn sách này khám phá những tiến bộ vượt bậc trong lĩnh vực AI và Machine Learning, từ những khái niệm cơ bản đến các ứng dụng phức tạp trong thực tế.

Chương 1: Giới thiệu về Trí tuệ Nhân tạo
Trí tuệ nhân tạo là khả năng của máy tính để thực hiện các tác vụ thường yêu cầu trí thông minh của con người. Lịch sử phát triển AI bắt đầu từ những năm 1950 với Alan Turing và bài kiểm tra Turing nổi tiếng. Từ đó đến nay, AI đã trải qua nhiều giai đoạn phát triển, từ AI hẹp (Narrow AI) đến AI tổng quát (General AI) và siêu trí tuệ (Superintelligence).

Chương 2: Machine Learning và Deep Learning
Machine Learning là một nhánh của AI cho phép máy tính học hỏi từ dữ liệu mà không cần được lập trình cụ thể. Có ba loại chính: học có giám sát (Supervised Learning), học không giám sát (Unsupervised Learning), và học tăng cường (Reinforcement Learning). Deep Learning, một nhánh của Machine Learning, sử dụng mạng nơ-ron nhân tạo để mô phỏng cách thức hoạt động của não người.

Chương 3: Ứng dụng AI trong Thực tế
AI đang được ứng dụng rộng rãi trong nhiều lĩnh vực: y tế (chẩn đoán hình ảnh, phát hiện bệnh), giao thông (xe tự lái), tài chính (phát hiện gian lận, trading), giáo dục (học tập cá nhân hóa), và giải trí (trò chơi, content creation).

Chương 4: Thách thức và Cơ hội
Trong khi AI mang lại nhiều lợi ích, nó cũng đặt ra những thách thức về đạo đức, an toàn, và tác động xã hội. Vấn đề bias trong dữ liệu, sự thay thế lao động, và quyền riêng tư là những mối quan tâm chính. Tuy nhiên, nếu được phát triển và sử dụng đúng cách, AI có thể giải quyết nhiều vấn đề toàn cầu như biến đổi khí hậu, nghèo đói, và bệnh tật.

Chương 5: Tương lai của AI
Tương lai của AI hứa hẹn những đột phá đáng kinh ngạc. AI có thể trở thành đối tác đáng tin cậy trong nghiên cứu khoa học, phát triển thuốc mới, và giải quyết các vấn đề phức tạp. Tuy nhiên, việc đảm bảo AI an toàn và có lợi cho toàn nhân loại là trách nhiệm của tất cả chúng ta.

Kết luận:
AI không chỉ là một công nghệ, mà là một cuộc cách mạng đang định hình lại cách chúng ta sống, làm việc và tương tác với thế giới. Hiểu biết về AI và cách nó hoạt động là điều cần thiết cho mọi người trong thời đại số hóa này.`;
      
      setExtractedText(mockText);
      toast({
        title: "Upload thành công!",
        description: `File ${file.name} đã được xử lý và sẵn sàng phân tích với AI.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
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
