import { useEffect, useState } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [phase, setPhase] = useState<'loading' | 'analyzing' | 'connecting' | 'complete'>('loading');
  const [dataNodes, setDataNodes] = useState<Array<{x: number, y: number, id: string, delay: number}>>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Generate data flow nodes along the path
  const generateDataNodes = (isSet1: boolean) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 190 } : { x: 320, y: 190 };
    
    const nodes = [];
    const numNodes = 3;
    
    for (let i = 0; i < numNodes; i++) {
      const progress = i / (numNodes - 1);
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // For first and last nodes, use exact coordinates without variation
      if (i === 0) {
        nodes.push({
          x: startPoint.x,
          y: startPoint.y,
          id: `node-${i}`,
          delay: i * 200 + Math.random() * 100
        });
      } else if (i === numNodes - 1) {
        nodes.push({
          x: endPoint.x,
          y: endPoint.y,
          id: `node-${i}`,
          delay: i * 200 + Math.random() * 100
        });
      } else {
        // Add organic variation only to intermediate nodes
        const variation = 30 + Math.random() * 40;
        const offsetX = (Math.random() - 0.5) * variation;
        const offsetY = (Math.random() - 0.5) * variation * 0.6; // Less vertical variation
        
        nodes.push({
          x: baseX + offsetX,
          y: Math.max(100, Math.min(baseY + offsetY, endPoint.y - 20)),
          id: `node-${i}`,
          delay: i * 200 + Math.random() * 100 // Staggered animation
        });
      }
    }
    
    return nodes;
  };

  // Generate connection paths between nodes
  const generateConnections = (nodes: Array<{x: number, y: number, id: string}>) => {
    const paths = [];
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i];
      const next = nodes[i + 1];
      
      // Create smooth bezier curves between nodes
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      const cp1x = current.x + (midX - current.x) * 0.5 + (Math.random() - 0.5) * 20;
      const cp1y = current.y + (midY - current.y) * 0.5 + (Math.random() - 0.5) * 15;
      const cp2x = next.x + (midX - next.x) * 0.5 + (Math.random() - 0.5) * 20;
      const cp2y = next.y + (midY - next.y) * 0.5 + (Math.random() - 0.5) * 15;
      
      paths.push(`M ${current.x} ${current.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`);
    }
    
    return paths;
  };

  useEffect(() => {
    // Clear any existing timeouts
    const timeoutIds: NodeJS.Timeout[] = [];
    
    // Reset all states immediately
    setPhase('loading');
    setAnimationKey(prev => prev + 1);
    
    // Generate new data layout
    const isSet1 = activeSet === 'set1';
    const nodes = generateDataNodes(isSet1);
    const paths = generateConnections(nodes);
    
    setDataNodes(nodes);
    setConnections(paths);
    
    // Clear animation sequence with proper delays
    const sequence = [
      { delay: 500, action: () => setPhase('analyzing') },
      { delay: 1500, action: () => setPhase('connecting') },
      { delay: 3000, action: () => setPhase('complete') }
    ];
    
    sequence.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay);
      timeoutIds.push(timeout);
    });
    
    // Cleanup function
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [activeSet]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Main Animation SVG */}
      <svg 
        key={animationKey} // Force re-render when key changes
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for connections only */}
          <linearGradient id={`connectionGradient-${animationKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          </linearGradient>
        </defs>

        {/* Connection Lines */}
        {connections.map((path, index) => {
          const pathLength = 400; // Approximate path length
          let animationStyle = {};
          
          if (phase === 'connecting' || phase === 'complete') {
            animationStyle = {
              strokeDasharray: pathLength,
              strokeDashoffset: 0,
              opacity: phase === 'complete' ? 0.8 : 0.6,
              transitionDuration: '1.2s',
              transitionDelay: `${index * 150}ms`,
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionProperty: 'stroke-dashoffset, opacity'
            };
          } else {
            animationStyle = {
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
              opacity: 0
            };
          }
          
          return (
            <path
              key={`connection-${animationKey}-${index}`}
              d={path}
              fill="none"
              stroke={`url(#connectionGradient-${animationKey})`}
              strokeWidth={phase === 'complete' ? "2.5" : "1.8"}
              strokeLinecap="round"
              style={animationStyle}
            />
          );
        })}

        {/* Data Nodes - Simple static circles */}
        {dataNodes.map((node) => {
          const shouldShow = phase === 'analyzing' || phase === 'connecting' || phase === 'complete';
          
          return (
            <circle
              key={`node-${animationKey}-${node.id}`}
              cx={node.x}
              cy={node.y}
              r="5"
              fill="#10b981"
              stroke="none"
              opacity={shouldShow ? 1 : 0}
              style={{
                transitionDuration: '0.6s',
                transitionDelay: shouldShow ? `${node.delay}ms` : '0ms',
                transitionProperty: 'opacity'
              }}
            />
          );
        })}

      </svg>
    </div>
  );
};
export default AnimatedLines;