import React from "react";
import { Box, Typography, Grow, Tooltip, IconButton, Avatar, CircularProgress } from '@mui/material';
import { Check, Close, CameraAlt, AddPhotoAlternate, Save } from '@mui/icons-material';

import { StyledButton } from "../Buttons/StyledButton";
import { InlineEditField } from "./InlineEdit/InlineEditField";

import {
  imageStyles,
  nameStyles,
  priceStyles,
  descriptionStyles,
  actionButtonStyles
} from '../../styles/updateProductStyles';

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

interface CreateProductForm {
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface CreateProductProps {
  form: CreateProductForm;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  previewUrl: string;
  isSubmitting: boolean;
  uploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  editingId: string | null;
  onCancel: () => void;
}

export const CreateProduct: React.FC<CreateProductProps> = ({
  form,
  onFormChange,
  onSubmit,
  onImageChange,
  selectedImage,
  previewUrl,
  isSubmitting,
  uploadingImage,
  fileInputRef,
  onCancel
}) => {
  // Edit states
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [isEditingPrice, setIsEditingPrice] = React.useState(false);
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [isEditingImage, setIsEditingImage] = React.useState(false);
  
  // UI states
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Refs
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);

  // Validation
  const isFormValid = () => {
    const priceNum = parseFloat(form.price);
    return form.name.trim().length > 0 && !isNaN(priceNum) && priceNum > 0 && form.description.trim().length > 0;
  };

  // Image handlers
  const handleImageClick = () => {
    if (isEditingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageSave = () => {
    setIsEditingImage(false);
  };

  const handleImageCancel = () => {
    setIsEditingImage(false);
    // Create a synthetic event for form change
    const syntheticEvent = {
      target: { name: 'image', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onFormChange(syntheticEvent);
  };

  // React to image selection
  React.useEffect(() => {
    if (selectedImage && previewUrl) {
      setIsEditingImage(true);
    }
  }, [selectedImage, previewUrl]);

  // Field handlers
  const handleNameClick = () => setIsEditingName(true);
  const handleNameSave = () => setIsEditingName(false);
  const handleNameCancel = () => {
    // Create a synthetic event for form change
    const syntheticEvent = {
      target: { name: 'name', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onFormChange(syntheticEvent);
    setIsEditingName(false);
  };
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') handleNameCancel();
  };

  const handlePriceClick = () => setIsEditingPrice(true);
  const handlePriceSave = () => setIsEditingPrice(false);
  const handlePriceCancel = () => {
    // Create a synthetic event for form change
    const syntheticEvent = {
      target: { name: 'price', value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onFormChange(syntheticEvent);
    setIsEditingPrice(false);
  };
  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePriceSave();
    if (e.key === 'Escape') handlePriceCancel();
  };

  const handleDescriptionClick = () => setIsEditingDescription(true);
  const handleDescriptionSave = () => setIsEditingDescription(false);
  const handleDescriptionCancel = () => {
    // Create a synthetic event for form change
    const syntheticEvent = {
      target: { name: 'description', value: '' }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onFormChange(syntheticEvent);
    setIsEditingDescription(false);
  };
  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) handleDescriptionSave();
    if (e.key === 'Escape') handleDescriptionCancel();
  };

  const saveAllEdits = () => {
    if (isEditingName) handleNameSave();
    if (isEditingPrice) handlePriceSave();
    if (isEditingDescription) handleDescriptionSave();
  };

  const getCardStyles = () => ({
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
      : '0 8px 16px rgba(0, 0, 0, 0.1)',
    border: '2px dashed #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#fafafa'
  });

  return (
    <div 
      className="expand-card-compact"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        saveAllEdits();
      }} 
      style={{
        ...getCardStyles(),
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Image Section */}
      <Box 
        className="image-section" 
        sx={imageStyles.section}
        onClick={handleImageClick}
      >
        {/* Background Image or Upload Placeholder */}
        <Box sx={imageStyles.backgroundOrPlaceholder(form.image || previewUrl)}>
          {/* Upload placeholder content */}
          {!form.image && !previewUrl && (
            <>
              <Avatar className="upload-icon" sx={imageStyles.uploadAvatar}>
                <AddPhotoAlternate sx={{ fontSize: 32 }} />
              </Avatar>

              <Typography
                variant="caption"
                sx={imageStyles.uploadCaption}
              >
                Click to upload • JPG, PNG, or GIF
              </Typography>
            </>
          )}
        </Box>

        <Box className="edit-overlay" 
        sx={{
          ...imageStyles.editOverlay,
          ...({
            backgroundColor: 'rgb(0, 0, 0) !important'
          })
        }}
        >
          <Avatar sx={imageStyles.editOverlayAvatar}>
            <CameraAlt sx={{ fontSize: 24 }} />
          </Avatar>
          <Typography variant="caption" sx={imageStyles.editOverlayText}>
            Click to add image
          </Typography>
        </Box>

        <Grow in={isEditingImage} timeout={300}>
          <Box sx={imageStyles.editingOverlay(previewUrl)}>
            <Box sx={imageStyles.editingOverlayInner}>
              <Tooltip title="Save image" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageSave();
                  }}
                  disabled={uploadingImage}
                  size="large"
                  sx={imageStyles.saveButton}
                >
                  {uploadingImage ? (
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
                    handleImageCancel();
                  }}
                  disabled={uploadingImage}
                  size="large"
                  sx={imageStyles.cancelButton}
                >
                  <Close sx={{ fontSize: 24 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grow>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={onImageChange}
          style={{ display: 'none' }}
        />
      </Box>
      
      <div className="content">
        <div className="basic-info" style={nameStyles.container}>
          {/* Name Field */}
          <InlineEditField
            value={form.name}
            editedValue={form.name}
            isEditing={isEditingName}
            isHovered={isHovered}
            onEdit={handleNameClick}
            onSave={handleNameSave}
            onCancel={handleNameCancel}
            onValueChange={(value) => {
              const syntheticEvent = {
                target: { name: 'name', value }
              } as React.ChangeEvent<HTMLInputElement>;
              onFormChange(syntheticEvent);
            }}
            onKeyDown={handleNameKeyPress}
            inputType="text"
            placeholder="Enter product name..."
            maxLength={MAX_NAME_LENGTH}
            displayComponent={
              <Typography variant="h6" className="name-text" sx={{
                ...nameStyles.displayText,
                color: form.name ? 'inherit' : '#999',
                fontStyle: form.name ? 'normal' : 'italic'
              }}>
                {form.name || "Click to add product name"}
              </Typography>
            }
            editLabel="Click to add name"
            containerSx={nameStyles.section}
            inputSx={nameStyles.textField}
            displaySx={nameStyles.displayPaper}
          />
          
          {/* Price Field */}
          <InlineEditField
            value={form.price}
            editedValue={form.price}
            isEditing={isEditingPrice}
            isHovered={isHovered}
            onEdit={handlePriceClick}
            onSave={handlePriceSave}
            onCancel={handlePriceCancel}
            onValueChange={(value) => {
              const syntheticEvent = {
                target: { name: 'price', value }
              } as React.ChangeEvent<HTMLInputElement>;
              onFormChange(syntheticEvent);
            }}
            onKeyDown={handlePriceKeyPress}
            inputType="number"
            placeholder="Enter product price..."
            step="1"
            min="0"
            displayComponent={
              <Typography variant="h6" className="price-text" sx={{
                ...priceStyles.displayText,
                color: form.price ? 'inherit' : '#999',
                fontStyle: form.price ? 'normal' : 'italic'
              }}>
                {form.price ? `₹${parseFloat(form.price).toFixed(2)}` : "Click to add price"}
              </Typography>
            }
            editLabel="Click to add price"
            hintText="Enter to save • Esc to cancel"
            containerSx={priceStyles.wrapper}
            inputSx={priceStyles.textField}
            displaySx={priceStyles.displayPaper}
          />
        </div>

        {/* Description Field */}
        <Box
          className="details"
          sx={descriptionStyles.container(isEditingDescription, isHovered)}
        >
          <InlineEditField
            value={form.description}
            editedValue={form.description}
            isEditing={isEditingDescription}
            isHovered={isHovered}
            onEdit={handleDescriptionClick}
            onSave={handleDescriptionSave}
            onCancel={handleDescriptionCancel}
            onValueChange={(value) => {
              const syntheticEvent = {
                target: { name: 'description', value }
              } as React.ChangeEvent<HTMLTextAreaElement>;
              onFormChange(syntheticEvent);
            }}
            onKeyDown={handleDescriptionKeyPress}
            inputType="textarea"
            placeholder="Enter product description..."
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
            displayComponent={
              <Typography
                variant="body1"
                className="desc-text"
                sx={{
                  ...descriptionStyles.typography(isHovered),
                  color: form.description ? 'inherit' : '#999',
                  fontStyle: form.description ? 'normal' : 'italic'
                }}
              >
                {form.description || "Click to add product description"}
              </Typography>
            }
            editLabel="Click to add description"
            inputRef={descriptionInputRef}
            inputSx={descriptionStyles.input}
            displaySx={descriptionStyles.previewPaper(isHovered)}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={actionButtonStyles.container}>
          <StyledButton
            variant="original"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => onSubmit(e)}
            disabled={!isFormValid() || isSubmitting}
            sx={{ 
              fontSize: '0.875rem',
              display: 'flex',
              paddingx: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              opacity: (isFormValid() && !isSubmitting) ? 1 : 0.6,
            }}
          >
            <Save sx={{ fontSize: 16, marginRight: 1 }} />
            {isSubmitting ? 'Creating...' : 'Create'}
          </StyledButton>
          <StyledButton
            variant="danger"
            onClick={onCancel}
            disabled={isSubmitting}
            sx={{ fontSize: '0.875rem' }}
          >
            Cancel
          </StyledButton>
        </Box>
      </div>
    </div>
  );
};