
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
      
      // Enhanced mock text for better AI analysis
      const mockText = `Trí tuệ nhân tạo (AI) đang thay đổi thế giới một cách mạnh mẽ và toàn diện. Cuốn sách này khám phá những tiến bộ vượt bậc trong lĩnh vực AI và Machine Learning, từ những khái niệm cơ bản đến các ứng dụng phức tạp trong thực tế.

Chương 1: Giới thiệu về Trí tuệ Nhân tạo
Trí tuệ nhân tạo là khả năng của máy tính để thực hiện các tác vụ thường yêu cầu trí thông minh của con người. Lịch sử phát triển AI bắt đầu từ những năm 1950 với Alan Turing và bài kiểm tra Turing nổi tiếng. Từ đó đến nay, AI đã trải qua nhiều giai đoạn phát triển, từ AI hẹp (Narrow AI) đến AI tổng quát (General AI) và siêu trí tuệ (Superintelligence).

Các khái niệm chính:
- Machine Learning: Học máy cho phép hệ thống tự động cải thiện hiệu suất thông qua kinh nghiệm
- Deep Learning: Mạng nơ-ron sâu mô phỏng cách thức hoạt động của não người
- Natural Language Processing: Xử lý ngôn ngữ tự nhiên giúp máy tính hiểu và tương tác bằng ngôn ngữ con người
- Computer Vision: Thị giác máy tính cho phép nhận diện và xử lý hình ảnh

Chương 2: Machine Learning và Deep Learning
Machine Learning là một nhánh của AI cho phép máy tính học hỏi từ dữ liệu mà không cần được lập trình cụ thể. Có ba loại chính:

1. Học có giám sát (Supervised Learning): Sử dụng dữ liệu được gán nhãn để đào tạo mô hình
2. Học không giám sát (Unsupervised Learning): Tìm kiếm mẫu trong dữ liệu không được gán nhãn
3. Học tăng cường (Reinforcement Learning): Học thông qua tương tác với môi trường và nhận phản hồi

Deep Learning sử dụng mạng nơ-ron nhân tạo với nhiều lớp ẩn để xử lý dữ liệu phức tạp như hình ảnh, âm thanh và văn bản.

Chương 3: Ứng dụng AI trong Thực tế
AI đang được ứng dụng rộng rãi trong nhiều lĩnh vực:

Y tế:
- Chẩn đoán hình ảnh y tế với độ chính xác cao
- Phát hiện sớm các bệnh ung thư
- Phát triển thuốc mới thông qua AI
- Robot phẫu thuật chính xác

Giao thông:
- Xe tự lái với công nghệ cảm biến tiên tiến
- Tối ưu hóa giao thông đô thị
- Dự đoán và phòng ngừa tai nạn

Tài chính:
- Phát hiện gian lận tự động
- Trading algorithmique
- Đánh giá rủi ro tín dụng
- Chatbot tư vấn tài chính

Giáo dục:
- Học tập cá nhân hóa
- Đánh giá tự động
- Tutor AI thông minh
- Nội dung học tập thích ứng

Chương 4: Thách thức và Cơ hội
Mặc dù AI mang lại nhiều lợi ích, nó cũng đặt ra những thách thức nghiêm trọng:

Thách thức đạo đức:
- Bias trong dữ liệu và thuật toán
- Quyền riêng tư và bảo mật dữ liệu
- Trách nhiệm và giải trình của AI
- Công bằng trong tiếp cận công nghệ

Tác động xã hội:
- Thay thế lao động và thất nghiệp
- Bất bình đẳng kỹ thuật số
- Phụ thuộc vào công nghệ
- An ninh mạng và AI weaponization

Cơ hội phát triển:
- Giải quyết các vấn đề toàn cầu như biến đổi khí hậu
- Nâng cao chất lượng cuộc sống
- Tăng năng suất lao động
- Khám phá khoa học mới

Chương 5: Tương lai của AI
Tương lai của AI hứa hẹn những đột phá đáng kinh ngạc:

Các xu hướng chính:
- AI tổng quát (AGI) có thể thực hiện mọi tác vụ trí tuệ
- Quantum computing kết hợp với AI
- Brain-computer interface
- AI trong không gian và khám phá vũ trụ

Chuẩn bị cho tương lai:
- Giáo dục và đào tạo lại lực lượng lao động
- Phát triển khung pháp lý cho AI
- Hợp tác quốc tế trong nghiên cứu AI
- Đảm bảo AI an toàn và có lợi cho nhân loại

Kết luận:
AI không chỉ là một công nghệ, mà là một cuộc cách mạng đang định hình lại cách chúng ta sống, làm việc và tương tác với thế giới. Việc hiểu biết về AI và cách nó hoạt động là điều cần thiết cho mọi người trong thời đại số hóa này. Thành công trong việc tích hợp AI phụ thuộc vào khả năng cân bằng giữa lợi ích và rủi ro, đảm bảo rằng công nghệ này phục vụ cho lợi ích chung của toàn nhân loại.`;
      
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
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {!uploadedFile ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 lg:mb-6">
                AI Book Reader
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Tải lên file PDF và khám phá sức mạnh của AI trong việc phân tích và hiểu nội dung sách
              </p>
            </div>
            
            <div className="mb-12 lg:mb-16">
              <PDFUpload 
                onFileUpload={handleFileUpload} 
                isLoading={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Tóm tắt thông minh</h3>
                <p className="text-gray-600 text-sm">AI tạo ra bản tóm tắt ngắn gọn và chính xác nhất</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mind Map</h3>
                <p className="text-gray-600 text-sm">Trực quan hóa kiến thức với sơ đồ tư duy</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">FAQ</h3>
                <p className="text-gray-600 text-sm">Câu hỏi thường gặp được tạo tự động</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Timeline</h3>
                <p className="text-gray-600 text-sm">Dòng thời gian các sự kiện quan trọng</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <FeaturePanel 
                extractedText={extractedText}
                activeFeature={activeFeature}
                onFeatureSelect={handleFeatureSelect}
                fileName={uploadedFile.name}
              />
            </div>
            
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="sticky top-20">
                <ChatInterface extractedText={extractedText} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
