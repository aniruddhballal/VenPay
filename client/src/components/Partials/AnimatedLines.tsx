import { useEffect, useState, useRef } from 'react';
import './AnimatedLines.css';

interface AnimatedLinesProps {
  activeSet?: 'set1' | 'set2';
}

interface ConnectionPoint {
  x: number;
  y: number;
}

const AnimatedLines = ({ activeSet = 'set1' }: AnimatedLinesProps) => {
  const [connectionPath, setConnectionPath] = useState<string>('');
  const [pathLength, setPathLength] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [previousActiveSet, setPreviousActiveSet] = useState<string>('');
  
  // Use refs to track timeouts and prevent memory leaks
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathLengthTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random offset for path variation
  const getRandomOffset = () => ({
    x: (Math.random() - 0.5) * 60, // Random offset between -30 and 30
    y: (Math.random() - 0.5) * 40  // Random offset between -20 and 20
  });

  // Define connection points based on active set with random variation
  const getConnectionPoints = (isSet1: boolean): ConnectionPoint[] => {
    const startPoint = isSet1 ? { x: 457, y: 120 } : { x: 742, y: 120 };
    const endPoint = isSet1 ? { x: 320, y: 190 } : { x: 900, y: 190 };
    
    if (isSet1) {
      return [
        { x: startPoint.x, y: startPoint.y },
        { x: 400 + getRandomOffset().x, y: 140 + getRandomOffset().y },
        { x: 360 + getRandomOffset().x, y: 165 + getRandomOffset().y },
        { x: endPoint.x, y: endPoint.y }
      ];
    } else {
      return [
        { x: startPoint.x, y: startPoint.y },
        { x: 820 + getRandomOffset().x, y: 140 + getRandomOffset().y },
        { x: 860 + getRandomOffset().x, y: 165 + getRandomOffset().y },
        { x: endPoint.x, y: endPoint.y }
      ];
    }
  };

  // Create smooth bezier path through connection points with random curves
  const createConnectionPath = (points: ConnectionPoint[]): string => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      // Add random variation to control points
      const randomFactor1 = 0.3 + Math.random() * 0.4; // Between 0.3 and 0.7
      const randomFactor2 = 0.3 + Math.random() * 0.4;
      const randomOffset1 = getRandomOffset();
      const randomOffset2 = getRandomOffset();
      
      if (i === 1) {
        // First curve with random variation
        const cp1x = prev.x + (curr.x - prev.x) * randomFactor1 + randomOffset1.x;
        const cp1y = prev.y + (curr.y - prev.y) * randomFactor1 + randomOffset1.y;
        const cp2x = curr.x - (curr.x - prev.x) * randomFactor2 + randomOffset2.x;
        const cp2y = curr.y - (curr.y - prev.y) * randomFactor2 + randomOffset2.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Smooth curves for remaining points with random variation
        const cp2x = curr.x - (next ? (next.x - curr.x) * (0.4 + Math.random() * 0.2) : 20 + Math.random() * 20) + randomOffset2.x;
        const cp2y = curr.y - (next ? (next.y - curr.y) * (0.4 + Math.random() * 0.2) : 10 + Math.random() * 10) + randomOffset2.y;
        path += ` S ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  // Function to draw new path
  const drawNewPath = (setType: 'set1' | 'set2') => {
    const points = getConnectionPoints(setType === 'set1');
    const path = createConnectionPath(points);
    
    setConnectionPath(path);
    setIsExiting(false);
    setIsAnimating(true);
    
    // Calculate path length for new path
    if (pathLengthTimeoutRef.current) {
      clearTimeout(pathLengthTimeoutRef.current);
    }
    
    pathLengthTimeoutRef.current = setTimeout(() => {
      const pathElement = document.querySelector('.animated-path') as SVGPathElement;
      if (pathElement) {
        const length = pathElement.getTotalLength();
        setPathLength(length);
      }
    }, 10);
  };

  // Initialize path when activeSet changes
  useEffect(() => {
    // Clear any existing timeouts
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
    }
    if (pathLengthTimeoutRef.current) {
      clearTimeout(pathLengthTimeoutRef.current);
    }

    // If there's already a line displayed and we're switching sets
    if (previousActiveSet && previousActiveSet !== activeSet && connectionPath) {
      // Start swallow effect immediately
      setIsExiting(true);
      setIsAnimating(false);
      
      // After swallow animation completes, draw new line
      exitTimeoutRef.current = setTimeout(() => {
        drawNewPath(activeSet);
      }, 800); // Wait for swallow animation to complete
    } else {
      // Initial load or first time showing - draw immediately
      drawNewPath(activeSet);
    }
    
    // Always update previous active set
    setPreviousActiveSet(activeSet);
  }, [activeSet]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      if (pathLengthTimeoutRef.current) {
        clearTimeout(pathLengthTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        '--path-length-negative': `-${pathLength}px`,
        '--swallow-70': `-${pathLength * 0.7}px`,
        '--swallow-120': `-${pathLength * 1.2}px`,
        '--swallow-dash-30': `${pathLength * 0.3}px`,
        '--swallow-dash-10': `${pathLength * 0.1}px`,
        '--swallow-dash-90': `${pathLength * 0.9}px`
      } as React.CSSProperties}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient for connection path */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ 
              stopColor: activeSet === 'set1' ? '#3b82f6' : '#10b981', 
              stopOpacity: 0.8 
            }} />
            <stop offset="100%" style={{ 
              stopColor: activeSet === 'set1' ? '#10b981' : '#3b82f6', 
              stopOpacity: 0.8 
            }} />
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
            className={`animated-path ${isExiting ? 'exiting' : ''} ${isAnimating ? 'animating' : ''}`}
            style={{
              strokeDasharray: isExiting ? 
                `${pathLength * 0.8} ${pathLength * 0.2}` : 
                `${pathLength} ${pathLength}`,
              strokeDashoffset: isExiting ? 
                -pathLength * 1.2 : 
                (isAnimating ? 0 : -pathLength),
              animation: isExiting ? 
                `swallowEffect 1.2s ease-in-out forwards` :
                (isAnimating ? 
                  `drawPath 1.5s ease-in-out forwards, dashMove 2s linear infinite 1.5s` : 
                  'none')
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default AnimatedLines;