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
          delay: i * 300 + Math.random() * 100
        });
      } else if (i === numNodes - 1) {
        nodes.push({
          x: endPoint.x,
          y: endPoint.y,
          id: `node-${i}`,
          delay: i * 300 + Math.random() * 100
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
          delay: i * 300 + Math.random() * 100
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
      { delay: 800, action: () => setPhase('analyzing') },
      { delay: 2000, action: () => setPhase('connecting') },
      { delay: 3500, action: () => setPhase('complete') }
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
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Main Animation SVG */}
      <svg 
        key={animationKey}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Professional blockchain gradient for connections */}
          <linearGradient id={`connectionGradient-${animationKey}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#1e40af', stopOpacity: 0.8}} />
            <stop offset="30%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
            <stop offset="70%" style={{stopColor: '#06b6d4', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#0891b2', stopOpacity: 0.8}} />
          </linearGradient>

          {/* Subtle node gradient - more professional */}
          <radialGradient id={`nodeGradient-${animationKey}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.95}} />
            <stop offset="60%" style={{stopColor: '#1e40af', stopOpacity: 0.85}} />
            <stop offset="100%" style={{stopColor: '#1e3a8a', stopOpacity: 0.7}} />
          </radialGradient>

          {/* Very subtle glow for professional look */}
          <radialGradient id={`nodeGlow-${animationKey}`} cx="50%" cy="50%" r="80%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0}} />
          </radialGradient>

          {/* Minimal glow filter */}
          <filter id={`glow-${animationKey}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Data packet gradient */}
          <linearGradient id={`dataPacket-${animationKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#0891b2', stopOpacity: 0.6}} />
          </linearGradient>
        </defs>

        {/* Connection Lines */}
        {connections.map((path, index) => {
          const pathLength = 400;
          let animationStyle = {};
          
          if (phase === 'connecting' || phase === 'complete') {
            animationStyle = {
              strokeDasharray: pathLength,
              strokeDashoffset: 0,
              opacity: phase === 'complete' ? 0.9 : 0.7,
              transitionDuration: '1.5s',
              transitionDelay: `${index * 200}ms`,
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
              strokeWidth={phase === 'complete' ? "2" : "1.5"}
              strokeLinecap="round"
              style={animationStyle}
            />
          );
        })}

        {/* Professional Blockchain Nodes */}
        {dataNodes.map((node) => {
          const shouldShow = phase === 'analyzing' || phase === 'connecting' || phase === 'complete';
          
          return (
            <g key={`node-group-${animationKey}-${node.id}`}>
              {/* Subtle outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r="12"
                fill={`url(#nodeGlow-${animationKey})`}
                opacity={shouldShow ? 0.6 : 0}
                filter={`url(#glow-${animationKey})`}
                style={{
                  transitionDuration: '1s',
                  transitionDelay: shouldShow ? `${node.delay}ms` : '0ms',
                  transitionProperty: 'opacity'
                }}
              />
              
              {/* Main node - hexagonal blockchain style */}
              <circle
                cx={node.x}
                cy={node.y}
                r="6"
                fill={`url(#nodeGradient-${animationKey})`}
                stroke="#60a5fa"
                strokeWidth="1"
                opacity={shouldShow ? 1 : 0}
                style={{
                  transitionDuration: '0.8s',
                  transitionDelay: shouldShow ? `${node.delay + 300}ms` : '0ms',
                  transitionProperty: 'opacity'
                }}
              />
              
              {/* Inner core with minimal pulse */}
              <circle
                cx={node.x}
                cy={node.y}
                r="2.5"
                fill="#ffffff"
                opacity={shouldShow ? 0.8 : 0}
                style={{
                  transitionDuration: '0.6s',
                  transitionDelay: shouldShow ? `${node.delay + 500}ms` : '0ms',
                  transitionProperty: 'opacity'
                }}
              >
                {/* Very subtle pulse - only opacity changes */}
                <animate 
                  attributeName="opacity" 
                  values="0.8;0.4;0.8" 
                  dur="4s" 
                  repeatCount="indefinite"
                  begin={shouldShow ? `${(node.delay + 500) / 1000}s` : 'indefinite'}
                />
              </circle>

              {/* Data packet indicator - small moving dots */}
              {phase === 'complete' && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="1"
                  fill={`url(#dataPacket-${animationKey})`}
                  opacity="0.7"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values={`0 ${node.x} ${node.y};360 ${node.x} ${node.y}`}
                    dur="8s"
                    repeatCount="indefinite"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0;10,0;0,0;-10,0;0,0"
                    dur="8s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Blockchain grid pattern overlay - covering top portion to y=190 */}
        <defs>
          <pattern id={`grid-${animationKey}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6"/>
            <path d="M 15 0 L 15 30 M 0 15 L 30 15" fill="none" stroke="#3b82f6" strokeWidth="0.3" opacity="0.4"/>
          </pattern>
        </defs>
        
        {/* Grid covering from top of screen to y=190 */}
        <rect 
          x="0" 
          y="0" 
          width="1200" 
          height="190" 
          fill={`url(#grid-${animationKey})`} 
          opacity={0.7}
          style={{
            transitionDuration: '2s',
            transitionProperty: 'opacity'
          }} 
        />
      </svg>
    </div>
  );
};

export default AnimatedLines;