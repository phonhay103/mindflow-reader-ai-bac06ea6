
import React from 'react';
import { KnowledgeGraphData } from '@/types/feature';

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Không có dữ liệu để hiển thị sơ đồ</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 border rounded-lg bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-4">
        <div className="grid grid-cols-3 gap-4 h-full">
          {data.nodes.slice(0, 9).map((node, index) => (
            <div
              key={node.id}
              className={`
                flex items-center justify-center p-4 rounded-lg text-center text-sm font-medium
                ${index === 0 ? 'bg-blue-100 text-blue-800 col-span-3' : 
                  index < 4 ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}
              `}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {data.edges.slice(0, 5).map((edge, index) => (
          <line
            key={index}
            x1="50%"
            y1="20%"
            x2={`${30 + (index * 40)}%`}
            y2="80%"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        ))}
      </svg>
    </div>
  );
};
