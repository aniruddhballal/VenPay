import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDisappear, setShouldDisappear] = useState(false);
  const [paths, setPaths] = useState({ set1: [], set2: [] });
  const [survivingIndices, setSurvivingIndices] = useState({ set1: 0, set2: 0 });
  const [pathSmoothness, setPathSmoothness] = useState({ set1: [], set2: [] });

  // Generate electric circuit path with multiple sharp turns
  const generateCircuitPath = (isSet1 = true) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 190 } : { x: 320, y: 190 };
    
    const points = [startPoint];
    const totalDistanceX = endPoint.x - startPoint.x;
    const totalDistanceY = endPoint.y - startPoint.y;
    
    // Create multiple sharp turns (8-12 segments for complexity)
    const segments = 8 + Math.floor(Math.random() * 5);
    let currentPoint = { ...startPoint };
    
    for (let i = 0; i < segments; i++) {
      const progress = (i + 1) / segments;
      const isLastSegment = i === segments - 1;
      
      if (isLastSegment) {
        points.push(endPoint);
      } else {
        // Alternate between different movement patterns for sharp turns
        if (i % 4 === 0) {
          // Horizontal step
          const stepX = totalDistanceX * (0.1 + Math.random() * 0.15);
          currentPoint = { x: currentPoint.x + stepX, y: currentPoint.y };
        } else if (i % 4 === 1) {
          // Vertical step with sharp turn
          const stepY = (Math.random() - 0.5) * 100;
          currentPoint = { x: currentPoint.x, y: currentPoint.y + stepY };
        } else if (i % 4 === 2) {
          // Diagonal step
          const stepX = totalDistanceX * (0.05 + Math.random() * 0.1);
          const stepY = totalDistanceY * (0.1 + Math.random() * 0.2);
          currentPoint = { x: currentPoint.x + stepX, y: currentPoint.y + stepY };
        } else {
          // Sharp turn back towards target
          const remainingX = endPoint.x - currentPoint.x;
          const stepX = remainingX * (0.2 + Math.random() * 0.3);
          const stepY = (Math.random() - 0.5) * 60;
          currentPoint = { x: currentPoint.x + stepX, y: currentPoint.y + stepY };
        }
        
        points.push({ ...currentPoint });
      }
    }
    
    // Create path with straight lines only
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return path;
  };

  // Generate messy paths that stay close to the circuit path
  const generateMessyPath = (isSet1 = true, circuitPath) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 189 } : { x: 320, y: 189 };
    
    // Extract some points from circuit path to stay close to it
    const pathLength = circuitPath.length;
    const samplePoints = [];
    
    // Sample points along the circuit path direction
    const numSamples = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i <= numSamples; i++) {
      const progress = i / numSamples;
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Stay close to the main path with small deviations
      const deviation = 30 + Math.random() * 40; // Much smaller deviation
      const deviationX = (Math.random() - 0.5) * deviation;
      const deviationY = (Math.random() - 0.5) * deviation;
      
      samplePoints.push({
        x: baseX + deviationX,
        y: baseY + deviationY
      });
    }
    
    // Create curved path
    let path = `M ${startPoint.x} ${startPoint.y}`;
    
    for (let i = 1; i < samplePoints.length; i++) {
      if (i === samplePoints.length - 1) {
        path += ` L ${endPoint.x} ${endPoint.y}`;
      } else {
        const cp1x = samplePoints[i].x + (Math.random() - 0.5) * 20;
        const cp1y = samplePoints[i].y + (Math.random() - 0.5) * 20;
        path += ` Q ${cp1x} ${cp1y} ${samplePoints[i].x} ${samplePoints[i].y}`;
      }
    }
    
    return path;
  };

  useEffect(() => {
    // Generate one circuit path per set
    const circuitPath1 = generateCircuitPath(true);
    const circuitPath2 = generateCircuitPath(false);
    
    // Generate messy paths that follow near the circuit paths
    const messyPaths1 = Array.from({ length: 5 }, () => generateMessyPath(true, circuitPath1));
    const messyPaths2 = Array.from({ length: 5 }, () => generateMessyPath(false, circuitPath2));
    
    // Combine paths (circuit first, then messy)
    const allPaths1 = [circuitPath1, ...messyPaths1];
    const allPaths2 = [circuitPath2, ...messyPaths2];
    
    const pathTypes1 = ['circuit', 'messy', 'messy', 'messy', 'messy', 'messy'];
    const pathTypes2 = ['circuit', 'messy', 'messy', 'messy', 'messy', 'messy'];
    
    setPaths({ set1: allPaths1, set2: allPaths2 });
    setPathSmoothness({ set1: pathTypes1, set2: pathTypes2 });
    
    // Circuit path is always at index 0
    setSurvivingIndices({ set1: 0, set2: 0 });

    // Initial animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Circuit path completes after 2.5 seconds, then messy lines disappear
    const disappearTimer = setTimeout(() => {
      setShouldDisappear(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(disappearTimer);
    };
  }, []);

  const renderPathSet = (pathArray, gradientId, baseDelay = 0, setName) => {
    const survivingIndex = survivingIndices[setName];
    const pathTypesArray = pathSmoothness[setName];
    
    return pathArray.map((path, index) => {
      const isSurviving = index === survivingIndex;
      const pathType = pathTypesArray[index];
      const isCircuit = pathType === 'circuit';
      const shouldPathDisappear = shouldDisappear && !isSurviving;
      
      // Circuit path styling
      let strokeWidth = isCircuit ? "3" : "0.8"; // Very thin messy lines
      let opacity = isCircuit ? 1 : 0.6;
      let filter = isCircuit ? 
        'drop-shadow(0 3px 10px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(34,197,94,0.6))' :
        'drop-shadow(0 1px 3px rgba(0,0,0,0.2))';
      
      if (isSurviving && shouldDisappear) {
        opacity = 1;
        strokeWidth = "3";
        filter = 'drop-shadow(0 4px 15px rgba(0,0,0,0.5)) drop-shadow(0 0 30px rgba(34,197,94,0.8))';
      }
      
      return (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={isCircuit ? `url(#circuitGradient)` : `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap={isCircuit ? 'square' : 'round'}
          className="transition-all ease-in-out"
          style={{
            strokeDasharray: isCircuit ? '6,3' : 'none',
            strokeDashoffset: isLoaded ? 0 : (isCircuit ? 3000 : 2000),
            opacity: isLoaded ? (shouldPathDisappear ? (isSurviving ? 1 : 0) : opacity) : 0,
            filter: filter,
            transitionDuration: isCircuit ? '2.5s' : '1.5s',
            transitionDelay: isCircuit ? '0s' : `${0.2 + index * 0.1}s`
          }}
        />
      );
    });
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 1200"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Set 1 - Upper flowing lines */}
        {renderPathSet(paths.set1, 'gradient1', 0, 'set1')}
        
        {/* Set 2 - Lower flowing lines */}
        {renderPathSet(paths.set2, 'gradient2', 0.1, 'set2')}

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.7}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.5}} />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.7}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.5}} />
          </linearGradient>

          {/* Circuit-specific gradient */}
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20">
        <div className="text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              !isLoaded ? 'bg-red-400' : 
              !shouldDisappear ? 'bg-yellow-400' : 
              'bg-green-400'
            }`} />
            <span>
              {!isLoaded ? 'Initializing...' : 
               !shouldDisappear ? 'Circuit Forming...' : 
               'Circuit Complete'}
            </span>
          </div>
          <div className="text-xs text-white/70 mt-1">
            Electric paths: {survivingIndices.set1 + 1} & {survivingIndices.set2 + 1}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default CurvedConnectingLines;
