import { useEffect, useState } from 'react';

const CurvedConnectingLines = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPixies1, setShowPixies1] = useState(false);
  const [showPixies2, setShowPixies2] = useState(false);

  useEffect(() => {
    // Trigger animation on component mount with a shorter delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Show pixies dust near the end of first animation (2.5s after start)
      setTimeout(() => {
        setShowPixies1(true);
        // Remove pixies dust after 0.5s
        setTimeout(() => setShowPixies1(false), 500);
      }, 2500);
      
      // Show pixies dust for second line (3s after start - 0.5s delay + 2.5s)
      setTimeout(() => {
        setShowPixies2(true);
        // Remove pixies dust after 0.5s
        setTimeout(() => setShowPixies2(false), 500);
      }, 3000);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Sleek SVG path for first curved line - from (742,120) to (900,189) with elegant curve
  const path1 = "M 742 120 Q 840 60 900 189";
  
  // Sleek SVG path for second curved line - from (457,120) to (320,189) with elegant curve
  const path2 = "M 457 120 Q 370 60 320 189";

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
        {/* First Curved Line - Sleeker */}
        <path
          d={path1}
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`transition-all ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: isLoaded ? 0 : 1000,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
            transitionDuration: '2500ms', // 2.5 seconds
            transitionProperty: 'stroke-dashoffset, opacity'
          }}
        />
        
        {/* Second Curved Line - Sleeker */}
        <path
          d={path2}
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`transition-all ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: isLoaded ? 0 : 1000,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
            transitionDuration: '2500ms', // 2.5 seconds
            transitionProperty: 'stroke-dashoffset, opacity',
            transitionDelay: '0.5s' // Second line starts 0.5s after first
          }}
        />

        {/* Magic Pixie Dust for First Line */}
        {showPixies1 && (
          <g className="animate-pulse">
            {/* Sparkle particles around end point of first line */}
            <circle cx="895" cy="185" r="1.5" fill="#fbbf24" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="905" cy="192" r="1" fill="#f59e0b" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="893" cy="194" r="0.8" fill="#fde047" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.1;0.7" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="908" cy="186" r="1.2" fill="#facc15" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.35s" repeatCount="indefinite"/>
            </circle>
            <circle cx="898" cy="198" r="0.9" fill="#eab308" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.45s" repeatCount="indefinite"/>
            </circle>
            {/* Tiny sparkles */}
            <circle cx="902" cy="180" r="0.5" fill="#fef3c7" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.25s" repeatCount="indefinite"/>
            </circle>
            <circle cx="890" cy="190" r="0.6" fill="#fde68a" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.6s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

        {/* Magic Pixie Dust for Second Line */}
        {showPixies2 && (
          <g className="animate-pulse">
            {/* Sparkle particles around end point of second line */}
            <circle cx="325" cy="185" r="1.5" fill="#34d399" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="315" cy="192" r="1" fill="#10b981" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.4s" repeatCount="indefinite"/>
            </circle>
            <circle cx="327" cy="194" r="0.8" fill="#6ee7b7" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.1;0.7" dur="0.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="312" cy="186" r="1.2" fill="#059669" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.35s" repeatCount="indefinite"/>
            </circle>
            <circle cx="322" cy="198" r="0.9" fill="#047857" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.45s" repeatCount="indefinite"/>
            </circle>
            {/* Tiny sparkles */}
            <circle cx="318" cy="180" r="0.5" fill="#d1fae5" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.1;0.9" dur="0.25s" repeatCount="indefinite"/>
            </circle>
            <circle cx="330" cy="190" r="0.6" fill="#a7f3d0" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.6s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}

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
          onClick={() => {
            setIsLoaded(!isLoaded);
            if (isLoaded) {
              setShowPixies1(false);
              setShowPixies2(false);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {isLoaded ? 'Reset' : 'Animate'}
        </button>
      </div>
    </div>
  );
};

export default CurvedConnectingLines;
