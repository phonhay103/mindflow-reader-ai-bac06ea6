
import React from 'react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { FAQItem, TimelineItem } from '@/types/feature';

interface AnalysisContentProps {
  activeFeature: string;
  content: any;
  title: string;
}

export const AnalysisContent: React.FC<AnalysisContentProps> = ({
  activeFeature,
  content,
  title
}) => {
  if (activeFeature === 'knowledge-graph') {
    return <KnowledgeGraph data={content} />;
  }

  if (activeFeature === 'faq') {
    return (
      <div className="space-y-4">
        {content.map((item: FAQItem, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">
              {item.question}
            </h4>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  if (activeFeature === 'timeline') {
    return (
      <div className="space-y-4">
        {content.map((item: TimelineItem, index: number) => (
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
    );
  }

  return (
    <div className="prose max-w-none">
      <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {content}
      </pre>
    </div>
  );
};
