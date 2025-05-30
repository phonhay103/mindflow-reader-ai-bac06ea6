
export interface FAQItem {
  question: string;
  answer: string;
}

export interface TimelineItem {
  year: string;
  event: string;
}

export interface AnalysisResult {
  title: string;
  content: any; // Keep as any to handle different content types (string, objects, arrays)
}

export interface FeaturePanelProps {
  extractedText: string;
  activeFeature: string;
  onFeatureSelect: (feature: string) => void;
  fileName: string;
}

export interface KnowledgeGraphData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    label: string;
  }>;
}
