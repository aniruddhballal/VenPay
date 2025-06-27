import React from "react";
import { Box, Typography, Avatar } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';

// Import the same styles used in ExpandCard
import {
  imageStyles,
  nameStyles,
  priceStyles,
  descriptionStyles,
  actionButtonStyles
} from '../styles/expandCardStyles';

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

// Add Product Card Component
export const AddProductCard = ({ 
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
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Create card styles similar to ExpandCard but with add-product styling
  const cardStyles: React.CSSProperties = {
    border: '2px dashed #007bff',
    backgroundColor: '#f8f9ff',
    borderRadius: '12px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 123, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  };

  return (
    <div className="expand-card-compact add-product-card" style={cardStyles}>
      <form onSubmit={onSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Image Section - Styled exactly like ExpandCard */}
        <Box 
          className="image-section" 
          sx={imageStyles.section}
          onClick={handleImageClick}
        >
          {/* Background Image or Upload Placeholder */}
          <Box sx={imageStyles.backgroundOrPlaceholder(previewUrl)}>
            {/* Upload placeholder content */}
            {!previewUrl && (
              <>
                <Avatar className="upload-icon" sx={imageStyles.uploadAvatar}>
                  <AddPhotoAlternate sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                  className="upload-text"
                  variant="h6"
                  sx={imageStyles.uploadText}
                >
                  Add Product Image
                </Typography>
                <Typography
                  variant="caption"
                  sx={imageStyles.uploadCaption}
                >
                  {selectedImage ? selectedImage.name : 'Click to upload • JPG, PNG, or GIF'}
                </Typography>
              </>
            )}
          </Box>

          {/* Edit overlay for when image is selected */}
          {previewUrl && (
            <Box className="edit-overlay" sx={imageStyles.editOverlay}>
              <Avatar sx={imageStyles.editOverlayAvatar}>
                <AddPhotoAlternate sx={{ fontSize: 24 }} />
              </Avatar>
              <Typography variant="caption" sx={imageStyles.editOverlayText}>
                Click to change image
              </Typography>
            </Box>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            disabled={isSubmitting}
          />
        </Box>
        
        <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Basic Info Section - Name and Price */}
          <div className="basic-info" style={nameStyles.container}>
            {/* Name Field */}
            <Box sx={nameStyles.section}>
              <Box sx={{
                ...nameStyles.displayPaper,
                padding: '12px 16px',
                marginBottom: '8px'
              }}>
                <input
                  name="name"
                  placeholder="Enter product name..."
                  value={form.name}
                  onChange={onFormChange}
                  required
                  disabled={isSubmitting}
                  maxLength={MAX_NAME_LENGTH}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: form.name ? '#1f2937' : '#9ca3af',
                    textAlign: 'center'
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: form.name.length > MAX_NAME_LENGTH * 0.9 ? '#dc2626' : '#9ca3af',
                  display: 'block',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              >
                {form.name.length}/{MAX_NAME_LENGTH} characters
              </Typography>
            </Box>
            
            {/* Price Field */}
            <Box sx={priceStyles.wrapper}>
              <Box sx={{
                ...priceStyles.displayPaper,
                padding: '12px 16px',
                marginBottom: '8px'
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                    marginBottom: '4px',
                    textAlign: 'center'
                  }}
                >
                  Price (₹)
                </Typography>
                <input
                  name="price"
                  placeholder="0"
                  type="number"
                  step="1"
                  min="0"
                  value={form.price}
                  onChange={onFormChange}
                  required
                  disabled={isSubmitting}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    color: form.price ? '#2563eb' : '#9ca3af',
                    textAlign: 'center'
                  }}
                />
              </Box>
            </Box>
          </div>
          
          {/* Description Section */}
          <Box
            className="details"
            sx={descriptionStyles.container(true, true)} // Always show as editing/hovered state
          >
            <Box sx={{
              ...descriptionStyles.previewPaper(true),
              padding: '16px',
              marginBottom: '8px',
              minHeight: '120px'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                  marginBottom: '8px',
                  textAlign: 'left'
                }}
              >
                Description
              </Typography>
              <textarea
                name="description"
                placeholder="Enter product description..."
                value={form.description}
                onChange={onFormChange}
                required
                disabled={isSubmitting}
                rows={3}
                maxLength={MAX_DESCRIPTION_LENGTH}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontFamily: 'inherit',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: form.description ? '#1f2937' : '#9ca3af',
                  resize: 'none',
                  minHeight: '60px'
                }}
              />
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem', 
                color: form.description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? '#dc2626' : '#9ca3af',
                textAlign: 'right',
                display: 'block'
              }}
            >
              {form.description.length}/{MAX_DESCRIPTION_LENGTH} characters
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{
            ...actionButtonStyles.container,
            marginTop: 'auto',
            paddingTop: '16px'
          }}>
            <Box
              component="button"
              type="submit" 
              disabled={isSubmitting || uploadingImage}
              sx={{
                ...actionButtonStyles.saveButton,
                cursor: isSubmitting || uploadingImage ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || uploadingImage ? 0.6 : 1,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              {isSubmitting ? (
                <>
                  <span>⏳</span>
                  <span>{editingId ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>{editingId ? '💾' : '➕'}</span>
                  <span>{editingId ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </Box>
            
            {editingId && (
              <Box
                component="button"
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                sx={{
                  ...actionButtonStyles.cancelButton,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <span>✕</span>
                <span>Cancel</span>
              </Box>
            )}
          </Box>
        </div>
      </form>
    </div>
  );
};