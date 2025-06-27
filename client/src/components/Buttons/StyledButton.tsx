import { Button } from '@mui/material';

import { styled } from '@mui/material/styles';

// Define the props interface
interface StyledButtonProps {
  variant?: 'original' | 'primary' | 'danger';
  [key: string]: any;
}
// Single unified styled button
export const StyledButton = styled(({ variant = 'original', ...props }: StyledButtonProps) => (
  <Button {...props} />
))(({ theme, variant }) => ({
  // Base styles common to both buttons
  fontWeight: 600,
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  
  // Shared ::before pseudo-element
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    transition: variant === 'original' ? 'left 0.6s ease' : 'left 0.4s ease',
    background: variant === 'original' 
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    ...(variant === 'original' && {
      '@media (prefers-reduced-motion: reduce)': {
        display: 'none',
      },
    }),
  },
  
  '&:hover::before': {
    left: '100%',
  },

  // Variant-specific styles
  ...(variant === 'original' && {
    background: 'linear-gradient(135deg, #059669, #047857)', // ✅ green gradient
    padding: '0rem 1rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    '&:disabled': {
      background: '#9ca3af !important',
      color: '#ffffff !important',
      boxShadow: 'none !important',
      transform: 'none !important',
    },
    [theme.breakpoints.down('md')]: {
      padding: '1rem 2rem',
      fontSize: '1rem',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
      '&:active': { transform: 'none' },
    },
  }),

  ...(variant !== 'original' && {
    padding: '0.375rem 0.875rem',
    fontSize: '0.75rem',
    borderRadius: '6px',
    letterSpacing: '0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    transition: 'all 0.2s ease',
    flex: 1,
    justifyContent: 'center',
  }),

  ...(variant === 'primary' && {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    },
  }),

  ...(variant === 'danger' && {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      boxShadow: '0 4px 8px rgba(239, 68, 68, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    },
  }),
}));