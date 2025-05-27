
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          ) : (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {isDragActive ? (
                <FileText className="w-8 h-8 text-blue-600" />
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isLoading 
                ? 'Đang xử lý file PDF...' 
                : isDragActive 
                  ? 'Thả file PDF vào đây' 
                  : 'Tải lên file PDF của bạn'
              }
            </h3>
            <p className="text-gray-600">
              {isLoading 
                ? 'Vui lòng đợi trong giây lát' 
                : 'Kéo thả file PDF hoặc click để chọn file'
              }
            </p>
          </div>
          
          {!isLoading && (
            <Button 
              variant="outline" 
              className="mt-4"
              disabled={isLoading}
            >
              Chọn file PDF
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Hỗ trợ file PDF có kích thước tối đa 10MB</p>
      </div>
    </div>
  );
};
