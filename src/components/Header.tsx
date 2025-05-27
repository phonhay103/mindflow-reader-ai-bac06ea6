
import React from 'react';
import { BookOpen, Upload, MessageCircle } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Book Reader
            </span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Tải lên</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
