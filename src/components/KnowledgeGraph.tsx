
import React, { useEffect, useRef } from 'react';

interface Node {
  id: string;
  label: string;
  type: string;
  description: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
  type: string;
}

interface KnowledgeGraphData {
  nodes: Node[];
  edges: Edge[];
  summary: string;
}

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate node positions in a circular layout
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    const nodePositions: { [key: string]: { x: number; y: number } } = {};
    
    data.nodes.forEach((node, index) => {
      const angle = (index / data.nodes.length) * 2 * Math.PI;
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Draw edges
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    data.edges.forEach((edge) => {
      const fromPos = nodePositions[edge.from];
      const toPos = nodePositions[edge.to];
      
      if (fromPos && toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();

        // Draw edge label
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        ctx.fillStyle = '#475569';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillRect(midX - 30, midY - 8, 60, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(edge.label, midX, midY + 3);
      }
    });

    // Draw nodes
    data.nodes.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      // Node circle
      const nodeRadius = 40;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      
      // Color based on type
      switch (node.type) {
        case 'concept':
          ctx.fillStyle = '#3b82f6';
          break;
        case 'person':
          ctx.fillStyle = '#10b981';
          break;
        case 'place':
          ctx.fillStyle = '#f59e0b';
          break;
        case 'event':
          ctx.fillStyle = '#ef4444';
          break;
        default:
          ctx.fillStyle = '#8b5cf6';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      const words = node.label.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], pos.x, pos.y - 3);
        ctx.fillText(words.slice(1).join(' '), pos.x, pos.y + 12);
      } else {
        ctx.fillText(node.label, pos.x, pos.y + 3);
      }
    });

  }, [data]);

  if (!data) {
    return <div>Không có dữ liệu knowledge graph</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold text-gray-800 mb-2">Tóm tắt Knowledge Graph</h4>
        <p className="text-gray-600 text-sm">{data.summary}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border">
        <canvas
          ref={canvasRef}
          className="w-full border rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">Thực thể ({data.nodes.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.nodes.map((node) => (
              <div key={node.id} className="text-sm">
                <span className="font-medium text-blue-600">{node.label}</span>
                <span className="text-gray-500 ml-2">({node.type})</span>
                {node.description && (
                  <p className="text-gray-600 text-xs mt-1">{node.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">Mối quan hệ ({data.edges.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.edges.map((edge, index) => {
              const fromNode = data.nodes.find(n => n.id === edge.from);
              const toNode = data.nodes.find(n => n.id === edge.to);
              return (
                <div key={index} className="text-sm">
                  <span className="text-blue-600">{fromNode?.label}</span>
                  <span className="text-gray-500 mx-2">{edge.label}</span>
                  <span className="text-green-600">{toNode?.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
