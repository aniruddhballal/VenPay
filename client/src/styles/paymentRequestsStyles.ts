import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';

// Define the props interface
interface StyledButtonProps extends ButtonProps {
  variant?: 'original' | 'primary' | 'danger';
}

// Single unified styled button
export const StyledButton = styled(Button)<StyledButtonProps>(({ theme, variant = 'original' }) => ({
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
    padding: '0rem 1rem',
    borderRadius: '12px',
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

// CSS-in-JS styles for other components
export const styles = {
  vendorRequestsContainer: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  
  requestsTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#333',
    textAlign: 'center' as const,
  },
  
  requestsLoading: {
    textAlign: 'center' as const,
    fontSize: '1.2rem',
    color: '#666',
    padding: '2rem',
  },
  
  noRequests: {
    textAlign: 'center' as const,
    fontSize: '1.1rem',
    color: '#666',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  
  requestSection: {
    marginBottom: '2rem',
  },
  
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#444',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '0.5rem',
  },
  
  requestCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&.status-accepted': {
      borderLeftColor: '#28a745',
      borderLeftWidth: '4px',
    },
    '&.status-declined': {
      borderLeftColor: '#dc3545',
      borderLeftWidth: '4px',
    },
    '&.status-pending': {
      borderLeftColor: '#ffc107',
      borderLeftWidth: '4px',
    },
  },
  
  requestInfo: {
    marginBottom: '1rem',
    '& p': {
      margin: '0.5rem 0',
      fontSize: '0.95rem',
    },
    '& strong': {
      fontWeight: '600',
      color: '#333',
    },
  },
  
  statusLabel: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
    '&.status-accepted': {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    '&.status-declined': {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
    '&.status-pending': {
      backgroundColor: '#fff3cd',
      color: '#856404',
    },
  },
  
  deadlineUrgent: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  
  paymentSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  
  paymentInputGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  
  paymentInputAmount: {
    flex: '1',
    minWidth: '120px',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  
  paymentInputPassword: {
    flex: '1',
    minWidth: '120px',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  
  paidClear: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: '1rem',
    margin: '0.5rem 0',
  },
  
  transactionsList: {
    marginTop: '1rem',
    '& h5': {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#333',
    },
    '& ul': {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    '& li': {
      padding: '0.5rem',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      marginBottom: '0.25rem',
      fontSize: '0.9rem',
    },
    '& p': {
      color: '#666',
      fontStyle: 'italic' as const,
    },
  },
  
  productRatingSection: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    '& h5': {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#333',
    },
  },
  
  ratingReview: {
    width: '100%',
    marginTop: '10px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  
  ratingSubmitButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    '&:disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
    },
  },
};

export const ExistingRating = styled('div')({
  '& p': {
    margin: '0.5rem 0',
    fontSize: '0.95rem',
  },
  '& strong': {
    fontWeight: 600,
    color: '#333',
  },
});

export const RatingFormWrapper = styled('div')({
  '& p': {
    margin: '0.5rem 0',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
});

export const StarRatingWrapper = styled('div')({
  fontSize: '24px',
  margin: '0.5rem 0',
  '& .star': {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s ease',
    '&.filled': {
      color: '#ffd700',
    },
    '&.readonly': {
      cursor: 'default',
    },
    '&:hover': {
      color: '#ffed4a',
    },
  },
});