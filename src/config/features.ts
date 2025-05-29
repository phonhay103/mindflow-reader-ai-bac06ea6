
import { FileText, Network, HelpCircle, Clock, BarChart } from 'lucide-react';

export const FEATURES = [
  {
    id: 'summary',
    title: 'Tóm tắt',
    icon: FileText,
    description: 'Tạo bản tóm tắt ngắn gọn'
  },
  {
    id: 'knowledge-graph',
    title: 'Mind Map',
    icon: Network,
    description: 'Sơ đồ kiến thức trực quan'
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircle,
    description: 'Câu hỏi thường gặp'
  },
  {
    id: 'timeline',
    title: 'Timeline',
    icon: Clock,
    description: 'Dòng thời gian sự kiện'
  },
  {
    id: 'key-insights',
    title: 'Insight',
    icon: BarChart,
    description: 'Phân tích chuyên sâu'
  }
];
