import { styled } from '@mui/material/styles';
import {
  Container,
  Card,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { TypographyProps } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px !important', // Increased for horizontal layout
  margin: '3rem auto',
  padding: '0 2rem',
  position: 'relative',
  
  [theme.breakpoints.down('lg')]: {
    maxWidth: '900px !important',
  },
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '0 1.5rem',
    maxWidth: '700px !important',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '0 1rem',
  },
}));

export const StyledCard = styled(Card)(({ /*theme*/ }) => ({
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
    opacity: 0.9,
    zIndex: 1,
  },
  
  '&:hover': {
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -5px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-3px)',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': {
      transform: 'none',
    },
  },
}));

export const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '2.25rem',
  fontWeight: 700,
  color: '#1f2937',
  textAlign: 'left', // Changed from center for horizontal layout
  letterSpacing: '-0.025em',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '0', // Changed from center alignment
    width: '100px',
    height: '3px',
    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
    borderRadius: '2px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '1.875rem',
    textAlign: 'center', // Center on mobile
    '&::after': {
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },

  '@media (prefers-contrast: high)': {
    '&::after': {
      background: '#000000',
    },
  },
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem', // Reduced gap for compact layout
  padding: '1rem', // Reduced padding
  margin: '0.25rem 0', // Reduced margin
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '10px', // Slightly smaller radius
  border: '1px solid #e5e7eb',
  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
  
  '&:hover': {
    backgroundColor: '#f8fafc',
    border: '1px solid #10b981',
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.1), 0 4px 15px -3px rgba(16, 185, 129, 0.15)', // Reduced shadow
    transform: 'translateY(-1px) scale(1.005)', // Reduced transform
    
    '& .info-icon': {
      color: '#10b981',
      transform: 'scale(1.05)', // Reduced scale
    },
    
    '& .info-label': {
      color: '#047857',
    },
    
    '& .info-value': {
      color: '#065f46',
    },
  },
  
  '&:nth-of-type(2n)': {
    '&:hover': {
      border: '1px solid #3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1), 0 4px 15px -3px rgba(59, 130, 246, 0.15)',
      
      '& .info-icon': {
        color: '#3b82f6',
      },
      
      '& .info-label': {
        color: '#1d4ed8',
      },
      
      '& .info-value': {
        color: '#1e40af',
      },
    },
  },
  
  '&:nth-of-type(3n)': {
    '&:hover': {
      border: '1px solid #8b5cf6',
      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.1), 0 4px 15px -3px rgba(139, 92, 246, 0.15)',
      
      '& .info-icon': {
        color: '#8b5cf6',
      },
      
      '& .info-label': {
        color: '#7c3aed',
      },
      
      '& .info-value': {
        color: '#6d28d9',
      },
    },
  },
  
  [theme.breakpoints.down('sm')]: {
    gap: '0.4rem',
    padding: '0.8rem',
    margin: '0.2rem 0',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    
    '&:hover': {
      transform: 'none',
      
      '& .info-icon': {
        transform: 'none',
      },
    },
  },
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: '#6b7280',
  fontSize: '0.8rem', // Slightly smaller
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem', // Reduced gap
  transition: 'color 0.3s ease',
  
  '& .MuiSvgIcon-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '1rem', // Smaller icons
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem', // Slightly smaller
  fontWeight: 500,
  color: '#1f2937',
  wordBreak: 'break-word',
  transition: 'color 0.3s ease',
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
  },
}));

export const UserTypeChip = styled(Chip)<{ usertype: 'company' | 'vendor' }>(({ theme, usertype }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
  height: 'auto',
  borderRadius: '8px',
  textTransform: 'capitalize',
  transition: 'all 0.3s ease',
  
  ...(usertype === 'company' && {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    border: '1px solid #bfdbfe',
    
    '& .MuiChip-icon': {
      color: '#1e40af',
    },
    
    '&:hover': {
      backgroundColor: '#bfdbfe',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  }),
  
  ...(usertype === 'vendor' && {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    
    '& .MuiChip-icon': {
      color: '#065f46',
    },
    
    '&:hover': {
      backgroundColor: '#a7f3d0',
      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
    },
  }),
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: '0.25rem 0.75rem',
  },
}));

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  minHeight: '56px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease',
    
    '@media (prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  },
  
  '&:hover::before': {
    left: '100%',
  },
  
  '&:not(:disabled)': {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    
    '&:hover': {
      background: 'linear-gradient(135deg, #059669, #047857)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
      transform: 'translateY(-2px)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    },
  },
  
  [theme.breakpoints.down('md')]: {
    padding: '1rem 2rem',
    fontSize: '1rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    
    '&:hover': {
      transform: 'none',
    },
    
    '&:active': {
      transform: 'none',
    },
  },
}));

export const SecondaryButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  minHeight: '56px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease',

    '@media (prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  },

  '&:hover::before': {
    left: '100%',
  },

  '&:not(:disabled)': {
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',

    '&:hover': {
      background: 'linear-gradient(135deg, #5b21b6, #4c1d95)',
      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.5)',
      transform: 'translateY(-2px)',
    },

    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
    },
  },

  [theme.breakpoints.down('md')]: {
    padding: '1rem 2rem',
    fontSize: '1rem',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:hover': {
      transform: 'none',
    },

    '&:active': {
      transform: 'none',
    },
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '4rem 3rem',
  color: '#6b7280',
  fontSize: '1.25rem',
  fontWeight: 500,
  background: 'linear-gradient(45deg, #f9fafb, #ffffff)',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  maxWidth: '1200px', // Updated for wider layout
  margin: '3rem auto',
  animation: 'pulse 2s infinite',
  
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.8,
    },
  },
  
  [theme.breakpoints.down('lg')]: {
    maxWidth: '900px',
  },
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
    maxWidth: '700px',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '2rem 1rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
}));

export const ErrorContainer = styled(Alert)(({ theme }) => ({
  textAlign: 'center',
  padding: '4rem 3rem',
  fontSize: '1.25rem',
  fontWeight: 500,
  borderRadius: '16px',
  maxWidth: '1200px', // Updated for wider layout
  margin: '3rem auto',
  
  [theme.breakpoints.down('lg')]: {
    maxWidth: '900px',
  },
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
    maxWidth: '700px',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '2rem 1rem',
  },
}));
