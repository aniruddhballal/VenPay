import { styled } from '@mui/material/styles';
import { Container, Card, Typography, Box, Select, Alert,
  Avatar, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { TypographyProps } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '700px !important',
  margin: '3rem auto',
  padding: '0 2rem',
  position: 'relative',
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '0 1.5rem',
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
  marginBottom: '3rem',
  textAlign: 'center',
  letterSpacing: '-0.025em',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '3px',
    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
    borderRadius: '2px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '1.875rem',
    marginBottom: '2.5rem',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },

  '@media (prefers-contrast: high)': {
    '&::after': {
      background: '#000000',
    },
  },
}));

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  
  '&:focus-within': {
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    padding: '0.5rem',
    margin: '-0.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    gap: '2rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    '&:focus-within': {
      boxShadow: 'none',
      padding: '0',
      margin: '0',
    },
  },
}));

export const FieldGroup = styled(Box, {
  shouldForwardProp: (prop) => !['focused', 'hasValue', 'hasError', 'isValid'].includes(prop as string),
})<{ focused?: boolean; hasValue?: boolean; hasError?: boolean; isValid?: boolean }>(
  ({ theme, focused, hasValue, hasError, isValid }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    position: 'relative',
    padding: '0.5rem 0',
    
    [theme.breakpoints.down('sm')]: {
      gap: '0.5rem',
    },
    
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: focused ? '#7c3aed' : hasValue ? '#059669' : hasError ? '#dc2626' : '#374151',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
      transition: 'color 0.2s ease',
      transform: focused ? 'translateY(-2px)' : 'none',
      
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        transform: 'none',
      },
    },
    
    '& .MuiOutlinedInput-root': {
      padding: '0',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      
      '& .MuiOutlinedInput-input': {
        padding: '1.125rem 1.25rem',
        fontSize: '1.1rem',
        fontWeight: 500,
        color: '#1f2937',
        
        '&::placeholder': {
          color: '#9ca3af',
          fontWeight: 400,
          opacity: 1,
        },
        
        [theme.breakpoints.down('md')]: {
          padding: '1rem',
          fontSize: '16px', // Prevents zoom on iOS
        },
      },
      
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#d1d5db',
        transition: 'all 0.3s ease',
        
        '@media (prefers-contrast: high)': {
          borderWidth: '3px',
        },
        
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
      },
      
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#9ca3af',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#3b82f6',
        boxShadow: isValid 
          ? '0 0 0 4px rgba(16, 185, 129, 0.15)' 
          : hasError 
          ? '0 0 0 4px rgba(220, 38, 38, 0.15)' 
          : '0 0 0 4px rgba(59, 130, 246, 0.15)',
        
        '@media (prefers-contrast: high)': {
          borderColor: '#000000',
          boxShadow: '0 0 0 3px #000000',
        },
      },
      
      '&.Mui-focused': {
        transform: 'translateY(-2px)',
        
        '@media (prefers-reduced-motion: reduce)': {
          transform: 'none',
        },
      },
      
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        
        '&:hover .MuiOutlinedInput-notchedOutline': {
          boxShadow: 'none',
        },
      },
    },
  })
);

export const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '1.125rem 1.25rem',
    paddingRight: '3rem !important',
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#1f2937',
    
    [theme.breakpoints.down('md')]: {
      padding: '1rem',
      paddingRight: '3rem !important',
      fontSize: '16px',
    },
  },
  
  '& .MuiSelect-icon': {
    right: '1rem',
    width: '1.25rem',
    height: '1.25rem',
  },
}));

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '2rem',
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
    
    '&:hover': {
      transform: 'none',
    },
    
    '&:active': {
      transform: 'none',
    },
  },
}));

export const BackButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '2rem',
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
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', // purple gradient
    color: 'white',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', // purple shadow

    '&:hover': {
      background: 'linear-gradient(135deg, #5b21b6, #4c1d95)', // darker purple on hover
      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.5)',
      transform: 'translateY(-2px)',
    },

    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
    },
  },

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
  maxWidth: '700px',
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
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
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
  maxWidth: '700px',
  margin: '3rem auto',
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '2rem 1rem',
  },
}));

export const ProfilePictureContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem'
});

export const ProfilePictureWrapper = styled(Box)({
  position: 'relative'
});

export const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  cursor: 'pointer',
  border: '4px solid #e5e7eb',
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 0.8
  }
});

export const CameraIconButton = styled(IconButton)({
  position: 'absolute',
  bottom: -8,
  right: -8,
  backgroundColor: '#3b82f6',
  color: 'white',
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: '#10b981'
  }
});

export const HiddenFileInput = styled('input')({
  display: 'none'
});

export const SecurityDivider = styled('div')({
  margin: '1.5rem 0',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#e5e7eb'
  }
});

export const PasswordToggleCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ active }) => ({
  padding: '1rem',
  marginBottom: '1rem',
  backgroundColor: active ? '#f8fafc' : '#fafafa',
  border: active ? '2px solid #3b82f6' : '1px solid #e5e7eb',
  borderRadius: '0.75rem', // Rounded corners (12px)
  cursor: 'pointer',
  transition: 'all 0.25s ease-in-out',
  boxShadow: active ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: active ? '#f1f5f9' : '#f3f4f6',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.01)' // Slight pop effect
  },
  '&:active': {
    transform: 'scale(0.99)' // Pressed in effect
  }
}));

export const PasswordFieldsContainer = styled(Box)({
  marginTop: '1rem'
});

export const ActionButtonsContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginTop: '0rem',
  '@media (max-width: 600px)': {
    flexDirection: 'column'
  }
});

export const FlexButton = styled(Box)({
  flex: 1
});