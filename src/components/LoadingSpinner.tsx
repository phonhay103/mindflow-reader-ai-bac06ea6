
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  activeFeature: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ activeFeature }) => {
  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'summary': return 'Đang tóm tắt nội dung...';
      case 'knowledge-graph': return 'Đang tạo sơ đồ tư duy...';
      case 'faq': return 'Đang tạo câu hỏi thường gặp...';
      case 'timeline': return 'Đang tạo dòng thời gian...';
      case 'key-insights': return 'Đang phân tích chuyên sâu...';
      default: return 'Đang xử lý...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-gray-600 text-center">{getFeatureName(activeFeature)}</p>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};
