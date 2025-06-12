import React, { useEffect, useState } from 'react';

const GridOverlay = ({ scaleFactor = 1 }: { scaleFactor?: number }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    const toggle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'g') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('keydown', toggle);
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('keydown', toggle);
    };
  }, []);

  if (!isVisible) return null;

  const spacing = 100 * scaleFactor;

  const verticalLines = [];
  for (let x = 0; x <= dimensions.width; x += spacing) {
    verticalLines.push(
      <div
        key={`v-${x}`}
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: 'rgba(255,0,0,0.2)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 2,
            fontSize: 10,
            color: 'red',
            pointerEvents: 'none',
          }}
        >
          {x}px
        </span>
      </div>
    );
  }

  const horizontalLines = [];
  for (let y = 0; y <= dimensions.height; y += spacing) {
    horizontalLines.push(
      <div
        key={`h-${y}`}
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          height: 1,
          width: '100%',
          backgroundColor: 'rgba(0,0,255,0.2)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 2,
            fontSize: 10,
            color: 'blue',
            pointerEvents: 'none',
          }}
        >
          {y}px
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {verticalLines}
      {horizontalLines}
    </div>
  );
};

export default GridOverlay;
