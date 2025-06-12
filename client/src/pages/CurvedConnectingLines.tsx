import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDisappear, setShouldDisappear] = useState(false);
  const [paths, setPaths] = useState({ set1: [], set2: [] });
  const [survivingIndices, setSurvivingIndices] = useState({ set1: 0, set2: 0 });
  const [pathSmoothness, setPathSmoothness] = useState({ set1: [], set2: [] });

  // Generate random curved paths with fixed start and end points
  const generateRandomPath = (isSet1 = true, pathType = 'rough') => {
    // Fixed start and end points for all lines
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 189 } : { x: 320, y: 189 };
    
    if (pathType === 'circuit') {
      // Electric circuit-like path with right angles and straight segments
      const points = [startPoint];
      
      // Create a path with right-angled segments like electrical circuits
      const totalDistance = Math.abs(endPoint.x - startPoint.x);
      const segments = 3 + Math.floor(Math.random() * 3); // 3-5 segments
      
      let currentPoint = { ...startPoint };
      
      for (let i = 0; i < segments; i++) {
        const isLastSegment = i === segments - 1;
        
        if (isLastSegment) {
          // Final segment goes to end point
          points.push(endPoint);
        } else {
          // Alternate between horizontal and vertical movements
          if (i % 2 === 0) {
            // Horizontal movement
            const progressX = (i + 1) / segments;
            const targetX = startPoint.x + (endPoint.x - startPoint.x) * progressX;
            const jitterY = (Math.random() - 0.5) * 60; // Small vertical jitter
            currentPoint = { x: targetX, y: currentPoint.y + jitterY };
          } else {
            // Vertical movement
            const jitterY = (Math.random() - 0.5) * 80;
            currentPoint = { x: currentPoint.x, y: startPoint.y + (endPoint.y - startPoint.y) * 0.5 + jitterY };
          }
          points.push({ ...currentPoint });
        }
      }
      
      // Create path with straight lines only (no curves for circuit effect)
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
      
      return path;
    }
    
    // Regular curved paths for smooth/rough types
    let numControlPoints, maxDeviationX, maxDeviationY;
    
    if (pathType === 'smooth') {
      numControlPoints = 2 + Math.floor(Math.random() * 2); // 2-3 control points for smoother curves
      maxDeviationX = 80; // Less deviation for smoother paths
      maxDeviationY = 60;
    } else {
      numControlPoints = 4 + Math.floor(Math.random() * 3); // 4-6 control points for rougher curves
      maxDeviationX = 200; // More deviation for rougher paths
      maxDeviationY = 150;
    }
    
    const points = [startPoint];
    
    // Generate random intermediate points
    for (let i = 1; i <= numControlPoints; i++) {
      const progress = i / (numControlPoints + 1);
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Add random deviation from the straight line
      const deviationX = (Math.random() - 0.5) * maxDeviationX;
      const deviationY = (Math.random() - 0.5) * maxDeviationY;
      
      points.push({
        x: baseX + deviationX,
        y: baseY + deviationY
      });
    }
    
    points.push(endPoint);
    
    // Create smooth path using quadratic curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      if (i === points.length - 1) {
        path += ` L ${points[i].x} ${points[i].y}`;
      } else {
        const controlPointDeviation = pathType === 'smooth' ? 40 : 100;
        const cp1x = points[i].x + (Math.random() - 0.5) * controlPointDeviation;
        const cp1y = points[i].y + (Math.random() - 0.5) * (controlPointDeviation * 0.8);
        path += ` Q ${cp1x} ${cp1y} ${points[i].x} ${points[i].y}`;
      }
    }
    
    return path;
  };

  useEffect(() => {
    // Define path types for each set - always include one circuit path
    const pathTypes1 = ['circuit', 'smooth', 'smooth', 'rough', 'rough', 'rough'];
    const pathTypes2 = ['circuit', 'smooth', 'smooth', 'rough', 'rough', 'rough'];
    
    // Shuffle to randomize positions (but keep circuit in the mix)
    const shuffledTypes1 = [...pathTypes1].sort(() => Math.random() - 0.5);
    const shuffledTypes2 = [...pathTypes2].sort(() => Math.random() - 0.5);
    
    // Generate paths with assigned types
    const newSet1 = shuffledTypes1.map(type => generateRandomPath(true, type));
    const newSet2 = shuffledTypes2.map(type => generateRandomPath(false, type));
    
    setPaths({ set1: newSet1, set2: newSet2 });
    setPathSmoothness({ set1: shuffledTypes1, set2: shuffledTypes2 });
    
    // Always choose the circuit path as the surviving one
    const circuitIndex1 = shuffledTypes1.findIndex(type => type === 'circuit');
    const circuitIndex2 = shuffledTypes2.findIndex(type => type === 'circuit');
    
    setSurvivingIndices({
      set1: circuitIndex1,
      set2: circuitIndex2
    });

    // Trigger animation on component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Start disappearing animation after lines complete
    const disappearTimer = setTimeout(() => {
      setShouldDisappear(true);
    }, 4500); // Lines complete around 4s, start disappearing at 4.5s

    // Reset for continuous loop
    const resetTimer = setTimeout(() => {
      setIsLoaded(false);
      setShouldDisappear(false);
      
      // Generate new random paths for next cycle
      const newShuffledTypes1 = [...pathTypes1].sort(() => Math.random() - 0.5);
      const newShuffledTypes2 = [...pathTypes2].sort(() => Math.random() - 0.5);
      
      const nextSet1 = newShuffledTypes1.map(type => generateRandomPath(true, type));
      const nextSet2 = newShuffledTypes2.map(type => generateRandomPath(false, type));
      
      setPaths({ set1: nextSet1, set2: nextSet2 });
      setPathSmoothness({ set1: newShuffledTypes1, set2: newShuffledTypes2 });
      
      const newCircuitIndex1 = newShuffledTypes1.findIndex(type => type === 'circuit');
      const newCircuitIndex2 = newShuffledTypes2.findIndex(type => type === 'circuit');
      
      setSurvivingIndices({
        set1: newCircuitIndex1,
        set2: newCircuitIndex2
      });
      
      // Restart the cycle
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => setShouldDisappear(true), 4000);
      }, 500);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(disappearTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  const renderPathSet = (pathArray, gradientId, baseDelay = 0, setName) => {
    const survivingIndex = survivingIndices[setName];
    const pathTypesArray = pathSmoothness[setName];
    
    return pathArray.map((path, index) => {
      const isSurviving = index === survivingIndex;
      const pathType = pathTypesArray[index];
      const shouldPathDisappear = shouldDisappear && !isSurviving;
      
      // Different styling based on path type
      let strokeWidth, opacity, filter;
      
      if (isSurviving) {
        strokeWidth = "6";
        opacity = 1;
        filter = 'drop-shadow(0 5px 15px rgba(0,0,0,0.5)) drop-shadow(0 0 25px rgba(59,130,246,0.8))';
      } else if (pathType === 'circuit') {
        strokeWidth = "3.5";
        opacity = 0.8;
        filter = 'drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 0 15px rgba(34,197,94,0.4))';
      } else if (pathType === 'smooth') {
        strokeWidth = "2.5";
        opacity = 0.6;
        filter = 'drop-shadow(0 2px 8px rgba(0,0,0,0.25)) drop-shadow(0 0 10px rgba(59,130,246,0.3))';
      } else {
        strokeWidth = "2";
        opacity = 0.4 - index * 0.05;
        filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))';
      }
      
      return (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={pathType === 'circuit' ? `url(#circuitGradient)` : `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap={pathType === 'circuit' ? 'square' : 'round'}
          className="transition-all ease-in-out"
          style={{
            strokeDasharray: pathType === 'circuit' ? '8,4' : 2000,
            strokeDashoffset: isLoaded ? (shouldPathDisappear ? (pathType === 'circuit' ? -2000 : -2000) : 0) : 2000,
            opacity: isLoaded ? (shouldPathDisappear ? 0 : opacity) : 0,
            filter: filter,
            transitionDuration: shouldPathDisappear ? '2s' : '3.5s',
            transitionDelay: `${baseDelay + index * 0.15}s`
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
        {renderPathSet(paths.set2, 'gradient2', 0.3, 'set2')}

        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
          </linearGradient>

          {/* Circuit-specific gradient */}
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#22c55e', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#eab308', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 0.8}} />
          </linearGradient>

          {/* Glowing effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Ambient particles for enhanced visual appeal */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-8 bg-black/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/10">
        <div className="text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoaded && !shouldDisappear ? 'bg-green-400' : shouldDisappear ? 'bg-orange-400' : 'bg-red-400'}`} />
            <span>
              {!isLoaded ? 'Initializing...' : shouldDisappear ? 'Converging...' : 'Flowing...'}
            </span>
          </div>
          <div className="text-xs text-white/60 mt-1">
            Surviving paths: {survivingIndices.set1 + 1} & {survivingIndices.set2 + 1}
          </div>
          <div className="text-xs text-white/50 mt-1">
            Circuit paths prioritized for survival
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default CurvedConnectingLines;
