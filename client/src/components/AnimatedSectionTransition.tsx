import React, { useState, useEffect } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';

// Sophisticated animation keyframes
const curtainReveal = keyframes`
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translateX(0);
    opacity: 1;
  }
`;

const elegantFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    filter: blur(8px);
  }
  50% {
    opacity: 0.7;
    transform: translateY(15px) scale(0.98);
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

const corporateSlide = keyframes`
  0% {
    transform: translateX(100%) skewX(-10deg);
    opacity: 0;
    filter: brightness(0.8);
  }
  30% {
    transform: translateX(20%) skewX(-5deg);
    opacity: 0.5;
    filter: brightness(0.9);
  }
  100% {
    transform: translateX(0) skewX(0deg);
    opacity: 1;
    filter: brightness(1);
  }
`;

const executiveEntrance = keyframes`
  0% {
    transform: perspective(1000px) rotateX(45deg) translateZ(-100px);
    opacity: 0;
    filter: blur(4px);
  }
  60% {
    transform: perspective(1000px) rotateX(10deg) translateZ(-20px);
    opacity: 0.8;
    filter: blur(1px);
  }
  100% {
    transform: perspective(1000px) rotateX(0deg) translateZ(0px);
    opacity: 1;
    filter: blur(0);
  }
`;

const premiumZoom = keyframes`
  0% {
    transform: scale(0.85) translateZ(-50px);
    opacity: 0;
    filter: blur(6px) brightness(0.7);
  }
  40% {
    transform: scale(0.95) translateZ(-20px);
    opacity: 0.6;
    filter: blur(2px) brightness(0.85);
  }
  100% {
    transform: scale(1) translateZ(0);
    opacity: 1;
    filter: blur(0) brightness(1);
  }
`;

const luxuryGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 40px rgba(16, 185, 129, 0.15),
      0 0 80px rgba(16, 185, 129, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  50% {
    box-shadow: 
      0 0 60px rgba(16, 185, 129, 0.25),
      0 0 120px rgba(16, 185, 129, 0.15),
      inset 0 0 30px rgba(255, 255, 255, 0.08);
  }
`;

const borderSweep = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
`;

// Elite styled components
const AnimationContainer = styled(Box)<{ 
  animationType: string;
  isActive: boolean;
}>`
  animation: ${({ animationType }) => {
    switch (animationType) {
      case 'curtain':
        return curtainReveal;
      case 'elegant':
        return elegantFade;
      case 'corporate':
        return corporateSlide;
      case 'executive':
        return executiveEntrance;
      case 'premium':
        return premiumZoom;
      default:
        return elegantFade;
    }
  }} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  
  opacity: 0;
  position: relative;
  
  ${({ isActive }) => isActive && `
    animation: ${luxuryGlow} 3s ease-in-out infinite;
  `}
`;

const ContentWrapper = styled(Box)`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(20px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(16, 185, 129, 0.8) 30%, 
      rgba(59, 130, 246, 0.8) 70%, 
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ${borderSweep} 2s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 0%, 
      rgba(16, 185, 129, 0.05) 0%, 
      transparent 70%
    );
    pointer-events: none;
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.12) 100%
    );
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 0 60px rgba(16, 185, 129, 0.1);
  }
`;

const GeometricAccent = styled(Box)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(16, 185, 129, 0.1) 0%, 
    transparent 70%
  );
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border: 1px solid rgba(59, 130, 246, 0.4);
    border-radius: 2px;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: linear-gradient(45deg, 
      rgba(16, 185, 129, 0.6), 
      rgba(59, 130, 246, 0.6)
    );
    border-radius: 50%;
  }
`;

const ProfessionalGrid = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
`;

const StatusIndicator = styled(Box)<{ isActive: boolean }>`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ isActive }) => 
    isActive 
      ? 'radial-gradient(circle, rgba(16, 185, 129, 1) 0%, rgba(16, 185, 129, 0.4) 100%)'
      : 'radial-gradient(circle, rgba(156, 163, 175, 0.8) 0%, rgba(156, 163, 175, 0.3) 100%)'
  };
  box-shadow: ${({ isActive }) => 
    isActive 
      ? '0 0 20px rgba(16, 185, 129, 0.5)'
      : '0 0 10px rgba(156, 163, 175, 0.3)'
  };
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 1px solid ${({ isActive }) => 
      isActive 
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(156, 163, 175, 0.2)'
    };
    border-radius: 50%;
    animation: ${({ isActive }) => isActive ? 'pulse 2s infinite' : 'none'};
  }
`;

interface AnimatedSectionTransitionProps {
  children: React.ReactNode;
  sectionKey: string;
  animationType?: 'curtain' | 'elegant' | 'corporate' | 'executive' | 'premium';
  showAccents?: boolean;
  luxuryMode?: boolean;
}

export default function AnimatedSectionTransition({
  children,
  sectionKey,
  animationType = 'elegant',
  showAccents = true,
  luxuryMode = true
}: AnimatedSectionTransitionProps) {
  const [currentKey, setCurrentKey] = useState(sectionKey);
  // @ts-ignore: isAnimating is used for transition timing
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (sectionKey !== currentKey) {
      setIsAnimating(true);
      setIsActive(false);
      
      const timer = setTimeout(() => {
        setCurrentKey(sectionKey);
        setIsAnimating(false);
        setIsActive(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setIsActive(true);
    }
  }, [sectionKey, currentKey]);

  return (
    <AnimationContainer
      animationType={animationType}
      isActive={luxuryMode && isActive}
      key={currentKey}
    >
      <ContentWrapper>
        <ProfessionalGrid />
        
        {showAccents && (
          <>
            <StatusIndicator isActive={isActive} />
            <GeometricAccent />
          </>
        )}
        
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2,
          padding: '24px',
          minHeight: '200px'
        }}>
          {children}
        </Box>
      </ContentWrapper>
    </AnimationContainer>
  );
}