
export interface FeaturePanelProps {
  extractedText: string;
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
  fileName: string;
}

export interface AnalysisResult {
  title: string;
  content: any;
}

export interface AnalysisResults {
  [key: string]: AnalysisResult;
}

export interface FeatureItem {
  id: string;
  title: string;
  icon: any;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TimelineItem {
  year: string;
  event: string;
}
