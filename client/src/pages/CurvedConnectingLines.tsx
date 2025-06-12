import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDisappear, setShouldDisappear] = useState(false);
  const [paths, setPaths] = useState({ set1: [], set2: [] });
  const [survivingIndices, setSurvivingIndices] = useState({ set1: 0, set2: 0 });
  const [pathSmoothness, setPathSmoothness] = useState({ set1: [], set2: [] });

  // Generate random curved paths with fixed start and end points
  const generateRandomPath = (isSet1 = true, smoothnessLevel = 'rough') => {
    // Fixed start and end points for all lines
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 189 } : { x: 320, y: 189 };
    
    // Adjust control points and deviation based on smoothness
    let numControlPoints, maxDeviationX, maxDeviationY;
    
    if (smoothnessLevel === 'smooth') {
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
        const controlPointDeviation = smoothnessLevel === 'smooth' ? 40 : 100;
        const cp1x = points[i].x + (Math.random() - 0.5) * controlPointDeviation;
        const cp1y = points[i].y + (Math.random() - 0.5) * (controlPointDeviation * 0.8);
        path += ` Q ${cp1x} ${cp1y} ${points[i].x} ${points[i].y}`;
      }
    }
    
    return path;
  };

  useEffect(() => {
    // Define smoothness levels for each set
    const smoothnessLevels1 = ['smooth', 'smooth', 'rough', 'rough', 'rough', 'rough'];
    const smoothnessLevels2 = ['smooth', 'smooth', 'rough', 'rough', 'rough', 'rough'];
    
    // Shuffle to randomize which paths are smooth
    const shuffledLevels1 = [...smoothnessLevels1].sort(() => Math.random() - 0.5);
    const shuffledLevels2 = [...smoothnessLevels2].sort(() => Math.random() - 0.5);
    
    // Generate paths with assigned smoothness levels
    const newSet1 = shuffledLevels1.map(level => generateRandomPath(true, level));
    const newSet2 = shuffledLevels2.map(level => generateRandomPath(false, level));
    
    setPaths({ set1: newSet1, set2: newSet2 });
    setPathSmoothness({ set1: shuffledLevels1, set2: shuffledLevels2 });
    
    // Choose surviving paths from smooth ones only
    const smoothIndices1 = shuffledLevels1.map((level, index) => level === 'smooth' ? index : -1).filter(i => i !== -1);
    const smoothIndices2 = shuffledLevels2.map((level, index) => level === 'smooth' ? index : -1).filter(i => i !== -1);
    
    setSurvivingIndices({
      set1: smoothIndices1[Math.floor(Math.random() * smoothIndices1.length)],
      set2: smoothIndices2[Math.floor(Math.random() * smoothIndices2.length)]
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
      const newShuffledLevels1 = [...smoothnessLevels1].sort(() => Math.random() - 0.5);
      const newShuffledLevels2 = [...smoothnessLevels2].sort(() => Math.random() - 0.5);
      
      const nextSet1 = newShuffledLevels1.map(level => generateRandomPath(true, level));
      const nextSet2 = newShuffledLevels2.map(level => generateRandomPath(false, level));
      
      setPaths({ set1: nextSet1, set2: nextSet2 });
      setPathSmoothness({ set1: newShuffledLevels1, set2: newShuffledLevels2 });
      
      const newSmoothIndices1 = newShuffledLevels1.map((level, index) => level === 'smooth' ? index : -1).filter(i => i !== -1);
      const newSmoothIndices2 = newShuffledLevels2.map((level, index) => level === 'smooth' ? index : -1).filter(i => i !== -1);
      
      setSurvivingIndices({
        set1: newSmoothIndices1[Math.floor(Math.random() * newSmoothIndices1.length)],
        set2: newSmoothIndices2[Math.floor(Math.random() * newSmoothIndices2.length)]
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
    const smoothnessArray = pathSmoothness[setName];
    
    return pathArray.map((path, index) => {
      const isSurviving = index === survivingIndex;
      const isSmooth = smoothnessArray[index] === 'smooth';
      const shouldPathDisappear = shouldDisappear && !isSurviving;
      
      return (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={isSurviving ? "5" : isSmooth ? "3" : "2"}
          strokeLinecap="round"
          className="transition-all ease-in-out"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: isLoaded ? (shouldPathDisappear ? -2000 : 0) : 2000,
            opacity: isLoaded ? 
              (shouldPathDisappear ? 0 : 
                isSurviving ? 1 : 
                isSmooth ? 0.7 : 0.4 - index * 0.05) : 0,
            filter: isSurviving ? 
              'drop-shadow(0 4px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 20px rgba(59,130,246,0.6))' : 
              isSmooth ?
              'drop-shadow(0 3px 8px rgba(0,0,0,0.25)) drop-shadow(0 0 12px rgba(59,130,246,0.3))' :
              'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
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
            Smooth paths prioritized for survival
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
