
import React from 'react';
import { Button } from '@/components/ui/button';
import { FEATURES } from '@/config/features';

interface FeatureButtonsProps {
  activeFeature: string;
  onAnalyzeContent: (feature: string) => void;
}

export const FeatureButtons: React.FC<FeatureButtonsProps> = ({
  activeFeature,
  onAnalyzeContent
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {FEATURES.map((feature) => (
        <Button
          key={feature.id}
          variant={activeFeature === feature.id ? 'default' : 'outline'}
          onClick={() => onAnalyzeContent(feature.id)}
          className="flex flex-col items-center space-y-2 h-auto py-4"
        >
          <feature.icon className="w-6 h-6" />
          <span>{feature.title}</span>
        </Button>
      ))}
    </div>
  );
};
