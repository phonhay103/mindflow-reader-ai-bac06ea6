
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { FeaturePanelProps } from '@/types/feature';
import { useAnalysis } from '@/hooks/useAnalysis';
import { FeatureButtons } from './FeatureButtons';
import { AnalysisContent } from './AnalysisContent';
import { LoadingSpinner } from './LoadingSpinner';

export const FeaturePanel: React.FC<FeaturePanelProps> = ({
  extractedText,
  activeFeature,
  onFeatureSelect,
  fileName
}) => {
  const { isAnalyzing, analysisResults, analyzeContent } = useAnalysis();

  const handleAnalyzeContent = (feature: string) => {
    analyzeContent(feature, extractedText, fileName, onFeatureSelect);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Phân tích nội dung: {fileName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeatureButtons
            activeFeature={activeFeature}
            onAnalyzeContent={handleAnalyzeContent}
          />
        </CardContent>
      </Card>

      {activeFeature && (
        <Card>
          <CardContent className="pt-6">
            {isAnalyzing ? (
              <LoadingSpinner activeFeature={activeFeature} />
            ) : analysisResults[activeFeature] ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {analysisResults[activeFeature].title}
                </h3>
                <AnalysisContent
                  activeFeature={activeFeature}
                  content={analysisResults[activeFeature].content}
                  title={analysisResults[activeFeature].title}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
