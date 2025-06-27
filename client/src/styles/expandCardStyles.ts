import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Image Section Styles
export const imageStyles = {
  section: {
    width: '100%',
    height: 200,
    position: 'relative',
    mb: 2,
    borderRadius: 3,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
    },
    '&:hover .edit-overlay': {
      opacity: 1,
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
    },
  } as SxProps<Theme>,

  backgroundOrPlaceholder: (productImage?: string): SxProps<Theme> => ({
    position: 'absolute',
    inset: 0,
    background: productImage
      ? `url(${productImage}) center/cover no-repeat`
      : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    border: !productImage ? '2px dashed #d1d5db' : 'none',
    display: !productImage ? 'flex' : 'block',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': !productImage
      ? {
          border: '2px dashed #667eea',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)',
        }
      : {},
  }),

  uploadAvatar: {
    width: 64,
    height: 64,
    background: alpha('#667eea', 0.1),
    color: '#9ca3af',
    mb: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      color: '#667eea',
    },
  } as SxProps<Theme>,

  uploadText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
    transition: 'color 0.3s ease',
    mb: 0.5,
    '&:hover': {
      color: '#667eea',
    },
  } as SxProps<Theme>,

  uploadCaption: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '400',
  } as SxProps<Theme>,

  editOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 2,
    background: alpha('#1f2937', 0.75),
    backdropFilter: 'blur(2px)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  } as SxProps<Theme>,

  editOverlayAvatar: {
    width: 48,
    height: 48,
    background: alpha('#ffffff', 0.9),
    color: '#667eea',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
    },
  } as SxProps<Theme>,

  editOverlayText: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } as SxProps<Theme>,

  editingOverlay: (previewUrl: string): SxProps<Theme> => ({
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    borderRadius: 3,
    overflow: 'hidden',
    background: `url(${previewUrl}) center/cover no-repeat`,
    border: '2px solid #667eea',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  }),

  editingOverlayInner: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    background: alpha('#667eea', 0.15),
    backdropFilter: 'blur(2px)',
  } as SxProps<Theme>,

  saveButton: {
    width: 56,
    height: 56,
    background: alpha('#ffffff', 0.95),
    color: '#2563eb',
    border: '2px solid rgba(37, 99, 235, 0.3)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      background: alpha('#ffffff', 1),
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
    },
    '&:disabled': {
      background: alpha('#f5f5f5', 0.9),
      color: '#9ca3af',
    },
  } as SxProps<Theme>,

  cancelButton: {
    width: 56,
    height: 56,
    background: alpha('#ffffff', 0.95),
    color: '#dc2626',
    border: '2px solid rgba(220, 38, 38, 0.3)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      background: alpha('#ffffff', 1),
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
    },
    '&:disabled': {
      background: alpha('#f5f5f5', 0.9),
      color: '#9ca3af',
    },
  } as SxProps<Theme>,
};

// Name Section Styles
export const nameStyles = {

  container: {
    marginBottom: '0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  } as React.CSSProperties,

  section: {
    width: '100%',
    position: 'relative',
    mb: 0,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  } as SxProps<Theme>,

  textField: {
    mb: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
      fontSize: '1.3rem',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.04)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
      '&.Mui-focused': {
        background: '#ffffff',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
        transform: 'translateY(-2px)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
  } as SxProps<Theme>,

  metaBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 1,
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
  } as SxProps<Theme>,

  metaChip: {
    fontSize: { xs: '0.6rem', sm: '0.7rem' },
    height: { xs: 20, sm: 24 },
    borderColor: alpha('#667eea', 0.3),
    color: 'text.secondary',
    alignSelf: { xs: 'center', sm: 'auto' },
  } as SxProps<Theme>,

  actionsRow: {
    display: 'flex',
    gap: 2,
  } as SxProps<Theme>,

  displayPaper: {
    p: 0,
    cursor: 'pointer',
    borderRadius: 3,
    background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(240, 244, 255, 0.6) 100%)',
    border: '2px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover .edit-indicator': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '&:hover .name-text': {
      opacity: 0,
    },
  } as SxProps<Theme>,

  displayText: {
    fontSize: '1.3rem',
    fontWeight: '600',
    lineHeight: 1.4,
    color: 'text.primary',
    transition: 'opacity 0.3s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'center',
  } as SxProps<Theme>,

  editIndicator: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
    background: alpha('#667eea', 0.08),
    backdropFilter: 'blur(4px)',
    borderRadius: 3,
    opacity: 0,
    transform: 'scale(0.98)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  } as SxProps<Theme>,

  editIcon: {
    fontSize: 20,
    color: '#667eea',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
    },
  } as SxProps<Theme>,

  editText: {
    color: '#667eea',
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as SxProps<Theme>,
};

// Price Section Styles
export const priceStyles = {
  wrapper: {
    px: { xs: 0, sm: 0 },
    width: '100%',
  } as SxProps<Theme>,

  textField: {
    mb: 1,
    width: '100%',
    minWidth: 0,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
      fontSize: { xs: '1.1rem', sm: '1.3rem' },
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.04)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
      '&.Mui-focused': {
        background: '#ffffff',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
        transform: { xs: 'none', sm: 'translateY(-2px)' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
    '& input': {
      textAlign: 'center',
      px: { xs: 1, sm: 2 },
    },
  } as SxProps<Theme>,

  metaBar: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: { xs: 1, sm: 0 },
    mb: 1,
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
  } as SxProps<Theme>,

  metaText: {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    textAlign: { xs: 'center', sm: 'left' },
  } as SxProps<Theme>,

  metaChip: {
    fontSize: { xs: '0.6rem', sm: '0.7rem' },
    height: { xs: 20, sm: 24 },
    borderColor: alpha('#667eea', 0.3),
    color: 'text.secondary',
    alignSelf: { xs: 'center', sm: 'auto' },
  } as SxProps<Theme>,

  actionRow: {
    display: 'flex',
    gap: { xs: 1, sm: 2 },
    flexDirection: { xs: 'column', sm: 'row' },
    '& > *': {
      minWidth: 0,
    },
  } as SxProps<Theme>,

  displayPaper: {
    p: { xs: 1, sm: 0 },
    cursor: 'pointer',
    borderRadius: 3,
    background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(240, 244, 255, 0.6) 100%)',
    border: '2px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    minHeight: { xs: '35px', sm: '40px' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 0,
    width: '100%',
    minWidth: 0,
    '&:hover .edit-indicator': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '&:hover .price-text': {
      opacity: 0,
    },
  } as SxProps<Theme>,

  displayText: {
    fontSize: { xs: '1.2rem', sm: '1.4rem' },
    fontWeight: '700',
    lineHeight: 1.4,
    color: '#2563eb',
    transition: 'opacity 0.3s ease',
    textAlign: 'center',
    wordBreak: 'break-all',
    px: 1,
  } as SxProps<Theme>,

  editIndicator: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 0.5, sm: 1 },
    background: alpha('#667eea', 0.08),
    backdropFilter: 'blur(4px)',
    borderRadius: 3,
    opacity: 0,
    transform: 'scale(0.98)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    px: 1,
  } as SxProps<Theme>,

  editIcon: {
    fontSize: { xs: 16, sm: 20 },
    color: '#667eea',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
    },
  } as SxProps<Theme>,

  editText: {
    color: '#667eea',
    fontWeight: 700,
    fontSize: { xs: '0.65rem', sm: '0.75rem' },
    textTransform: 'uppercase',
    letterSpacing: { xs: 0.5, sm: 1 },
    textAlign: 'center',
    lineHeight: 1.2,
  } as SxProps<Theme>,
};

// Description Section Styles
export const descriptionStyles = {
  container: (isEditing: boolean, isHovered: boolean): SxProps<Theme> => ({
    position: 'relative',
    mt: 0,
    mb: 0,
    overflow: isEditing && !isHovered ? 'hidden' : 'visible',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }),

  input: {
    mb: 0,
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
      fontSize: '1.1rem',
      lineHeight: 1.6,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        background: 'rgba(102, 126, 234, 0.04)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
      '&.Mui-focused': {
        background: '#ffffff',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
        transform: 'translateY(-2px)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
  } as SxProps<Theme>,

  controlBar: (isHovered: boolean): SxProps<Theme> => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 0,
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s ease',
  }),

  controlChip: {
    fontSize: { xs: '0.6rem', sm: '0.7rem' },
    height: { xs: 20, sm: 24 },
    borderColor: alpha('#667eea', 0.3),
    color: 'text.secondary',
    alignSelf: { xs: 'center', sm: 'auto' },
  } as SxProps<Theme>,

  previewPaper: (isHovered: boolean): SxProps<Theme> => ({
    p: 0,
    cursor: 'pointer',
    borderRadius: 3,
    background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(240, 244, 255, 0.6) 100%)',
    border: '2px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    maxHeight: isHovered ? '100px' : '60px',
    minHeight: '60px',
    '&:hover .edit-indicator': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '&:hover .desc-text': {
      opacity: 0,
    },
  }),

  typography: (isHovered: boolean): SxProps<Theme> => ({
    fontSize: '1.1rem',
    lineHeight: 1.6,
    color: 'text.primary',
    pr: 0,
    transition: 'opacity 0.3s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: isHovered ? 3 : 2,
    WebkitBoxOrient: 'vertical',
  }),

  editIndicator: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
    background: alpha('#667eea', 0.08),
    backdropFilter: 'blur(4px)',
    borderRadius: 3,
    opacity: 0,
    transform: 'scale(0.98)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
  } as SxProps<Theme>,

  editIcon: {
    fontSize: 20,
    color: '#667eea',
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.1)' },
    },
  } as SxProps<Theme>,

  editLabel: {
    color: '#667eea',
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as SxProps<Theme>,
};

// Action Buttons Container
export const actionButtonsStyles = {
  container: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  } as SxProps<Theme>,
  
  saveButton: {
    flex: 1,
    mb: 2,
    fontSize: { xs: '0.8rem', sm: '0.875rem' },
    height: { xs: '32px', sm: '35px' },
    fontWeight: '400',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#2563eb',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    minWidth: { xs: '80px', sm: 'auto' },
    '&:hover': {
      background: '#f0f4ff',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)',
      transform: { xs: 'none', sm: 'translateY(-2px)' },
    },
    '&:active': {
      background: '#e0eaff',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(0)',
    },
  } as SxProps<Theme>,

    cancelButton: {
    width: 56,
    height: 56,
    background: alpha('#ffffff', 0.95),
    color: '#dc2626',
    border: '2px solid rgba(220, 38, 38, 0.3)',
    backdropFilter: 'blur(8px)',
    '&:hover': {
      background: alpha('#ffffff', 1),
      transform: 'scale(1.1)',
      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
    },
    '&:disabled': {
      background: alpha('#f5f5f5', 0.9),
      color: '#9ca3af',
    },
  } as SxProps<Theme>,
};