
import React from 'react';

interface LoadingSpinnerProps {
  activeFeature: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ activeFeature }) => {
  return (
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
  );
};
