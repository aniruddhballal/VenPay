import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldDisappear, setShouldDisappear] = useState(false);

  useEffect(() => {
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
      // Restart the cycle
      setTimeout(() => {
        setIsLoaded(true);
        setTimeout(() => setShouldDisappear(true), 4000);
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(disappearTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  // Complex intricate paths for Set 1 (upper region)
  const set1Paths = [
    "M 50 150 Q 150 50 250 100 Q 350 150 450 80 Q 550 10 650 90 Q 750 170 850 100 Q 950 30 1050 120",
    "M 60 160 Q 160 60 260 110 Q 360 160 460 90 Q 560 20 660 100 Q 760 180 860 110 Q 960 40 1060 130",
    "M 70 170 Q 170 70 270 120 Q 370 170 470 100 Q 570 30 670 110 Q 770 190 870 120 Q 970 50 1070 140",
    "M 80 180 Q 180 80 280 130 Q 380 180 480 110 Q 580 40 680 120 Q 780 200 880 130 Q 980 60 1080 150",
    "M 90 190 Q 190 90 290 140 Q 390 190 490 120 Q 590 50 690 130 Q 790 210 890 140 Q 990 70 1090 160"
  ];

  // Complex intricate paths for Set 2 (lower region)
  const set2Paths = [
    "M 100 400 Q 200 500 300 350 Q 400 200 500 380 Q 600 560 700 320 Q 800 80 900 400 Q 1000 720 1100 350",
    "M 110 410 Q 210 510 310 360 Q 410 210 510 390 Q 610 570 710 330 Q 810 90 910 410 Q 1010 730 1110 360",
    "M 120 420 Q 220 520 320 370 Q 420 220 520 400 Q 620 580 720 340 Q 820 100 920 420 Q 1020 740 1120 370",
    "M 130 430 Q 230 530 330 380 Q 430 230 530 410 Q 630 590 730 350 Q 830 110 930 430 Q 1030 750 1130 380",
    "M 140 440 Q 240 540 340 390 Q 440 240 540 420 Q 640 600 740 360 Q 840 120 940 440 Q 1040 760 1140 390"
  ];

  const renderPathSet = (paths, gradientId, baseDelay = 0) => {
    return paths.map((path, index) => (
      <path
        key={index}
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="transition-all ease-in-out"
        style={{
          strokeDasharray: 1500,
          strokeDashoffset: isLoaded ? (shouldDisappear ? -1500 : 0) : 1500,
          opacity: isLoaded ? (shouldDisappear ? 0 : 0.8 - index * 0.1) : 0,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))',
          transitionDuration: '3s',
          transitionDelay: `${baseDelay + index * 0.1}s`
        }}
      />
    ));
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Set 1 - Upper flowing lines */}
        {renderPathSet(set1Paths, 'gradient1', 0)}
        
        {/* Set 2 - Lower flowing lines */}
        {renderPathSet(set2Paths, 'gradient2', 0.3)}

        {/* Enhanced Gradient Definitions */}
        <defs>
          {/* Gradient for Set 1 - Cool blues to purples */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
            <stop offset="25%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
            <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
            <stop offset="75%" style={{stopColor: '#d946ef', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#ec4899', stopOpacity: 0.8}} />
          </linearGradient>
          
          {/* Gradient for Set 2 - Warm greens to teals */}
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.9}} />
            <stop offset="25%" style={{stopColor: '#06b6d4', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#3b82f6', stopOpacity: 0.9}} />
            <stop offset="75%" style={{stopColor: '#6366f1', stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.9}} />
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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
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
              {!isLoaded ? 'Initializing...' : shouldDisappear ? 'Flowing away...' : 'Flowing...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurvedConnectingLines;
