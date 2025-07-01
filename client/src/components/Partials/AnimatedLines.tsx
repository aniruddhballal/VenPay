import { useEffect, useState } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [phase, setPhase] = useState<'loading' | 'analyzing' | 'connecting' | 'complete'>('loading');
  const [dataNodes, setDataNodes] = useState<Array<{x: number, y: number, id: string, delay: number}>>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [pulseNodes, setPulseNodes] = useState<Set<string>>(new Set());
  const [animationKey, setAnimationKey] = useState(0); // Add key to force re-render

  // Generate data flow nodes along the path
  const generateDataNodes = (isSet1: boolean) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 205 } : { x: 320, y: 205 };
    
    const nodes = [];
    const numNodes = 1 + Math.floor(Math.random() * 4); // 8-12 nodes
    
    for (let i = 0; i < numNodes; i++) {
      const progress = i / (numNodes - 1);
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Add some organic variation to node positions
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
    // Clear any existing timeouts and intervals
    const timeoutIds: NodeJS.Timeout[] = [];
    const intervalIds: NodeJS.Timeout[] = [];
    
    // Reset all states immediately
    setPhase('loading');
    setPulseNodes(new Set());
    setAnimationKey(prev => prev + 1); // Force re-render with new key
    
    // Generate new data layout
    const isSet1 = activeSet === 'set1';
    const nodes = generateDataNodes(isSet1);
    const paths = generateConnections(nodes);
    
    setDataNodes(nodes);
    setConnections(paths);
    
    // Clear animation sequence with proper delays
    const sequence = [
      { delay: 500, action: () => setPhase('analyzing') }, // Increased initial delay
      { delay: 1500, action: () => setPhase('connecting') }, // Adjusted timing
      { delay: 3000, action: () => setPhase('complete') }, // Adjusted timing
      { 
        delay: 3500, // Increased delay before pulsing starts
        action: () => {
          // Start pulsing random nodes
          const interval = setInterval(() => {
            const randomNodes = nodes
              .sort(() => Math.random() - 0.5)
              .slice(0, 2 + Math.floor(Math.random() * 3))
              .map(n => n.id);
            setPulseNodes(new Set(randomNodes));
          }, 1500);
          
          intervalIds.push(interval);
        }
      }
    ];
    
    sequence.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay);
      timeoutIds.push(timeout);
    });
    
    // Cleanup function
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      intervalIds.forEach(id => clearInterval(id));
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
          {/* Gradients */}
          <linearGradient id={`connectionGradient-${animationKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          </linearGradient>
          
          <radialGradient id={`nodeGradient-${animationKey}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#06d6a0', stopOpacity: 1}} />
            <stop offset="70%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 0.6}} />
          </radialGradient>
          
          <radialGradient id={`pulseGradient-${animationKey}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.7}} />
            <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
          </radialGradient>

          {/* Filters for glow effects */}
          <filter id={`glow-${animationKey}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id={`strongGlow-${animationKey}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
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
              filter={`url(#glow-${animationKey})`}
              style={animationStyle}
            />
          );
        })}

        {/* Data Nodes */}
        {dataNodes.map((node, index) => {
          // Only show nodes during analyzing phase and later, with staggered delays
          const shouldShow = phase === 'analyzing' || phase === 'connecting' || phase === 'complete';
          const isPulsing = pulseNodes.has(node.id);
          const isEndpoint = index === 0 || index === dataNodes.length - 1;
          
          return (
            <g key={`node-group-${animationKey}-${node.id}`}>
              {/* Pulse Ring for active nodes */}
              {isPulsing && shouldShow && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="none"
                  stroke={`url(#pulseGradient-${animationKey})`}
                  strokeWidth="2"
                  opacity="0.7"
                  style={{
                    animation: 'pulse-ring 2s ease-out infinite'
                  }}
                />
              )}
              
              {/* Main Node */}
              <circle
                key={`node-${animationKey}-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={isEndpoint ? "8" : "5"}
                fill={isPulsing ? `url(#pulseGradient-${animationKey})` : `url(#nodeGradient-${animationKey})`}
                filter={isEndpoint ? `url(#strongGlow-${animationKey})` : `url(#glow-${animationKey})`}
                opacity={shouldShow ? 1 : 0}
                style={{
                  transitionDuration: '0.6s',
                  transitionDelay: shouldShow ? `${node.delay}ms` : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionProperty: 'opacity, r',
                  transform: isPulsing ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`
                }}
              />
              
              {/* Data Packet Animation */}

            </g>
          );
        })}

      </svg>

      {/* Status Indicator */}
      <div className="absolute top-8 left-8 text-emerald-400 font-mono text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            phase === 'loading' ? 'bg-yellow-400 animate-pulse' :
            phase === 'analyzing' ? 'bg-blue-400 animate-pulse' :
            phase === 'connecting' ? 'bg-emerald-400 animate-pulse' :
            'bg-emerald-400'
          }`} />
          <span>
            {phase === 'loading' && 'Initializing...'}
            {phase === 'analyzing' && 'Analyzing Data Points'}
            {phase === 'connecting' && 'Establishing Connections'}
            {phase === 'complete' && 'Live Data Stream'}
          </span>
        </div>
      </div>

      {/* Metrics Display */}
      {phase === 'complete' && (
        <div className="absolute top-8 right-8 text-emerald-400 font-mono text-xs space-y-1">
          <div>Throughput: 2.4k TPS</div>
          <div>Latency: 12ms</div>
          <div>Nodes: {dataNodes.length}</div>
        </div>
      )}

      {/* Test buttons for demonstration */}
      <div className="absolute bottom-8 left-8 space-x-4">
        <button 
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => {/* This would be handled by parent component */}}
        >
          Set 1 (742,120 → 900,205)
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {/* This would be handled by parent component */}}
        >
          Set 2 (457,120 → 320,205)
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            r: 5;
            opacity: 0.8;
          }
          50% {
            r: 15;
            opacity: 0.4;
          }
          100% {
            r: 25;
            opacity: 0;
          }
        }
        
        @keyframes float-data {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLines;