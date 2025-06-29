import { useEffect, useState } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [phase, setPhase] = useState<'loading' | 'analyzing' | 'connecting' | 'complete'>('loading');
  const [dataNodes, setDataNodes] = useState<Array<{x: number, y: number, id: string, delay: number}>>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [pulseNodes, setPulseNodes] = useState<Set<string>>(new Set());

  // Generate data flow nodes along the path
  const generateDataNodes = (isSet1: boolean) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 205 } : { x: 320, y: 205 };
    
    const nodes = [];
    const numNodes = 8 + Math.floor(Math.random() * 4); // 8-12 nodes
    
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
    // Reset animation when activeSet changes
    setPhase('loading');
    setPulseNodes(new Set());
    
    // Generate new data layout
    const isSet1 = activeSet === 'set1';
    const nodes = generateDataNodes(isSet1);
    const paths = generateConnections(nodes);
    
    setDataNodes(nodes);
    setConnections(paths);
    
    // Animation sequence
    const sequence = [
      { delay: 300, action: () => setPhase('analyzing') },
      { delay: 1200, action: () => setPhase('connecting') },
      { delay: 2800, action: () => setPhase('complete') },
      { 
        delay: 3200, 
        action: () => {
          // Start pulsing random nodes
          const interval = setInterval(() => {
            const randomNodes = nodes
              .sort(() => Math.random() - 0.5)
              .slice(0, 2 + Math.floor(Math.random() * 3))
              .map(n => n.id);
            setPulseNodes(new Set(randomNodes));
          }, 1500);
          
          return () => clearInterval(interval);
        }
      }
    ];
    
    const cleanups: (() => void)[] = [];
    
    sequence.forEach(({ delay, action }) => {
      const timeout = setTimeout(() => {
        const cleanup = action();
        if (cleanup) cleanups.push(cleanup);
      }, delay);
      
      cleanups.push(() => clearTimeout(timeout));
    });
    
    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [activeSet]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Grid Pattern Background */}
      {/* <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div> */}

      {/* Main Animation SVG */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          </linearGradient>
          
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#06d6a0', stopOpacity: 1}} />
            <stop offset="70%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#059669', stopOpacity: 0.6}} />
          </radialGradient>
          
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.7}} />
            <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 0.3}} />
          </radialGradient>

          {/* Filters for glow effects */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
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
              key={`connection-${activeSet}-${index}`}
              d={path}
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth={phase === 'complete' ? "2.5" : "1.8"}
              strokeLinecap="round"
              filter="url(#glow)"
              style={animationStyle}
            />
          );
        })}

        {/* Data Nodes */}
        {dataNodes.map((node, index) => {
          const isVisible = phase === 'analyzing' || phase === 'connecting' || phase === 'complete';
          const isPulsing = pulseNodes.has(node.id);
          const isEndpoint = index === 0 || index === dataNodes.length - 1;
          
          return (
            <g key={`node-${activeSet}-${node.id}`}>
              {/* Pulse Ring for active nodes */}
              {isPulsing && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="none"
                  stroke="url(#pulseGradient)"
                  strokeWidth="2"
                  opacity="0.7"
                  style={{
                    animation: 'pulse-ring 2s ease-out infinite'
                  }}
                />
              )}
              
              {/* Main Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isEndpoint ? "8" : "5"}
                fill={isPulsing ? "url(#pulseGradient)" : "url(#nodeGradient)"}
                filter={isEndpoint ? "url(#strongGlow)" : "url(#glow)"}
                opacity={isVisible ? 1 : 0}
                style={{
                  transitionDuration: '0.6s',
                  transitionDelay: `${node.delay}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionProperty: 'opacity, r',
                  transform: isPulsing ? 'scale(1.2)' : 'scale(1)',
                  transformOrigin: `${node.x}px ${node.y}px`
                }}
              />
              
              {/* Data Packet Animation */}
              {phase === 'complete' && index < dataNodes.length - 1 && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="2"
                  fill="#3b82f6"
                  opacity="0.9"
                  filter="url(#glow)"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${index * 0.5}s`}
                  >
                    <mpath href={`#connection-path-${index}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          );
        })}

        {/* Floating Data Indicators */}
        {phase === 'complete' && (
          <>
            {[...Array(6)].map((_, i) => (
              <text
                key={`indicator-${i}`}
                x={400 + Math.random() * 400}
                y={80 + Math.random() * 40}
                fill="#10b981"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.6"
                style={{
                  animation: `float-data ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {['TX', 'USD', 'BTC', 'ETH', 'API', 'SEC'][i]}
              </text>
            ))}
          </>
        )}
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