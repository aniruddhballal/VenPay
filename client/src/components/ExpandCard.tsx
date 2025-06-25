// components/ExpandCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Fade,
  Grow,
  Chip,
  Tooltip,
  alpha,
  IconButton,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Check,
  Close,
  Edit,
  CameraAlt,
  AddPhotoAlternate
} from '@mui/icons-material';

import { StyledButton } from "./StyledButton";
import {
  useProductEditor,
  useNameEditor,
  usePriceEditor,
  useDescriptionEditor,
  useImageEditor,
  useCardInteractions
} from '../hooks/useProductEditor';

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ExpandCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onFieldUpdate: (id: string, field: string, value: string | number) => void;
}

export const ExpandCard: React.FC<ExpandCardProps> = ({
  product,
  onDelete,
  onFieldUpdate
}) => {
  const navigate = useNavigate();

  // Main product editor hook
  const editorState = useProductEditor({ product, onFieldUpdate });

  // Individual editor hooks
  const nameEditor = useNameEditor(
    product,
    editorState.editedName,
    editorState.setEditedName,
    editorState.setIsEditingName,
    onFieldUpdate
  );

  const priceEditor = usePriceEditor(
    product,
    editorState.editedPrice,
    editorState.setEditedPrice,
    editorState.setIsEditingPrice,
    onFieldUpdate
  );

  const descriptionEditor = useDescriptionEditor(
    product,
    editorState.editedDescription,
    editorState.setEditedDescription,
    editorState.setIsEditingDescription,
    onFieldUpdate
  );

  const imageEditor = useImageEditor(
    product,
    editorState.selectedImage,
    editorState.previewUrl,
    editorState.uploadingImage,
    editorState.imageInputRef,
    editorState.fileSelectedRef,
    editorState.setIsEditingImage,
    editorState.setSelectedImage,
    editorState.setPreviewUrl,
    editorState.setUploadingImage,
    onFieldUpdate
  );

  // Card interaction hooks
  const cardInteractions = useCardInteractions(
    editorState.isEditingName,
    editorState.isEditingPrice,
    editorState.isEditingDescription,
    nameEditor.handleNameSave,
    priceEditor.handlePriceSave,
    descriptionEditor.handleDescriptionSave,
    onDelete,
    navigate,
    product._id
  );

  const cardStyles = cardInteractions.getCardStyles();

  return (
    <div 
      className="expand-card-compact"
      onMouseEnter={() => cardInteractions.setIsHovered(true)}
      onMouseLeave={() => {
        cardInteractions.setIsHovered(false);
        cardInteractions.saveAllEdits();
      }} 
      style={{
        ...cardStyles,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Image Section */}
      <Box 
        className="image-section" 
        sx={{
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
          }
        }}
        onClick={imageEditor.handleImageClick}
      >
        {/* Background Image or Upload Placeholder */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: product.image 
              ? `url(${product.image}) center/cover no-repeat`
              : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            border: !product.image ? '2px dashed #d1d5db' : 'none',
            display: !product.image ? 'flex' : 'block',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': !product.image ? {
              border: '2px dashed #667eea',
              background: 'linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)',
            } : {}
          }}
        >
          {/* Upload placeholder content */}
          {!product.image && (
            <>
              <Avatar
                className="upload-icon"
                sx={{
                  width: 64,
                  height: 64,
                  background: alpha('#667eea', 0.1),
                  color: '#9ca3af',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    color: '#667eea',
                  }
                }}
              >
                <AddPhotoAlternate sx={{ fontSize: 32 }} />
              </Avatar>
              
              <Typography
                className="upload-text"
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textAlign: 'center',
                  transition: 'color 0.3s ease',
                  mb: 0.5,
                  '&:hover': {
                    color: '#667eea',
                  }
                }}
              >
                Add Product Image
              </Typography>
              
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  fontWeight: '400'
                }}
              >
                Click to upload • JPG, PNG, or GIF
              </Typography>
            </>
          )}
        </Box>

        {/* Edit Overlay */}
        {product.image && (
          <Box
            className="edit-overlay"
            sx={{
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
              pointerEvents: 'none'
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: alpha('#ffffff', 0.9),
                color: '#667eea',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                }
              }}
            >
              <CameraAlt sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography
              variant="caption"
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              Click to change image
            </Typography>
          </Box>
        )}

        {/* Image Editing Modal Overlay */}
        {editorState.isEditingImage && editorState.selectedImage && (
          <Grow in={editorState.isEditingImage} timeout={300}>
            <Box 
              sx={{ 
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                borderRadius: 3,
                overflow: 'hidden',
                background: `url(${editorState.previewUrl}) center/cover no-repeat`,
                border: '2px solid #667eea',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              }}
            >
              <Box
                sx={{
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
                }}
              >
                <Tooltip title="Save image" arrow>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      imageEditor.handleImageSave();
                    }}
                    disabled={editorState.uploadingImage}
                    size="large"
                    sx={{
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
                      }
                    }}
                  >
                    {editorState.uploadingImage ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Check sx={{ fontSize: 24 }} />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cancel" arrow>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      imageEditor.handleImageCancel();
                    }}
                    disabled={editorState.uploadingImage}
                    size="large"
                    sx={{
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
                      }
                    }}
                  >
                    <Close sx={{ fontSize: 24 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grow>
        )}
        
        <input
          type="file"
          ref={editorState.imageInputRef}
          accept="image/*"
          onChange={imageEditor.handleImageChange}
          style={{ display: 'none' }}
        />
      </Box>
      
      <div className="content">
        {/* Name Section */}
        <div 
          className="basic-info" 
          style={{ 
            marginBottom: '0px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          <Box 
            className="name-section" 
            sx={{
              width: '100%',
              position: 'relative',
              mb: 0,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {editorState.isEditingName ? (
              <Grow in={editorState.isEditingName} timeout={300}>
                <Box>
                  <TextField
                    fullWidth
                    value={editorState.editedName}
                    onChange={(e) => editorState.setEditedName(e.target.value)}
                    onKeyDown={nameEditor.handleNameKeyPress}
                    autoFocus
                    variant="outlined"
                    placeholder="Enter product name..."
                    inputProps={{ maxLength: MAX_NAME_LENGTH }}
                    sx={{
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
                            borderWidth: 2
                          }
                        },
                        '&.Mui-focused': {
                          background: '#ffffff',
                          boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
                          transform: 'translateY(-2px)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#667eea',
                            borderWidth: 2
                          }
                        }
                      }
                    }}
                  />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {editorState.editedName.length}/{MAX_NAME_LENGTH} characters
                    </Typography>
                    <Chip
                      label="Enter to save • Esc to cancel"
                      size="small"
                      variant="filled"
                      sx={{
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                        height: { xs: 20, sm: 24 },
                        borderColor: alpha('#667eea', 0.3),
                        color: 'text.secondary',
                        alignSelf: { xs: 'center', sm: 'auto' }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Save changes (Enter)" arrow>
                      <StyledButton
                        variant="original"
                        onClick={nameEditor.handleNameSave}
                        startIcon={<Check />}
                        sx={{
                          flex: 1,
                          mb: 2,
                          fontSize: '0.875rem',
                          height: '35px',
                          fontWeight: '400',
                          borderRadius: '12px',
                          background: '#ffffff',
                          color: '#2563eb',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                          '&:hover': {
                            background: '#f0f4ff',
                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)',
                            transform: 'translateY(-2px)',
                          },
                          '&:active': {
                            background: '#e0eaff',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                            transform: 'translateY(0)',
                          },
                        }}
                      >
                        Save
                      </StyledButton>
                    </Tooltip>

                    <Tooltip title="Cancel editing (Esc)" arrow>
                      <StyledButton
                        variant="original"
                        onClick={nameEditor.handleNameCancel}
                        startIcon={<Close />}
                        sx={{
                          flex: 1,
                          mb: 2,
                          fontSize: '0.875rem',
                          height: '35px',
                          fontWeight: '400',
                          borderRadius: '12px',
                          background: '#ffffff',
                          color: '#b91c1c',
                          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                          '&:hover': {
                            background: '#fef2f2',
                            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
                            transform: 'translateY(-2px)',
                          },
                          '&:active': {
                            background: '#fee2e2',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                            transform: 'translateY(0)',
                          },
                        }}
                      >
                        Cancel
                      </StyledButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grow>
            ) : (
              <Fade in={!editorState.isEditingName} timeout={200}>
                <Paper
                  onClick={nameEditor.handleNameClick}
                  elevation={0}
                  sx={{
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
                    justifyContent: 'center', // Add this line
                    '&:hover .edit-indicator': {
                      opacity: 1,
                      transform: 'scale(1)'
                    },
                    '&:hover .name-text': {
                      opacity: 0
                    }
                  }}
                >
                  <Typography
                    variant="h6"
                    className="name-text"
                    sx={{
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      lineHeight: 1.4,
                      color: 'text.primary',
                      transition: 'opacity 0.3s ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center' // Add this line
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box
                    className="edit-indicator"
                    sx={{
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
                      pointerEvents: 'none'
                    }}
                  >
                    <Edit
                      sx={{
                        fontSize: 20,
                        color: '#667eea',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' }
                        }
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#667eea',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      Click to edit name
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Box>
          
          {editorState.isEditingPrice ? (
            <Grow in={editorState.isEditingPrice} timeout={300}>
              <Box sx={{ px: { xs: 0, sm: 0 }, width: '100%'  }}> {/* Added responsive padding */}
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{
                    step: "1",
                    min: "0"
                  }}
                  value={editorState.editedPrice}
                  onChange={(e) => editorState.setEditedPrice(e.target.value)}
                  onKeyDown={priceEditor.handlePriceKeyPress}
                  autoFocus
                  variant="outlined"
                  placeholder="Enter product price..."
                  sx={{
                    mb: 1,
                    width: '100%', // Ensure it takes full available width
                    minWidth: 0, // Allow shrinking below default min-width
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                      fontSize: { xs: '1.1rem', sm: '1.3rem' }, // Responsive font size
                      fontWeight: '600',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.04)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        background: '#ffffff',
                        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
                        transform: { xs: 'none', sm: 'translateY(-2px)' }, // Disable transform on mobile
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: 2
                        }
                      }
                    },
                    '& input': {
                      textAlign: 'center',
                      px: { xs: 1, sm: 2 } // Responsive input padding
                    }
                  }}
                />
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: { xs: 1, sm: 0 }, // Add gap on mobile
                  mb: 1,
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    Price in ₹ (minimum: 0)
                  </Typography>
                  <Chip
                    label="Enter to save • Esc to cancel"
                    size="small"
                    variant="filled"
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.7rem' }, // Smaller on mobile
                      height: { xs: 20, sm: 24 },
                      borderColor: alpha('#667eea', 0.3),
                      color: 'text.secondary',
                      alignSelf: { xs: 'center', sm: 'auto' }
                    }}
                  />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, // Reduced gap on mobile
                  flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons on very small screens
                  '& > *': {
                    minWidth: 0 // Allow buttons to shrink
                  }
                }}>
                  <Tooltip title="Save changes (Enter)" arrow>
                    <StyledButton
                      variant="original"
                      onClick={priceEditor.handlePriceSave}
                      startIcon={<Check />}
                      sx={{
                        flex: 1,
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        height: { xs: '32px', sm: '35px' }, // Smaller height on mobile
                        fontWeight: '400',
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#2563eb',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                        minWidth: { xs: '80px', sm: 'auto' }, // Ensure minimum width
                        '&:hover': {
                          background: '#f0f4ff',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)',
                          transform: { xs: 'none', sm: 'translateY(-2px)' }, // Disable transform on mobile
                        },
                        '&:active': {
                          background: '#e0eaff',
                          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      Save
                    </StyledButton>
                  </Tooltip>

                  <Tooltip title="Cancel editing (Esc)" arrow>
                    <StyledButton
                      variant="original"
                      onClick={priceEditor.handlePriceCancel}
                      startIcon={<Close />}
                      sx={{
                        flex: 1,
                        mb: 2,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        height: { xs: '32px', sm: '35px' }, // Smaller height on mobile
                        fontWeight: '400',
                        borderRadius: '12px',
                        background: '#ffffff',
                        color: '#b91c1c',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                        minWidth: { xs: '80px', sm: 'auto' }, // Ensure minimum width
                        '&:hover': {
                          background: '#fef2f2',
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
                          transform: { xs: 'none', sm: 'translateY(-2px)' }, // Disable transform on mobile
                        },
                        '&:active': {
                          background: '#fee2e2',
                          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                          transform: 'translateY(0)',
                        },
                      }}
                    >
                      Cancel
                    </StyledButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grow>
          ) : (
            <Fade in={!editorState.isEditingPrice} timeout={200}>
              <Paper
                onClick={priceEditor.handlePriceClick}
                elevation={0}
                sx={{
                  p: { xs: 1, sm: 0 }, // Add padding on mobile
                  cursor: 'pointer',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(240, 244, 255, 0.6) 100%)',
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  minHeight: { xs: '35px', sm: '40px' }, // Responsive height
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0,
                  width: '100%',
                  minWidth: 0, // Allow shrinking
                  '&:hover .edit-indicator': {
                    opacity: 1,
                    transform: 'scale(1)'
                  },
                  '&:hover .price-text': {
                    opacity: 0
                  }
                }}
              >
                <Typography
                  variant="h6"
                  className="price-text"
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.4rem' }, // Responsive font size
                    fontWeight: '700',
                    lineHeight: 1.4,
                    color: '#2563eb',
                    transition: 'opacity 0.3s ease',
                    textAlign: 'center',
                    wordBreak: 'break-all', // Prevent overflow of long numbers
                    px: 1 // Add some padding to prevent edge touching
                  }}
                >
                  ₹{product.price.toFixed(2)}
                </Typography>
                <Box
                  className="edit-indicator"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile
                    gap: { xs: 0.5, sm: 1 },
                    background: alpha('#667eea', 0.08),
                    backdropFilter: 'blur(4px)',
                    borderRadius: 3,
                    opacity: 0,
                    transform: 'scale(0.98)',
                    transition: 'all 0.3s ease',
                    pointerEvents: 'none',
                    px: 1 // Add padding to prevent edge overflow
                  }}
                >
                  <Edit
                    sx={{
                      fontSize: { xs: 16, sm: 20 }, // Smaller icon on mobile
                      color: '#667eea',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' }
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#667eea',
                      fontWeight: 700,
                      fontSize: { xs: '0.65rem', sm: '0.75rem' }, // Smaller text on mobile
                      textTransform: 'uppercase',
                      letterSpacing: { xs: 0.5, sm: 1 },
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {/* Shorter text on mobile */}
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      Click to edit price
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      Tap to edit
                    </Box>
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}

        </div>

        <Box 
          className="details" 
          sx={{
            position: 'relative',
            mt: 0,
            mb: 0,
            overflow: editorState.isEditingDescription && !cardInteractions.isHovered ? 'hidden' : 'visible',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {editorState.isEditingDescription ? (
            <Grow in={editorState.isEditingDescription} timeout={300}>
              <Box>
                <TextField
                  inputRef={editorState.descriptionInputRef}
                  fullWidth
                  multiline
                  rows={4}
                  value={editorState.editedDescription}
                  onChange={(e) => editorState.setEditedDescription(e.target.value)}
                  onKeyDown={descriptionEditor.handleDescriptionKeyPress}
                  autoFocus
                  variant="outlined"
                  placeholder="Enter product description..."
                  inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }} // Add this line
                  sx={{
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
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        background: '#ffffff',
                        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                          borderWidth: 2
                        }
                      }
                    }
                  }}
                />
                
                {/* Show additional controls only when hovered while editing */}
                {cardInteractions.isHovered && (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 0,
                      opacity: cardInteractions.isHovered ? 1 : 0,
                      transform: cardInteractions.isHovered ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        {editorState.editedDescription.length}/{MAX_DESCRIPTION_LENGTH} characters
                      </Typography>
                      <Chip
                        label="Enter to save • Esc to cancel"
                        size="small"
                        variant="filled"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem' }, // Smaller on mobile
                          height: { xs: 20, sm: 24 },
                          borderColor: alpha('#667eea', 0.3),
                          color: 'text.secondary',
                          alignSelf: { xs: 'center', sm: 'auto' }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 0 }}>
                      <Tooltip title="Save changes (Enter)" arrow>
                        <StyledButton
                          variant="original"
                          onClick={descriptionEditor.handleDescriptionSave}
                          startIcon={<Check />}
                          sx={{
                            flex: 1,
                            fontSize: '0.875rem',
                            height: '35px',
                            fontWeight: '400',
                            borderRadius: '12px',
                            background: '#ffffff',
                            color: '#2563eb',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                            '&:hover': {
                              background: '#f0f4ff',
                              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.5)',
                              transform: 'translateY(-2px)',
                            },
                            '&:active': {
                              background: '#e0eaff',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                              transform: 'translateY(0)',
                            },
                          }}
                        >
                          Save
                        </StyledButton>
                      </Tooltip>

                      <Tooltip title="Cancel editing (Esc)" arrow>
                        <StyledButton
                          variant="original"
                          onClick={descriptionEditor.handleDescriptionCancel}
                          startIcon={<Close />}
                          sx={{
                            flex: 1,
                            mb: 2,
                            fontSize: '0.875rem',
                            height: '35px',
                            fontWeight: '400',
                            borderRadius: '12px',
                            background: '#ffffff',
                            color: '#b91c1c',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                            '&:hover': {
                              background: '#fef2f2',
                              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
                              transform: 'translateY(-2px)',
                            },
                            '&:active': {
                              background: '#fee2e2',
                              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                              transform: 'translateY(0)',
                            },
                          }}
                        >
                          Cancel
                        </StyledButton>
                      </Tooltip>
                    </Box>
                  </>
                )}
              </Box>
            </Grow>
          ) : (
            <Fade in={!editorState.isEditingDescription} timeout={200}>
              <Paper
                onClick={descriptionEditor.handleDescriptionClick}
                elevation={0}
                sx={{
                  p: 0,
                  cursor: 'pointer',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(248, 250, 255, 0.8) 0%, rgba(240, 244, 255, 0.6) 100%)',
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  // Limit height when not editing to prevent overflow
                  maxHeight: cardInteractions.isHovered ? '100px' : '60px',
                  minHeight: '60px',
                  '&:hover .edit-indicator': {
                    opacity: 1,
                    transform: 'scale(1)'
                  },
                  '&:hover .desc-text': {
                    opacity: 0
                  }
                }}
              >
                <Typography
                  variant="body1"
                  className="desc-text"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'text.primary',
                    pr: 0,
                    transition: 'opacity 0.3s ease',
                    // Truncate text when not editing
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: cardInteractions.isHovered ? 3 : 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {product.description}
                </Typography>
                <Box
                  className="edit-indicator"
                  sx={{
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
                    pointerEvents: 'none'
                  }}
                >
                  <Edit
                    sx={{
                      fontSize: 20,
                      color: '#667eea',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' }
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#667eea',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: 1
                    }}
                  >
                    Click to edit description
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'rem' }}>
          <StyledButton
            variant="primary"
            onClick={cardInteractions.handleVisitProduct}
            sx={{
              fontSize: '0.875rem',
            }}
          >
            Details
          </StyledButton>

          <StyledButton
            variant="danger"
            onClick={cardInteractions.handleDelete}
            sx={{
              fontSize: '0.875rem',
            }}
          >
            🗑️ Delete
          </StyledButton>
        </div>
        
      </div>
    </div>
  );
};