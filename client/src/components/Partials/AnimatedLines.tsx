import { useEffect, useState } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [phase, setPhase] = useState<'loading' | 'analyzing' | 'connecting' | 'complete'>('loading');
  const [dataNodes, setDataNodes] = useState<Array<{x: number, y: number, id: string, delay: number}>>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  // Grid configuration
  const GRID_SIZE = 30;
  const GRID_COLS = Math.floor(1200 / GRID_SIZE);
  const GRID_ROWS = Math.floor(190 / GRID_SIZE);

  // Generate random grid intersection points as intermediate nodes
  const generateGridNodes = (isSet1: boolean) => {
    // Define fixed start and end points
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 190 } : { x: 320, y: 190 };
    
    const allNodes = [];
    const numIntermediateNodes = 4 + Math.floor(Math.random() * 2); // 4-5 intermediate nodes
    const usedPositions = new Set<string>();
    
    // Generate intermediate nodes on grid intersections first
    const intermediateNodes = [];
    for (let i = 0; i < numIntermediateNodes; i++) {
      let gridX, gridY, x, y;
      let attempts = 0;
      
      // Find unused grid intersection
      do {
        gridX = Math.floor(Math.random() * GRID_COLS);
        gridY = Math.floor(Math.random() * GRID_ROWS);
        x = gridX * GRID_SIZE;
        y = gridY * GRID_SIZE;
        attempts++;
      } while (usedPositions.has(`${gridX}-${gridY}`) && attempts < 50);
      
      if (attempts < 50) {
        usedPositions.add(`${gridX}-${gridY}`);
        intermediateNodes.push({ x, y, id: `intermediate-node-${i}` });
      }
    }
    
    // Create a path that connects all nodes logically
    const pathNodes = [startPoint, ...intermediateNodes, endPoint];
    
    // Sort intermediate nodes to create a more natural path from start to end
    // We'll sort by proximity to create a flowing path
    const sortedPath = [pathNodes[0]]; // Start with the start point
    const remainingNodes = [...pathNodes.slice(1, -1)]; // Intermediate nodes
    let currentNode = pathNodes[0];
    
    // Build path by always choosing the closest remaining node
    while (remainingNodes.length > 0) {
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      remainingNodes.forEach((node, index) => {
        const distance = Math.sqrt(
          Math.pow(node.x - currentNode.x, 2) + Math.pow(node.y - currentNode.y, 2)
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      const nextNode = remainingNodes.splice(closestIndex, 1)[0];
      sortedPath.push(nextNode);
      currentNode = nextNode;
    }
    
    // Add end point
    sortedPath.push(pathNodes[pathNodes.length - 1]);
    
    // Add delays and IDs for animation
    return sortedPath.map((node, index) => ({
      ...node,
      id: index === 0 ? 'start-node' : 
          index === sortedPath.length - 1 ? 'end-node' : 
          `intermediate-node-${index}`,
      delay: index * 400 + Math.random() * 200
    }));
  };

  // Generate connection paths between nodes in sequence
  const generateConnections = (nodes: Array<{x: number, y: number, id: string}>) => {
    const paths = [];
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i];
      const next = nodes[i + 1];
      
      // Create smooth bezier curves between nodes
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      
      // Control points for smooth curves
      const cp1x = current.x + (midX - current.x) * 0.6;
      const cp1y = current.y + (midY - current.y) * 0.6;
      const cp2x = next.x + (midX - next.x) * 0.6;
      const cp2y = next.y + (midY - next.y) * 0.6;
      
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
    
    // Generate new grid-based data layout
    const nodes = generateGridNodes(activeSet === 'set1');
    const paths = generateConnections(nodes);
    
    setDataNodes(nodes);
    setConnections(paths);
    
    // Animation sequence with proper delays
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

          {/* Special gradient for start/end nodes */}
          <radialGradient id={`endpointGradient-${animationKey}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 0.95}} />
            <stop offset="60%" style={{stopColor: '#0891b2', stopOpacity: 0.85}} />
            <stop offset="100%" style={{stopColor: '#0e7490', stopOpacity: 0.7}} />
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

          {/* Grid pattern definition */}
          <pattern id={`grid-${animationKey}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6"/>
            <path d="M 15 0 L 15 30 M 0 15 L 30 15" fill="none" stroke="#3b82f6" strokeWidth="0.3" opacity="0.4"/>
          </pattern>
        </defs>

        {/* Background Grid */}
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
              transitionDelay: `${index * 300}ms`,
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
              strokeWidth={phase === 'complete' ? "2.5" : "2"}
              strokeLinecap="round"
              style={animationStyle}
            />
          );
        })}

        {/* Blockchain Nodes */}
        {dataNodes.map((node, nodeIndex) => {
          const shouldShow = phase === 'analyzing' || phase === 'connecting' || phase === 'complete';
          const isEndpoint = node.id === 'start-node' || node.id === 'end-node';
          
          return (
            <g key={`node-group-${animationKey}-${node.id}`}>
              {/* Grid intersection highlight - only for intermediate nodes */}
              {!isEndpoint && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="15"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1"
                  opacity={shouldShow ? 0.4 : 0}
                  style={{
                    transitionDuration: '0.6s',
                    transitionDelay: shouldShow ? `${node.delay - 200}ms` : '0ms',
                    transitionProperty: 'opacity'
                  }}
                />
              )}

              {/* Subtle outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isEndpoint ? "15" : "12"}
                fill={`url(#nodeGlow-${animationKey})`}
                opacity={shouldShow ? 0.6 : 0}
                filter={`url(#glow-${animationKey})`}
                style={{
                  transitionDuration: '1s',
                  transitionDelay: shouldShow ? `${node.delay}ms` : '0ms',
                  transitionProperty: 'opacity'
                }}
              />
              
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isEndpoint ? "9" : "7"}
                fill={isEndpoint ? `url(#endpointGradient-${animationKey})` : `url(#nodeGradient-${animationKey})`}
                stroke={isEndpoint ? "#06b6d4" : "#60a5fa"}
                strokeWidth={isEndpoint ? "2" : "1.5"}
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
                r={isEndpoint ? "4" : "3"}
                fill="#ffffff"
                opacity={shouldShow ? 0.9 : 0}
                style={{
                  transitionDuration: '0.6s',
                  transitionDelay: shouldShow ? `${node.delay + 500}ms` : '0ms',
                  transitionProperty: 'opacity'
                }}
              >
                {/* Very subtle pulse - only opacity changes */}
                <animate 
                  attributeName="opacity" 
                  values="0.9;0.5;0.9" 
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
                  r="1.5"
                  fill={`url(#dataPacket-${animationKey})`}
                  opacity="0.8"
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
                    values="0,0;12,0;0,0;-12,0;0,0"
                    dur="8s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </circle>
              )}

              {/* Node labels for start/end points */}
              {shouldShow && isEndpoint && (
                <text
                  x={node.x}
                  y={node.y - 25}
                  textAnchor="middle"
                  fill="#06b6d4"
                  fontSize="11"
                  opacity={0.8}
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    transitionDuration: '0.5s',
                    transitionDelay: `${node.delay + 700}ms`,
                    transitionProperty: 'opacity'
                  }}
                >
                  {node.id === 'start-node' ? 'START' : 'END'}
                </text>
              )}

              {/* Node sequence indicator for intermediate nodes */}
              {shouldShow && !isEndpoint && (
                <text
                  x={node.x}
                  y={node.y - 20}
                  textAnchor="middle"
                  fill="#60a5fa"
                  fontSize="10"
                  opacity={0.6}
                  style={{
                    fontFamily: 'monospace',
                    transitionDuration: '0.5s',
                    transitionDelay: `${node.delay + 700}ms`,
                    transitionProperty: 'opacity'
                  }}
                >
                  {nodeIndex}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Debug info */}
      <div className="absolute bottom-4 left-4 text-cyan-400 text-sm font-mono opacity-60">
        Active Set: {activeSet} | Phase: {phase} | Nodes: {dataNodes.length}
      </div>
    </div>
  );
};

export default AnimatedLines;