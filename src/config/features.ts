
import { FileText, Map, HelpCircle, Clock, Network } from 'lucide-react';
import { FeatureItem } from '@/types/feature';

export const FEATURES: FeatureItem[] = [
  {
    id: 'summary',
    title: 'Tóm tắt',
    icon: FileText,
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    icon: Map,
  },
  {
    id: 'knowledge-graph',
    title: 'Knowledge Graph',
    icon: Network,
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircle,
  },
  {
    id: 'timeline',
    title: 'Timeline',
    icon: Clock,
  },
];
