import type { SxProps, Theme } from '@mui/material/styles';

export const deleteConfirmationModalStyles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(12px)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  } as SxProps<Theme>,

  modalContainer: {
    position: 'relative',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    maxWidth: '400px',
    width: '100%',
    overflow: 'hidden',
    margin: 0,
    transform: 'none',
    flexShrink: 0,
    animation: 'scaleIn 0.3s ease-out',
    '@keyframes scaleIn': {
      from: {
        opacity: 0,
        transform: 'scale(0.9)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    '@media (max-width: 480px)': {
      margin: '20px',
      maxWidth: 'none',
      width: 'calc(100% - 40px)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.15), rgba(173, 216, 230, 0.1), rgba(255, 240, 245, 0.2))',
      animation: 'pulse 3s ease-in-out infinite',
      zIndex: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
      transform: 'translateX(-100%)',
      animation: 'shimmer 2.5s ease-in-out infinite',
      zIndex: 2,
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.8 },
    },
    '@keyframes shimmer': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  } as SxProps<Theme>,

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 0 16px',
    position: 'relative',
    zIndex: 10,
    '@media (max-width: 480px)': {
      padding: '20px 20px 0 20px',
    },
  } as SxProps<Theme>,

  modalCloseBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    fontSize: '20px',
    transition: 'all 0.2s ease',
    position: 'relative',
    zIndex: 10,
    '&:hover': {
      backgroundColor: '#f1f5f9',
      color: '#334155',
    },
  } as SxProps<Theme>,

  warningIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    position: 'relative',
    zIndex: 10,
  } as SxProps<Theme>,

  warningIconWrapper: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-8px',
      left: '-8px',
      right: '-8px',
      bottom: '-8px',
      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.1), transparent)',
      borderRadius: '50%',
      animation: 'glow 2s ease-in-out infinite alternate',
      zIndex: -1,
    },
    '@keyframes glow': {
      '0%': { 
        opacity: 0.6,
        transform: 'scale(1)',
      },
      '100%': { 
        opacity: 1,
        transform: 'scale(1.1)',
      },
    },
  } as SxProps<Theme>,

  warningIcon: {
    position: 'relative',
    padding: '16px',
    background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.9), rgba(255, 228, 230, 0.8))',
    borderRadius: '50%',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    color: '#dc2626',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15), 0 0 20px rgba(239, 68, 68, 0.1)',
    animation: 'iconPulse 2s ease-in-out infinite',
    '@keyframes iconPulse': {
      '0%, 100%': { 
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15), 0 0 20px rgba(239, 68, 68, 0.1)',
      },
      '50%': { 
        boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25), 0 0 30px rgba(239, 68, 68, 0.2)',
      },
    },
  } as SxProps<Theme>,

  modalContent: {
    padding: '0 32px',
    position: 'relative',
    zIndex: 10,
    '@media (max-width: 480px)': {
      padding: '0 20px',
    },
  } as SxProps<Theme>,

  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: 0,
  } as SxProps<Theme>,

  messageContainer: {
    textAlign: 'center',
    marginBottom: '40px',
  } as SxProps<Theme>,

  message: {
    color: '#475569',
    marginBottom: '12px',
    fontSize: '16px',
    margin: '0 0 12px 0',
    fontWeight: '500',
  } as SxProps<Theme>,

  subtitle: {
    color: '#dc2626',
    fontSize: '14px',
    margin: 0,
    fontWeight: '600',
    background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.8), rgba(255, 228, 230, 0.6))',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    display: 'inline-block',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
    animation: 'warningPulse 3s ease-in-out infinite',
    '@keyframes warningPulse': {
      '0%, 100%': { 
        backgroundColor: 'rgba(254, 242, 242, 0.8)',
        borderColor: 'rgba(239, 68, 68, 0.2)',
      },
      '50%': { 
        backgroundColor: 'rgba(255, 228, 230, 0.9)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      },
    },
  } as SxProps<Theme>,

  modalActions: {
    display: 'flex',
    gap: '16px',
    position: 'relative',
    zIndex: 10,
    padding: '0 0 32px 0',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      padding: '0 0 20px 0',
    },
  } as SxProps<Theme>,

  cancelBtn: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))',
    backdropFilter: 'blur(10px)',
    border: '2px solid #e2e8f0',
    color: '#475569',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    minWidth: 'auto',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover:not(:disabled)': {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(241, 245, 249, 0.9))',
      borderColor: '#cbd5e1',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
    '@media (max-width: 480px)': {
      flex: 'none',
    },
  } as SxProps<Theme>,

  confirmBtn: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ef4444, #f87171)',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&:hover:not(:disabled)': {
      background: 'linear-gradient(135deg, #dc2626, #ef4444)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.35)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
    '@media (max-width: 480px)': {
      flex: 'none',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transform: 'translateX(-100%)',
      transition: 'transform 0.7s ease',
    },
    '&:hover::before': {
      transform: 'translateX(100%)',
    },
  } as SxProps<Theme>,

  loadingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  } as SxProps<Theme>,

  // Global styles for body scroll prevention and animations
  globalStyles: {
    '.modal-open': {
      overflow: 'hidden',
    },
    'html.modal-open': {
      overflow: 'hidden',
    },
    'body': {
      scrollbarGutter: 'stable',
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
};