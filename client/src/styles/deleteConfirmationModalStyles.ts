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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(8px)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  } as SxProps<Theme>,

  modalContainer: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
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
      background: 'linear-gradient(135deg, rgba(255, 99, 99, 0.1), rgba(255, 165, 0, 0.1), rgba(255, 192, 203, 0.1))',
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
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transform: 'translateX(-100%)',
      animation: 'shimmer 3s ease-in-out infinite',
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
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    fontSize: '20px',
    transition: 'all 0.2s ease',
    position: 'relative',
    zIndex: 10,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 99, 99, 0.3)',
      borderRadius: '50%',
      filter: 'blur(16px)',
      animation: 'pulse 2s ease-in-out infinite',
    },
  } as SxProps<Theme>,

  warningIcon: {
    position: 'relative',
    padding: '16px',
    background: 'rgba(255, 99, 99, 0.2)',
    borderRadius: '50%',
    border: '1px solid rgba(255, 99, 99, 0.3)',
    color: '#ff6363',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as SxProps<Theme>,

  modalContent: {
    padding: '0 32px 32px 32px',
    position: 'relative',
    zIndex: 10,
    '@media (max-width: 480px)': {
      padding: '0 20px 20px 20px',
    },
  } as SxProps<Theme>,

  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: 0,
  } as SxProps<Theme>,

  messageContainer: {
    textAlign: 'center',
    marginBottom: '32px',
  } as SxProps<Theme>,

  message: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '8px',
    fontSize: '16px',
    margin: '0 0 8px 0',
  } as SxProps<Theme>,

  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    margin: 0,
  } as SxProps<Theme>,

  modalActions: {
    display: 'flex',
    gap: '16px',
    position: 'relative',
    zIndex: 10,
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    },
  } as SxProps<Theme>,

  cancelBtn: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    minWidth: 'auto',
    '&:hover:not(:disabled)': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'scale(1.05)',
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
    background: 'linear-gradient(135deg, #ff6363, #ff8a80)',
    border: 'none',
    color: '#fff',
    fontWeight: '500',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 99, 99, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&:hover:not(:disabled)': {
      background: 'linear-gradient(135deg, #ff5252, #ff7961)',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(255, 99, 99, 0.4)',
    },
    '&:disabled': {
      opacity: 0.5,
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
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
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
    border: '2px solid rgba(255, 255, 255, 0.3)',
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