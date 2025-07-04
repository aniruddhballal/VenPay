import { useEffect, useState } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

interface ConnectionPoint {
  x: number;
  y: number;
  label: string;
  type: 'start' | 'end' | 'intermediate';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [connectionPath, setConnectionPath] = useState<string>('');
  const [connectionPoints, setConnectionPoints] = useState<ConnectionPoint[]>([]);

  // Define connection points based on active set
  const getConnectionPoints = (isSet1: boolean): ConnectionPoint[] => {
    if (isSet1) {
      return [
        { x: 742, y: 120, label: 'Source', type: 'start' },
        { x: 820, y: 140, label: 'Process', type: 'intermediate' },
        { x: 860, y: 165, label: 'Validate', type: 'intermediate' },
        { x: 900, y: 190, label: 'Destination', type: 'end' }
      ];
    } else {
      return [
        { x: 457, y: 120, label: 'Input', type: 'start' },
        { x: 400, y: 140, label: 'Filter', type: 'intermediate' },
        { x: 360, y: 165, label: 'Transform', type: 'intermediate' },
        { x: 320, y: 190, label: 'Output', type: 'end' }
      ];
    }
  };

  // Create smooth bezier path through connection points
  const createConnectionPath = (points: ConnectionPoint[]): string => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        // First curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y + (curr.y - prev.y) * 0.3;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y - (curr.y - prev.y) * 0.3;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Smooth curves for remaining points
        const cp1x = prev.x + (curr.x - prev.x) * 0.6;
        const cp1y = prev.y + (curr.y - prev.y) * 0.4;
        const cp2x = curr.x - (next ? (next.x - curr.x) * 0.4 : 20);
        const cp2y = curr.y - (next ? (next.y - curr.y) * 0.4 : 10);
        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  // Initialize path when activeSet changes
  useEffect(() => {
    const points = getConnectionPoints(activeSet === 'set1');
    const path = createConnectionPath(points);
    
    setConnectionPoints(points);
    setConnectionPath(path);
  }, [activeSet]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient for connection path */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
            <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#06d6a0', stopOpacity: 0.8 }} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated dashed path */}
        {connectionPath && (
          <path
            d={connectionPath}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8,4"
            filter="url(#glow)"
            style={{
              animation: 'dashMove 2s linear infinite'
            }}
          />
        )}
      </svg>
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 24;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLines;