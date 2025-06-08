import React, { useEffect, useState, useRef} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

// Add this import at the top of your component file
import { useNavigate } from "react-router-dom";

// 1. Add a constant at the top of your file for the character limit
const MAX_DESCRIPTION_LENGTH = 96; // Or whatever limit you want
const MAX_NAME_LENGTH = 18; // Add this

// IMPORT THESE MUI COMPONENTS AT THE TOP OF YOUR FILE:
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Grow,
  Chip,
  Tooltip,
  alpha
} from '@mui/material';
import type { ButtonProps } from "@mui/material";
import {
  Check,
  Close,
  Edit,
} from '@mui/icons-material';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

import { styled } from '@mui/material/styles';

interface StyledButton2Props extends ButtonProps {
  variantType?: 'primary' | 'danger';
}

const StyledButton2 = styled(({ variantType, ...props }: StyledButton2Props) => (
  <Button {...props} />
))(({ theme, variantType }) => ({
  padding: '0.375rem 0.875rem',
  fontSize: '0.75rem',
  borderRadius: '6px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.025em',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  color: 'white',
  flex: 1,
  justifyContent: 'center',


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

  ...(variantType === 'primary' && {
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

  ...(variantType === 'danger' && {
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

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '0rem 1rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  color: 'white',

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
}));

// Updated ExpandCard component with hover-based resizing
const ExpandCard = ({ product, onDelete, onFieldUpdate }: { 
  product: Product; 
  onDelete: (id: string) => void;
  onFieldUpdate: (id: string, field: string, value: string | number) => void;
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // New hover state
  const [editedName, setEditedName] = useState(product.name);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());
  const [editedDescription, setEditedDescription] = useState(product.description);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);

  // Calculate the appropriate height and styling based on states
  const getCardStyles = () => {
    if (isHovered) {      // removed the isEditing condition because new saveAllWhenNotHovering() is there now
      // Full expansion when hovering
      return {
        height: 'auto',
        minHeight: '480px',
        maxHeight: 'none',
        transform: 'scale(1.02)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        zIndex: 10,
      };
    } else {
      return {
        height: 'auto',
        minHeight: '320px',
        maxHeight: '320px',
        transform: 'scale(1)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        zIndex: 1,
      };
    }
  };

  const handleVisitProduct = () => {
    navigate(`/product/${product._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product._id);
  };

  // Name editing handlers
  const handleNameClick = () => {
    setIsEditingName(true);
    setEditedName(product.name);
  };

  const handleNameSave = async () => {
    if (editedName.trim() !== product.name && editedName.trim() !== '') {
      await onFieldUpdate(product._id, 'name', editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(product.name);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  // Price editing handlers
  const handlePriceClick = () => {
    setIsEditingPrice(true);
    setEditedPrice(product.price.toString());
  };

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      const input = descriptionInputRef.current;
      const length = input.value.length;
      input.setSelectionRange(length, length);
      input.focus();
    }
  }, [isEditingDescription]);

  const handlePriceSave = async () => {
    const newPrice = parseFloat(editedPrice);
    if (!isNaN(newPrice) && newPrice !== product.price && newPrice >= 0) {
      await onFieldUpdate(product._id, 'price', newPrice);
    }
    setIsEditingPrice(false);
  };

  const handlePriceCancel = () => {
    setEditedPrice(product.price.toString());
    setIsEditingPrice(false);
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceSave();
    } else if (e.key === 'Escape') {
      handlePriceCancel();
    }
  };

  // Description editing handlers
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
    setEditedDescription(product.description);
  };

  const handleDescriptionSave = async () => {
    if (editedDescription.trim() !== product.description && editedDescription.trim() !== '') {
      await onFieldUpdate(product._id, 'description', editedDescription.trim());
    }
    setIsEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setEditedDescription(product.description);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  // Image editing handlers
  const handleImageClick = () => {
    setIsEditingImage(true);
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
    }
  };

  const handleImageSave = async () => {
    if (!selectedImage) {
      setIsEditingImage(false);
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/upload-image/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      
      await onFieldUpdate(product._id, 'image', res.data.image);
      toast.success("Product image updated!");
      
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      toast.error(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      setIsEditingImage(false);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setIsEditingImage(false);
  };

  const saveAllEdits = async () => {
    if (isEditingName) {
      await handleNameSave();
    }
    if (isEditingPrice) {
      await handlePriceSave();
    }
    if (isEditingDescription) {
      await handleDescriptionSave();
    }
    /*if (isEditingImage) {
      await handleImageSave();
    }*/
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const cardStyles = getCardStyles();

  return (
    <div 
      className="expand-card-compact"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        saveAllEdits();
      }} 
      style={{
        ...cardStyles,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="image-section">
        {isEditingImage && selectedImage ? (
          <div className="image-edit-container">
            <img 
              src={previewUrl} 
              alt="Preview"
              className="product-image image-preview-inline"
            />
            <div className="image-edit-overlay">
              <div className="image-edit-buttons">
                <button 
                  className="btn-save-image"
                  onClick={handleImageSave}
                  disabled={uploadingImage}
                  title="Save image"
                >
                  {uploadingImage ? '⏳' : '✓'}
                </button>
                <button 
                  className="btn-cancel-image"
                  onClick={handleImageCancel}
                  disabled={uploadingImage}
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ) : product.image ? (
          <div 
            className="image-container-editable" 
            onClick={handleImageClick} 
            title="Click to change image"
            style={{ 
              position: 'relative', 
              cursor: 'pointer',
              border: '2px dashed transparent',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px dashed #007bff';
              const hint = e.currentTarget.querySelector('.image-edit-hint');
              if (hint) (hint as HTMLElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px dashed transparent';
              const hint = e.currentTarget.querySelector('.image-edit-hint');
              if (hint) (hint as HTMLElement).style.opacity = '0';
            }}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
            <div 
              className="image-edit-hint"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '12px',
                opacity: '0',
                transition: 'opacity 0.2s ease',
                borderBottomLeftRadius: '6px',
                borderBottomRightRadius: '6px'
              }}
            >
              📷 Click to change
            </div>
          </div>
        ) : (
          <div 
            className="image-placeholder image-placeholder-editable" 
            onClick={handleImageClick} 
            title="Click to add image"
            style={{
              cursor: 'pointer',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              backgroundColor: '#f8f9fa'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px dashed #007bff';
              e.currentTarget.style.backgroundColor = '#e3f2fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px dashed #ccc';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
              <div 
                className="image-upload-hint"
                style={{
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: '500'
                }}
              >
                📷 Click to add image
              </div>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="content">
        <div 
          className="basic-info" 
          style={{ 
            marginBottom: '0px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start' // optional: aligns left
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
            {isEditingName ? (
              <Grow in={isEditingName} timeout={300}>
                <Box>
                  <TextField
                    fullWidth
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={handleNameKeyPress}
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
                  
                  {/* Show additional controls when editing name */}
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
                      {editedName.length}/{MAX_NAME_LENGTH} characters
                    </Typography>
                    <Chip
                      label="Enter to save • Esc to cancel"
                      size="small"
                      variant="filled"
                      sx={{
                        fontSize: '0.7rem',
                        height: 24,
                        borderColor: alpha('#667eea', 0.3),
                        color: 'text.secondary'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Save changes (Enter)" arrow>
                      <StyledButton
                        onClick={handleNameSave}
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
                        onClick={handleNameCancel}
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
              <Fade in={!isEditingName} timeout={200}>
                <Paper
                  onClick={handleNameClick}
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
          
          {/*Replace the existing price editing section (lines ~498-540) with this:*/}

          {isEditingPrice ? (
            <Grow in={isEditingPrice} timeout={300}>
              <Box>
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{
                    step: "0.01",
                    min: "0"
                  }}
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  onKeyDown={handlePriceKeyPress}
                  autoFocus
                  variant="outlined"
                  placeholder="Enter product price..."
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
                    },
                    '& input': {
                      textAlign: 'center'
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
                    Price in ₹ (minimum: 0)
                  </Typography>
                  <Chip
                    label="Enter to save • Esc to cancel"
                    size="small"
                    variant="filled"
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderColor: alpha('#667eea', 0.3),
                      color: 'text.secondary'
                    }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Tooltip title="Save changes (Enter)" arrow>
                    <StyledButton
                      onClick={handlePriceSave}
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
                      onClick={handlePriceCancel}
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
            <Fade in={!isEditingPrice} timeout={200}>
              <Paper
                onClick={handlePriceClick}
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
                  justifyContent: 'center',
                  mb: 0, // Add margin bottom for spacing
                  '&:hover .edit-indicator': {
                    opacity: 1,
                    transform: 'scale(1)'
                  },
                  '&:hover .price-text': {
                    opacity: 0
                  },
                  width: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  className="price-text"
                  sx={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    lineHeight: 1.4,
                    color: '#2563eb',
                    transition: 'opacity 0.3s ease',
                    textAlign: 'center'
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
                    Click to edit price
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
            // Dynamic height based on editing and hover states
            //minHeight: isEditingDescription ? (isHovered ? '300px' : '100px') : (isHovered ? '100px' : '60px'),
            //maxHeight: isEditingDescription ? (isHovered ? 'none' : '100px') : (isHovered ? '100px' : '60px'),
            overflow: isEditingDescription && !isHovered ? 'hidden' : 'visible',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {isEditingDescription ? (
            <Grow in={isEditingDescription} timeout={300}>
              <Box>
              {/* 3. In the ExpandCard component, modify the TextField for description editing:*/}
                <TextField
                  inputRef={descriptionInputRef}
                  fullWidth
                  multiline
                  rows={4} // More rows when hovered while editing
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyPress}
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
                {isHovered && (
                  <>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 0,
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'all 0.3s ease'
                    }}>
                      {/* 4. Update the character counter in ExpandCard to show the limit:*/}
                      <Typography variant="caption" color="text.secondary">
                        {editedDescription.length}/{MAX_DESCRIPTION_LENGTH} characters
                      </Typography>
                      <Chip
                        label="Enter to save • Esc to cancel"
                        size="small"
                        variant="filled"
                        sx={{
                          fontSize: '0.7rem',
                          height: 24,
                          borderColor: alpha('#667eea', 0.3),
                          color: 'text.secondary'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 0 }}>
                      <Tooltip title="Save changes (Enter)" arrow>
                        <StyledButton
                          onClick={handleDescriptionSave}
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
                          onClick={handleDescriptionCancel}
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
            <Fade in={!isEditingDescription} timeout={200}>
              <Paper
                onClick={handleDescriptionClick}
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
                  maxHeight: isHovered ? '100px' : '60px',
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
                    WebkitLineClamp: isHovered ? 3 : 2,
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
                    Click to edit
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'rem' }}>
          <StyledButton2
            variantType="primary"
            onClick={handleVisitProduct}
            sx={{
              fontSize: '0.875rem',
            }}
          >
            Details
          </StyledButton2>

          <StyledButton2
            variantType="danger"
            onClick={handleDelete}
            sx={{
              fontSize: '0.875rem',
            }}
          >
            🗑️ Delete
          </StyledButton2>
        </div>
        
      </div>
    </div>
  );
};

// Add Product Card Component
const AddProductCard = ({ 
  form, 
  onFormChange, 
  onSubmit, 
  onImageChange, 
  selectedImage, 
  previewUrl, 
  isSubmitting, 
  uploadingImage, 
  fileInputRef,
  editingId,
  onCancel
}: {
  form: { name: string; description: string; price: string };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  previewUrl: string;
  isSubmitting: boolean;
  uploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  editingId: string | null;
  onCancel: () => void;
}) => {
  return (
    <div className="expand-card-compact add-product-card" style={{
      border: '2px dashed #007bff',
      backgroundColor: '#f8f9ff',
      transition: 'all 0.2s ease'
    }}>
      <form onSubmit={onSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="image-section">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected product"
              className="product-image"
              style={{ borderRadius: '8px' }}
            />
          ) : (
            <div 
              className="image-placeholder"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {selectedImage ? selectedImage.name : 'Click to add image'}
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="basic-info" style={{ marginBottom: '12px' }}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              maxLength={MAX_NAME_LENGTH} // Add this
              style={{
                width: '80%',
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            />
            {/*Add character counter for name in AddProductCard:*/}
            <div style={{ 
              fontSize: '12px', 
              color: form.name.length > MAX_NAME_LENGTH * 0.9 ? '#dc2626' : '#666',
              textAlign: 'left',
              marginTop: '4px'
            }}>
              Name: {form.name.length}/{MAX_NAME_LENGTH}
            </div>
            <input
              name="price"
              placeholder="Price (₹)"
              type="number"
              step="1"
              value={form.price}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              style={{
                width: '52%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                marginLeft: '10px'
              }}
            />
          </div>
          
          <div className="details" style={{ flex: 1, marginBottom: '12px' }}>
            {/* 2. In the AddProductCard component, modify the textarea:*/}
            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH} // Add this line
              style={{
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
                maxHeight: '70px',
              }}
            />
          {/*Add character counter below the textarea in AddProductCard:*/}
            <div style={{ 
              fontSize: '12px', 
              color: form.description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '#dc2626' : '#666',
              textAlign: 'right',
              marginTop: '4px'
            }}>
              {form.description.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
          </div>
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success btn-small"
              disabled={isSubmitting || uploadingImage}
              style={{ marginRight: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <span>⏳</span>
                  {editingId ? (
                    selectedImage ? ' Updating...' : ' Updating...'
                  ) : (
                    selectedImage ? ' Creating...' : ' Creating...'
                  )}
                </>
              ) : (
                <>
                  <span>{editingId ? '💾' : '➕'}</span>
                  {editingId ? ' Update' : ' Create'}
                </>
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-cancel btn-small"
                disabled={isSubmitting}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Restore your original useEffect for fetching from backend:
  useEffect(() => {
     axios
       .get("http://localhost:5000/api/products/my", { withCredentials: true })
       .then((res) => {
         setProducts(res.data);
       })
       .catch((err) => {
         console.error("Failed to fetch products:", err);
         toast.warn(err.response?.data?.error || "Failed to fetch products.");
       })
       .finally(() => setLoading(false));
    
  }, []);

  // Create image preview on image select
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingId(null);
    setSelectedImage(null);
    setPreviewUrl("");
  };

  // Step 5: Add validation in handleChange function for name length
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If it's the description field, enforce character limit
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    
    // If it's the name field, enforce character limit
    if (name === 'name' && value.length > MAX_NAME_LENGTH) {
      return;
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Upload image separately after product creation/update
  const uploadImage = async (productId: string) => {
    if (!selectedImage) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
       const res = await axios.post(
         `http://localhost:5000/api/products/upload-image/${productId}`,
         formData,
         {
           headers: { "Content-Type": "multipart/form-data" },
           withCredentials: true,
         }
       );
      // // Update product image url locally in products list
       setProducts((prev) =>
         prev.map((p) => (p._id === productId ? { ...p, image: res.data.image } : p))
       );
      
      console.log("Image upload placeholder");
    } catch (err: any) {
      console.error("Failed to upload image:", err);
       toast.error(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // New function to handle inline field updates
  const handleFieldUpdate = async (id: string, field: string, value: string | number) => {
    try {
      const updateData = { [field]: value };
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        updateData,
        { withCredentials: true }
      );
      
      setProducts(prev => 
        prev.map(p => p._id === id ? { ...p, [field]: value } : p)
      );
      
      const fieldName = field === 'name' ? 'name' : field === 'price' ? 'price' : field === 'description' ? 'description' : 'image';
      if (field !== 'image') {
        toast.success(`Product ${fieldName} updated!`);
      }
    } catch (err: any) {
      console.error(`Failed to update product ${field}:`, err);
      toast.error(err.response?.data?.error || `Failed to update product ${field}.`);
    }
  };

  // 6. Optional: Add validation before form submission:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  // Validate description length
  if (form.description.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
    return;
  }

    setIsSubmitting(true);
  
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
    };

    try {
      let res: any;
      if (editingId) {
        res = await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productData,
          { withCredentials: true }
        );
        
        if (selectedImage) {
          await uploadImage(editingId);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await axios.get(`http://localhost:5000/api/products/${editingId}`, {
            withCredentials: true,
          });
          setProducts(products.map((p) => (p._id === editingId ? updatedProduct.data : p)));
          toast.success("Product with image updated!");
        } else {
          // No image, use original response data
          setProducts(products.map((p) => (p._id === editingId ? res.data : p)));
          toast.success("Product updated successfully!");
        }
        
      } else {
        // Create the product first
        res = await axios.post("http://localhost:5000/api/products/", productData, {
          withCredentials: true,
        });
        
        // Upload image if selected (before adding to state)
        if (selectedImage) {
          await uploadImage(res.data._id);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await axios.get(`http://localhost:5000/api/products/${res.data._id}`, {
            withCredentials: true,
          });
          setProducts([...products, updatedProduct.data]);
          toast.success("Product with image created!");
        } else {
          // No image, use original response data
          setProducts([...products, res.data]);
          toast.success("Product created successfully!");
        }
      }
      
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedImage(null);
      
    } catch (err: any) {
      console.error("Failed to save product:", err);
      toast.error(err.response?.data?.error || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    // Restore your original deletion logic:
     confirmAlert({
       title: "Confirm Deletion",
       message: "Are you sure you want to delete this product?",
       buttons: [
         {
           label: "Yes",
           onClick: async () => {
             try {
               await axios.delete(`http://localhost:5000/api/products/${id}`, {
                 withCredentials: true,
               });
               setProducts((prev) => prev.filter((p) => p._id !== id));
               toast.success("Product deleted successfully.");
             } catch (err: any) {
               console.error("Failed to delete product:", err);
               toast.error(err.response?.data?.error || "Failed to delete product.");
             }
           },
         },
         {
           label: "No",
           onClick: () => {
             toast.info("Deletion cancelled.");
           },
         },
       ],
     });
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2 className="section-heading">Your Products</h2>
      
      <div className="cards-grid-small">
        {products.map((product) => (
          <ExpandCard
            key={product._id}
            product={product}
            onDelete={handleDelete}
            onFieldUpdate={handleFieldUpdate}
          />
        ))}
        
        {/* Add Product Card as the last item in the grid */}
        <AddProductCard
          form={form}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          onImageChange={handleImageChange}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          isSubmitting={isSubmitting}
          uploadingImage={uploadingImage}
          fileInputRef={fileInputRef}
          editingId={editingId}
          onCancel={resetForm}
        />
      </div>
      
      {products.length === 0 && (
        <p className="no-products" style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No products yet. Use the card above to create your first product!
        </p>
      )}
    </div>
  );

};

export default ProductManagement;
