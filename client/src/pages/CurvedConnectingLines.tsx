import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount with a shorter delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200); // Reduced delay before animation starts

    return () => clearTimeout(timer);
  }, []);

  // SVG path for first curved line - from (742,120) to (900,189) with loops and curves
  const path1 = "M 742 120 Q 800 60 850 100 Q 920 140 880 180 Q 860 200 900 189";
  
  // SVG path for second curved line - from (457,120) to (320,189) with loops and curves
  const path2 = "M 457 120 Q 400 80 380 140 Q 350 200 320 160 Q 300 140 320 189";

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Header */}
      <div className="text-center pt-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Company Dashboard</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded"></div>
      </div>

      {/* SVG Container for Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* First Curved Line */}
        <path
          d={path1}
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          className={`transition-all ease-linear ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: isLoaded ? 0 : 1000,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transitionDuration: '3000ms', // Exactly 3 seconds
            transitionProperty: 'stroke-dashoffset, opacity'
          }}
        />
        
        {/* Second Curved Line */}
        <path
          d={path2}
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          className={`transition-all ease-linear ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: isLoaded ? 0 : 1000,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transitionDuration: '3000ms', // Exactly 3 seconds
            transitionProperty: 'stroke-dashoffset, opacity',
            transitionDelay: '0.5s' // Second line starts 0.5s after first
          }}
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#ec4899', stopOpacity: 0.8}} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
            <stop offset="50%" style={{stopColor: '#06b6d4', stopOpacity: 0.9}} />
            <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 0.8}} />
          </linearGradient>
        </defs>
      </svg>

      {/* Content Sections */}
      <div className="relative z-10 px-16 mt-24">
        {/* Center Left Section - First Path Start */}
        <div className="absolute" style={{left: '742px', top: '120px', transform: 'translate(-50%, -50%)'}}>
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-4 shadow-lg"></div>
            <h2 className="text-xl font-semibold text-slate-700 whitespace-nowrap">Dashboard Overview</h2>
            <p className="text-slate-500 mt-2 text-sm">Central hub</p>
          </div>
        </div>

        {/* Right Section - First Path End */}
        <div className="absolute" style={{left: '900px', top: '189px', transform: 'translate(-50%, -50%)'}}>
          <div className="text-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-4 shadow-lg"></div>
            <h2 className="text-xl font-semibold text-slate-700 whitespace-nowrap">Product Catalog</h2>
            <p className="text-slate-500 mt-2 text-sm">Browse products</p>
          </div>
        </div>

        {/* Center Right Section - Second Path Start */}
        <div className="absolute" style={{left: '457px', top: '120px', transform: 'translate(-50%, -50%)'}}>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-4 shadow-lg"></div>
            <h2 className="text-xl font-semibold text-slate-700 whitespace-nowrap">Analytics Hub</h2>
            <p className="text-slate-500 mt-2 text-sm">Data insights</p>
          </div>
        </div>

        {/* Left Section - Second Path End */}
        <div className="absolute" style={{left: '320px', top: '189px', transform: 'translate(-50%, -50%)'}}>
          <div className="text-center">
            <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto mb-4 shadow-lg"></div>
            <h2 className="text-xl font-semibold text-slate-700 whitespace-nowrap">Payment Requests</h2>
            <p className="text-slate-500 mt-2 text-sm">Financial transactions</p>
          </div>
        </div>
      </div>

      {/* Control Panel for Customization */}
      <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-2">Animation Controls</h3>
        <button
          onClick={() => setIsLoaded(!isLoaded)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {isLoaded ? 'Reset' : 'Animate'}
        </button>
      </div>
    </div>
  );
};

export default CurvedConnectingLines;
