import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDisappear, setShouldDisappear] = useState(false);
  const [paths, setPaths] = useState({ set1: [], set2: [] });
  const [survivingIndices, setSurvivingIndices] = useState({ set1: 0, set2: 0 });
  const [pathSmoothness, setPathSmoothness] = useState({ set1: [], set2: [] });

  // CONFIGURATION: Number of messy background lines
  const NUM_MESSY_LINES = 4; // Modify this value to change the number of background lines

  // Generate smooth curved main path
  const generateMainPath = (isSet1 = true) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 190 } : { x: 320, y: 190 };
    
    // Create smooth flowing path with multiple control points
    const controlPoints = [];
    const numControlPoints = 1 + Math.floor(Math.random() * 3); // 3-5 control points
    
    for (let i = 0; i <= numControlPoints; i++) {
      const progress = i / numControlPoints;
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Add smooth variation to the path, but keep it above the endpoint
      const variation = 40 + Math.random() * 60;
      const offsetX = (Math.random() - 0.5) * variation;
      // Ensure Y offset keeps the path above the endpoint
      const rawOffset = (Math.random() - 0.5) * variation;
      const maxOffset = endPoint.y - baseY - 10; // max downward allowed
      const minOffset = 100 - baseY; // max upward allowed (don't go above y=100)
      const offsetY = Math.max(Math.min(rawOffset, maxOffset), minOffset);

      controlPoints.push({
        x: baseX + offsetX,
        y: Math.min(baseY + offsetY, endPoint.y - 5) // Ensure control points stay above endpoint
      });
    }
    
    // Create smooth cubic bezier path
    let path = `M ${startPoint.x} ${startPoint.y}`;
    
    for (let i = 0; i < controlPoints.length; i++) {
      if (i === controlPoints.length - 1) {
        // Final curve to end point
        const cp1x = controlPoints[i].x + (Math.random() - 0.5) * 30;
        const cp1y = Math.min(controlPoints[i].y + (Math.random() - 0.5) * 30, endPoint.y - 5);
        const cp2x = endPoint.x + (Math.random() - 0.5) * 20;
        const cp2y = Math.min(endPoint.y + (Math.random() - 0.5) * 20, endPoint.y);
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endPoint.x} ${endPoint.y}`;
      } else {
        // Smooth curves between control points
        const nextPoint = controlPoints[i + 1] || endPoint;
        const cp1x = controlPoints[i].x + (Math.random() - 0.5) * 40;
        const cp1y = Math.min(controlPoints[i].y + (Math.random() - 0.5) * 40, endPoint.y - 5);
        const cp2x = nextPoint.x + (Math.random() - 0.5) * 40;
        const cp2y = Math.min(nextPoint.y + (Math.random() - 0.5) * 40, endPoint.y - 5);
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${controlPoints[i].x} ${controlPoints[i].y}`;
      }
    }
    
    return path;
  };

  // Calculate path length for proper animation timing
  const calculatePathLength = (pathString) => {
    // Create a temporary SVG to measure path length
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    svg.appendChild(path);
    document.body.appendChild(svg);
    const length = path.getTotalLength();
    document.body.removeChild(svg);
    return length;
  };

  // Generate smooth messy paths with quadratic and cubic curves
  const generateMessyPath = (isSet1 = true, mainPath) => {
    const startPoint = isSet1 ? { x: 742, y: 120 } : { x: 457, y: 120 };
    const endPoint = isSet1 ? { x: 900, y: 189 } : { x: 320, y: 189 };
    
    // Create more control points for smoother, more varied paths
    const controlPoints = [];
    const numControlPoints = 4 + Math.floor(Math.random() * 5); // 4-8 control points for more variation
    
    for (let i = 0; i <= numControlPoints; i++) {
      const progress = i / numControlPoints;
      const baseX = startPoint.x + (endPoint.x - startPoint.x) * progress;
      const baseY = startPoint.y + (endPoint.y - startPoint.y) * progress;
      
      // Larger deviation for messier appearance, but constrained vertically
      const deviation = 60 + Math.random() * 80; // Increased deviation
      const deviationX = (Math.random() - 0.5) * deviation;
      // Ensure Y deviation keeps the path above the endpoint
      const rawDeviation = (Math.random() - 0.5) * deviation;
      const maxDeviation = endPoint.y - baseY - 15;
      const minDeviation = 100 - baseY;
      const deviationY = Math.max(Math.min(rawDeviation, maxDeviation), minDeviation);

      controlPoints.push({
        x: baseX + deviationX,
        y: Math.min(baseY + deviationY, endPoint.y - 10) // Ensure control points stay well above endpoint
      });
    }
    
    // Create smooth path with mix of quadratic and cubic curves
    let path = `M ${startPoint.x} ${startPoint.y}`;
    
    for (let i = 0; i < controlPoints.length; i++) {
      //MODIFY THIS LINE TO SWITCH BETWEEN QUADRATIC AND CUBIC
      const useQuadratic = 0;//Math.random() > 0.5; // Randomly choose between quadratic and cubic
      
      if (i === controlPoints.length - 1) {
        // Final curve to end point
        if (useQuadratic) {
          const cpx = (controlPoints[i].x + endPoint.x) / 2 + (Math.random() - 0.5) * 40;
          const cpy = Math.min((controlPoints[i].y + endPoint.y) / 2 + (Math.random() - 0.5) * 40, endPoint.y - 5);
          path += ` Q ${cpx} ${cpy} ${endPoint.x} ${endPoint.y}`;
        } else {
          const cp1x = controlPoints[i].x + (Math.random() - 0.5) * 50;
          const cp1y = Math.min(controlPoints[i].y + (Math.random() - 0.5) * 50, endPoint.y - 5);
          const cp2x = endPoint.x + (Math.random() - 0.5) * 30;
          const cp2y = Math.min(endPoint.y + (Math.random() - 0.5) * 30, endPoint.y);
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endPoint.x} ${endPoint.y}`;
        }
      } else {
        // Curves between control points
        if (useQuadratic) {
          const cpx = controlPoints[i].x + (Math.random() - 0.5) * 60;
          const cpy = Math.min(controlPoints[i].y + (Math.random() - 0.5) * 60, endPoint.y - 10);
          path += ` Q ${cpx} ${cpy} ${controlPoints[i].x} ${controlPoints[i].y}`;
        } else {
          const nextPoint = controlPoints[i + 1] || endPoint;
          const cp1x = controlPoints[i].x + (Math.random() - 0.5) * 60;
          const cp1y = Math.min(controlPoints[i].y + (Math.random() - 0.5) * 60, endPoint.y - 10);
          const cp2x = nextPoint.x + (Math.random() - 0.5) * 60;
          const cp2y = Math.min(nextPoint.y + (Math.random() - 0.5) * 60, endPoint.y - 10);
          path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${controlPoints[i].x} ${controlPoints[i].y}`;
        }
      }
    }
    
    return path;
  };

  useEffect(() => {
    // Generate one main smooth path per set
    const mainPath1 = generateMainPath(true);
    const mainPath2 = generateMainPath(false);
    
    // Generate messy paths with smooth curves using the configurable number
    const messyPaths1 = Array.from({ length: NUM_MESSY_LINES }, () => generateMessyPath(true, mainPath1));
    const messyPaths2 = Array.from({ length: NUM_MESSY_LINES }, () => generateMessyPath(false, mainPath2));
    
    // Combine paths (main first, then messy)
    const allPaths1 = [mainPath1, ...messyPaths1];
    const allPaths2 = [mainPath2, ...messyPaths2];
    
    const pathTypes1 = ['main', ...Array(NUM_MESSY_LINES).fill('messy')];
    const pathTypes2 = ['main', ...Array(NUM_MESSY_LINES).fill('messy')];
    
    setPaths({ set1: allPaths1, set2: allPaths2 });
    setPathSmoothness({ set1: pathTypes1, set2: pathTypes2 });
    
    // Main path is always at index 0
    setSurvivingIndices({ set1: 0, set2: 0 });

    // Start animation immediately
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Main path completes after 2.5 seconds, then start messy line disappearance
    const disappearTimer = setTimeout(() => {
      setShouldDisappear(true);
    }, 2600); // 2.5s for main path + 0.1s buffer

    return () => {
      clearTimeout(timer);
      clearTimeout(disappearTimer);
    };
  }, [NUM_MESSY_LINES]);

  const renderPathSet = (pathArray, gradientId, baseDelay = 0, setName) => {
    const survivingIndex = survivingIndices[setName];
    const pathTypesArray = pathSmoothness[setName];
    
    return pathArray.map((path, index) => {
      const isSurviving = index === survivingIndex;
      const pathType = pathTypesArray[index];
      const isMainPath = pathType === 'main';
      const shouldPathDisappear = shouldDisappear && !isSurviving;
      
      // Calculate path length for proper stroke-dasharray animation
      let pathLength = 1000; // default fallback
      try {
        if (typeof document !== 'undefined') {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          pathElement.setAttribute('d', path);
          svg.appendChild(pathElement);
          svg.style.position = 'absolute';
          svg.style.visibility = 'hidden';
          document.body.appendChild(svg);
          pathLength = pathElement.getTotalLength();
          document.body.removeChild(svg);
        }
      } catch (e) {
        // Fallback if path length calculation fails
        pathLength = 1000;
      }
      
      // Smooth path styling - start thin and same opacity for both main and messy lines
      let strokeWidth = "1.2"; // Both start with same thin width
      let opacity = 0.4; // Both start with same opacity
      let filter = 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))'; // Both start with same filter
      
      // Main line gets thicker and more opaque once it reaches the endpoint (after animation completes)
      if (isMainPath && isLoaded) {
        strokeWidth = "3";
        opacity = 1;
        filter = 'drop-shadow(0 3px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 25px rgba(34,197,94,0.7))';
      }
      
      // Surviving line enhancement when others disappear
      if (isSurviving && shouldDisappear && !isMainPath) {
        opacity = 1;
        strokeWidth = "3";
        filter = 'drop-shadow(0 3px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 25px rgba(34,197,94,0.7))';
      }
      
      // Animation styles
      let animationStyles = {};
      
      if (isMainPath) {
        // Main path: animate from source to destination over 2.5 seconds, then get thicker
        animationStyles = {
          strokeDasharray: `${pathLength}`,
          strokeDashoffset: isLoaded ? 0 : pathLength,
          opacity: isLoaded ? 1 : 0,
          transitionDuration: isLoaded ? '2.5s, 0.5s' : '2.5s', // First transition for draw, second for thickness
          transitionDelay: '0s',
          transitionTimingFunction: 'ease-out',
          transitionProperty: isLoaded ? 'stroke-dashoffset, opacity, stroke-width, filter' : 'stroke-dashoffset, opacity'
        };
      } else {
        // Messy paths: appear quickly, then disappear over 2.5 seconds
        animationStyles = {
          strokeDasharray: 'none',
          strokeDashoffset: 0,
          opacity: isLoaded ? (shouldPathDisappear ? 0 : opacity) : 0,
          transitionDuration: shouldPathDisappear ? '2.5s' : '0.5s',
          transitionDelay: shouldPathDisappear ? `${index * 0.05}s` : `${0.2 + index * 0.03}s`,
          transitionTimingFunction: shouldPathDisappear ? 'ease-in' : 'ease-out'
        };
      }
      
      return (
        <path
          key={index}
          d={path}
          fill="none"
          stroke={isMainPath ? `url(#mainGradient)` : `url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all"
          style={{
            ...animationStyles,
            filter: filter
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
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.5}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
          </linearGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.5}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
          </linearGradient>

          {/* Main path gradient */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#06d6a0', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
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
    </div>
  );
};

export default CurvedConnectingLines;
