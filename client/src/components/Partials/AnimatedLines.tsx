import { useEffect, useState, useRef } from 'react';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

interface FlowParticle {
  id: string;
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  trail: Array<{x: number, y: number, opacity: number}>;
}

interface ConnectionPoint {
  x: number;
  y: number;
  label: string;
  type: 'start' | 'end' | 'intermediate';
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [connectionPath, setConnectionPath] = useState<string>('');
  const [connectionPoints, setConnectionPoints] = useState<ConnectionPoint[]>([]);
  const [animationPhase, setAnimationPhase] = useState<'initializing' | 'flowing' | 'active'>('initializing');
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

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

  // Calculate point on path at given progress (0-1)
  const getPointOnPath = (progress: number, points: ConnectionPoint[]): {x: number, y: number} => {
    if (points.length < 2) return { x: 0, y: 0 };
    
    const totalSegments = points.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(segmentProgress);
    const localProgress = segmentProgress - segmentIndex;
    
    if (segmentIndex >= totalSegments) {
      return { x: points[points.length - 1].x, y: points[points.length - 1].y };
    }
    
    const start = points[segmentIndex];
    const end = points[segmentIndex + 1];
    
    // Smooth interpolation with easing
    const easedProgress = localProgress < 0.5 
      ? 2 * localProgress * localProgress 
      : 1 - Math.pow(-2 * localProgress + 2, 3) / 2;
    
    return {
      x: start.x + (end.x - start.x) * easedProgress,
      y: start.y + (end.y - start.y) * easedProgress
    };
  };

  // Create a new particle
  const createParticle = (id: string, points: ConnectionPoint[]): FlowParticle => {
    const colors = ['#10b981', '#3b82f6', '#06d6a0', '#8b5cf6', '#f59e0b'];
    return {
      id,
      x: points[0].x,
      y: points[0].y,
      progress: 0,
      speed: 0.3 + Math.random() * 0.4,
      size: 3 + Math.random() * 4,
      opacity: 0.8 + Math.random() * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: []
    };
  };

  // Update particle animation
  const updateParticles = (deltaTime: number, points: ConnectionPoint[]) => {
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        const newProgress = particle.progress + (particle.speed * deltaTime * 0.001);
        const position = getPointOnPath(newProgress, points);
        
        // Update trail
        const newTrail = [...particle.trail, { 
          x: particle.x, 
          y: particle.y, 
          opacity: particle.opacity 
        }].slice(-8);
        
        // Fade trail
        const fadedTrail = newTrail.map((point, index) => ({
          ...point,
          opacity: point.opacity * (index / newTrail.length) * 0.5
        }));
        
        return {
          ...particle,
          x: position.x,
          y: position.y,
          progress: newProgress > 1 ? 0 : newProgress, // Loop back to start
          trail: fadedTrail
        };
      });
    });
  };

  // Animation loop
  const animate = (currentTime: number) => {
    if (animationPhase === 'active') {
      const deltaTime = currentTime - lastUpdateRef.current;
      lastUpdateRef.current = currentTime;
      
      if (deltaTime < 100) { // Avoid large jumps
        updateParticles(deltaTime, connectionPoints);
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Initialize animation when activeSet changes
  useEffect(() => {
    const points = getConnectionPoints(activeSet === 'set1');
    const path = createConnectionPath(points);
    
    setConnectionPoints(points);
    setConnectionPath(path);
    setAnimationPhase('initializing');
    
    // Clear existing particles
    setParticles([]);
    
    // Start animation sequence
    const timeouts = [
      setTimeout(() => setAnimationPhase('flowing'), 500),
      setTimeout(() => {
        // Create initial particles
        const initialParticles = Array.from({ length: 6 }, (_, i) => 
          createParticle(`particle-${i}`, points)
        );
        setParticles(initialParticles);
      }, 800),
      setTimeout(() => setAnimationPhase('active'), 1200),
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeSet]);

  // Start animation loop
  useEffect(() => {
    if (animationPhase === 'active') {
      lastUpdateRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationPhase, connectionPoints]);

  // Add new particles periodically
  useEffect(() => {
    if (animationPhase === 'active') {
      const interval = setInterval(() => {
        setParticles(prev => {
          if (prev.length < 12) {
            const newParticle = createParticle(`particle-${Date.now()}`, connectionPoints);
            return [...prev, newParticle];
          }
          return prev;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [animationPhase, connectionPoints]);

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
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#06d6a0', stopOpacity: 0.3 }} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Particle glow */}
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Radial gradient for particles */}
          <radialGradient id="particleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
          </radialGradient>
        </defs>
        
        {/* Connection path */}
        {connectionPath && (
          <path
            d={connectionPath}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5,5"
            filter="url(#glow)"
            style={{
              opacity: animationPhase === 'initializing' ? 0 : 1,
              transition: 'opacity 0.8s ease-in-out',
              animation: animationPhase === 'active' ? 'dashMove 2s linear infinite' : 'none'
            }}
          />
        )}
        
        {/* Connection points */}
        {connectionPoints.map((point, index) => (
          <g key={`point-${index}`}>
            {/* Point glow */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="rgba(16, 185, 129, 0.2)"
              style={{
                opacity: animationPhase === 'initializing' ? 0 : 1,
                transition: `opacity 0.6s ease-in-out ${index * 0.1}s`
              }}
            />
            
            {/* Main point */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={point.type === 'start' ? '#10b981' : point.type === 'end' ? '#3b82f6' : '#06d6a0'}
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1"
              filter="url(#glow)"
              style={{
                opacity: animationPhase === 'initializing' ? 0 : 1,
                transition: `opacity 0.4s ease-in-out ${index * 0.1 + 0.2}s`
              }}
            />
            
            {/* Inner core */}
            <circle
              cx={point.x}
              cy={point.y}
              r="2"
              fill="rgba(255, 255, 255, 0.9)"
              style={{
                opacity: animationPhase === 'initializing' ? 0 : 1,
                transition: `opacity 0.4s ease-in-out ${index * 0.1 + 0.4}s`
              }}
            />
          </g>
        ))}
        
        {/* Flowing particles */}
        {particles.map(particle => (
          <g key={particle.id}>
            {/* Particle trail */}
            {particle.trail.map((trailPoint, index) => (
              <circle
                key={`trail-${particle.id}-${index}`}
                cx={trailPoint.x}
                cy={trailPoint.y}
                r={particle.size * 0.3}
                fill={particle.color}
                opacity={trailPoint.opacity}
                filter="url(#particleGlow)"
              />
            ))}
            
            {/* Main particle */}
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill="url(#particleGradient)"
              opacity={particle.opacity}
              filter="url(#particleGlow)"
              style={{
                animation: 'particlePulse 1s ease-in-out infinite alternate'
              }}
            />
            
            {/* Particle glow */}
            <circle
              cx={particle.x}
              cy={particle.y}
              r={particle.size * 1.5}
              fill={particle.color}
              opacity={particle.opacity * 0.3}
              filter="url(#particleGlow)"
            />
          </g>
        ))}
      </svg>
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 20;
          }
        }
        
        @keyframes particlePulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLines;