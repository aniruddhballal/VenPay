import type { SxProps, Theme } from '@mui/material/styles';

export const datePickerModalStyles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  } as SxProps<Theme>,

  modalContainer: {
    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '450px',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    margin: 0,
    transform: 'none',
    flexShrink: 0,
    animation: 'slideUp 0.3s ease-out',
    '@keyframes slideUp': {
      from: {
        opacity: 0,
        transform: 'translateY(20px) scale(0.95)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      },
    },
    '@media (max-width: 480px)': {
      margin: '20px',
      maxWidth: 'none',
      width: 'calc(100% - 40px)',
    },
  } as SxProps<Theme>,

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 24px 0 24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '24px',
    '@media (max-width: 480px)': {
      padding: '20px 20px 0 20px',
    },
  } as SxProps<Theme>,

  modalTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as SxProps<Theme>,

  modalIcon: {
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    padding: '8px',
    borderRadius: '8px',
    width: '40px',
    height: '40px',
  },

  modalTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    letterSpacing: '-0.025em',
  } as SxProps<Theme>,

  modalCloseBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
      color: '#334155',
    },
  } as SxProps<Theme>,

  modalContent: {
    padding: '0 24px 24px 24px',
    '@media (max-width: 480px)': {
      padding: '0 20px 20px 20px',
    },
  } as SxProps<Theme>,

  dateInputContainer: {
    marginBottom: '20px',
  } as SxProps<Theme>,

  dateLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
    letterSpacing: '-0.025em',
  } as SxProps<Theme>,

  dateInput: {
    width: '90%',
    padding: '14px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 500,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      backgroundColor: '#fefefe',
    },
    '&:hover': {
      borderColor: '#d1d5db',
    },
    '&.error': {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
  } as SxProps<Theme>,

  errorMessage: {
    display: 'block',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: 500,
    marginTop: '6px',
  } as SxProps<Theme>,

  datePreview: {
    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
  } as SxProps<Theme>,

  previewLabel: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0369a1',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  } as SxProps<Theme>,

  previewDate: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#0c4a6e',
  } as SxProps<Theme>,

  modalActions: {
    display: 'flex',
    gap: '12px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    '@media (max-width: 480px)': {
      padding: '20px',
      flexDirection: 'column',
    },
  } as SxProps<Theme>,

  cancelBtn: {
    flex: 1,
    padding: '12px 20px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#6b7280',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '-0.025em',
    textTransform: 'none',
    minWidth: 'auto',
    '&:hover': {
      borderColor: '#d1d5db',
      backgroundColor: '#f9fafb',
      color: '#4b5563',
    },
    '@media (max-width: 480px)': {
      flex: 'none',
    },
  } as SxProps<Theme>,

  btnConfirm: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    letterSpacing: '-0.025em',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    textTransform: 'none',
    minWidth: 'auto',
    '&:hover:not(:disabled)': {
      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: '#d1d5db',
      cursor: 'not-allowed',
      boxShadow: 'none',
      transform: 'none',
    },
    '@media (max-width: 480px)': {
      flex: 'none',
    },
  } as SxProps<Theme>,

  // Global styles for body scroll prevention
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
  },
};
