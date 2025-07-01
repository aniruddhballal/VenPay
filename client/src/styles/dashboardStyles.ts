import { Box, Typography, Button, keyframes } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Keyframes for animations
export const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInSoft = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const float = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
`;

// Glassmorphic Navigation Container
export const NavigationContainer = styled(Box)(({ /*theme*/ }) => ({
  display: 'flex',
  gap: '1rem',
  marginTop: '0rem',
  marginBottom: '2rem',
  padding: '1.5rem',
  background: 'transparent',
  animation: `${slideInFromLeft} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    pointerEvents: 'none',
  },
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '0.75rem',
  },
}));

interface NavigationButtonProps extends ButtonProps {
  borderColor?: string;
}

export const NavigationButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'borderColor',
})<NavigationButtonProps>(({ borderColor = '#10b981' }) => ({
  flex: 1,
  minHeight: '60px',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  border: 'none',
  color: '#1e293b',
  fontWeight: 600,
  fontSize: '1.25rem',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0 1.5rem',

  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `
      linear-gradient(90deg, #1e293b, #334155) 0 0/0 3px no-repeat,
      linear-gradient(270deg, #1e293b, #334155) 100% 100%/0 3px no-repeat,
      linear-gradient(0deg, #1e293b, #334155) 0 100%/3px 0 no-repeat,
      linear-gradient(180deg, #1e293b, #334155) 100% 0/3px 0 no-repeat
    `,
    transition: 'background-size 0.7s ease',
  },

  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&::before': {
      background: `
        linear-gradient(90deg, ${borderColor}, ${borderColor}) 0 0/100% 3px no-repeat,
        linear-gradient(270deg, ${borderColor}, ${borderColor}) 100% 100%/100% 3px no-repeat,
        linear-gradient(0deg, ${borderColor}, ${borderColor}) 0 100%/3px 100% no-repeat,
        linear-gradient(180deg, ${borderColor}, ${borderColor}) 100% 0/3px 100% no-repeat
      `,
    },
  },

  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    opacity: 0.8,
  },
}));

export const SectionContainer = styled(Box)(({ /*theme*/ }) => ({
  marginBottom: '3rem',
  padding: '2rem',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  scrollMarginTop: '2rem',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
}));

// Styled components
export const DashboardContainer = styled(Box)(({ /*theme*/ }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  padding: '2rem',
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  color: '#1e293b',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    backgroundRepeat: 'repeat',
    animation: `${float} 20s linear infinite`,
    zIndex: -1,
    pointerEvents: 'none',
  },
}));

export const DashboardHeader = styled(Typography)(({ /*theme*/ }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  marginBottom: '2rem',
  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  position: 'relative',
  animation: `${slideInDown} 0.8s ease-out`,
  textAlign: 'center',
  wodth: '30rem',
  textShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
}));

export const DashboardSubheader = styled(Typography)(() => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: '#475569',
  position: 'relative',
  padding: '1rem 2rem',
  borderRadius: '10px',
  background: '#fff',
  margin: '2rem auto',
  width: '300px',
  textAlign: 'center',
  zIndex: 1,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    zIndex: -1,
    background: 'linear-gradient(135deg, #3b82f6, #10b981)',
    borderRadius: '12px',

    // Mask to keep only border visible
    WebkitMask:
      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: '5px', // Thickness of visible border
    boxSizing: 'border-box',
  },
}));

export const LoadingContainer = styled(Box)(({ /*theme*/ }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  fontSize: '1.5rem',
  color: '#64748b',
  fontWeight: 600,
  animation: `${fadeInSoft} 0.5s ease-in`,
  gap: '1rem',
}));

export const LoadingSpinner = styled(Box)(({ /*theme*/ }) => ({
  width: '24px',
  height: '24px',
  border: '3px solid rgba(59, 130, 246, 0.3)',
  borderTop: '3px solid #3b82f6',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
}));

export const StyledButton = styled(Button)<{ buttontype: 'profile' | 'logout' }>(({ /*theme,*/ buttontype: buttonType }) => ({
  position: 'absolute',
  width: '120px',
  height: '50px',
  border: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  userSelect: 'none',
  textTransform: 'none',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.4s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
  ...(buttonType === 'logout' && {
    top: '7.15rem',
    right: '3rem',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
    },
  }),
}));

export const ProfileButton = styled(Button)(({ /*theme*/ }) => ({
  position: 'absolute',
  top: '2.15rem',
  right: '5rem',
  width: '60px',
  height: '60px',
  minWidth: '50px',
  borderRadius: '50%',
  border: '3px solid rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  padding: 0,
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  boxShadow: '0 4px 15px rgba(31, 41, 55, 0.4)',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 8px 25px rgba(31, 41, 55, 0.5)',
    border: '3px solid rgba(255, 255, 255, 1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#fff',
  },
}));

export const ProfileImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
}));
