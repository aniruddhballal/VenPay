import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CreateProductProps {
  onCreate: (productData: CreateProductData) => void;
  onCancel?: () => void;
}

export const CreateProduct: React.FC<CreateProductProps> = ({
  onCreate,
  onCancel
}) => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  
  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  
  // UI states
  const [isHovered, setIsHovered] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const fileSelectedRef = useRef(false);

  // Validation
  const isFormValid = () => {
    const priceNum = parseFloat(price);
    return name.trim().length > 0 && !isNaN(priceNum) && priceNum > 0 && description.trim().length > 0;
  };

  // Image handlers
  const handleImageClick = () => {
    if (isEditingImage) return;
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsEditingImage(true);
      fileSelectedRef.current = true;
    }
  };

  const handleImageSave = async () => {
    if (selectedImage) {
      setUploadingImage(true);
      try {
        // Convert to base64 or handle file upload here
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImage(result);
          setIsEditingImage(false);
          setUploadingImage(false);
        };
        reader.readAsDataURL(selectedImage);
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadingImage(false);
      }
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    setIsEditingImage(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Field handlers
  const handleNameClick = () => setIsEditingName(true);
  const handleNameSave = () => setIsEditingName(false);
  const handleNameCancel = () => {
    setName("");
    setIsEditingName(false);
  };
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') handleNameCancel();
  };

  const handlePriceClick = () => setIsEditingPrice(true);
  const handlePriceSave = () => setIsEditingPrice(false);
  const handlePriceCancel = () => {
    setPrice("");
    setIsEditingPrice(false);
  };
  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePriceSave();
    if (e.key === 'Escape') handlePriceCancel();
  };

  const handleDescriptionClick = () => setIsEditingDescription(true);
  const handleDescriptionSave = () => setIsEditingDescription(false);
  const handleDescriptionCancel = () => {
    setDescription("");
    setIsEditingDescription(false);
  };
  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) handleDescriptionSave();
    if (e.key === 'Escape') handleDescriptionCancel();
  };

  // Main actions
  const handleCreate = () => {
    if (isFormValid()) {
      onCreate({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        image: image
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
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
      className="create-product-card"
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
        <Box sx={imageStyles.backgroundOrPlaceholder(image)}>
          {/* Upload placeholder content */}
          {!image && (
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
                Click to upload • JPG, PNG, or GIF
              </Typography>
            </>
          )}
        </Box>

        <Box className="edit-overlay" sx={imageStyles.editOverlay}>
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
          ref={imageInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Box>
      
      <div className="content">
        <div className="basic-info" style={nameStyles.container}>
          {/* Name Field */}
          <InlineEditField
            value={name}
            editedValue={name}
            isEditing={isEditingName}
            isHovered={isHovered}
            onEdit={handleNameClick}
            onSave={handleNameSave}
            onCancel={handleNameCancel}
            onValueChange={setName}
            onKeyDown={handleNameKeyPress}
            inputType="text"
            placeholder="Enter product name..."
            maxLength={MAX_NAME_LENGTH}
            displayComponent={
              <Typography variant="h6" className="name-text" sx={{
                ...nameStyles.displayText,
                color: name ? 'inherit' : '#999',
                fontStyle: name ? 'normal' : 'italic'
              }}>
                {name || "Click to add product name"}
              </Typography>
            }
            editLabel="Click to add name"
            containerSx={nameStyles.section}
            inputSx={nameStyles.textField}
            displaySx={nameStyles.displayPaper}
          />
          
          {/* Price Field */}
          <InlineEditField
            value={price}
            editedValue={price}
            isEditing={isEditingPrice}
            isHovered={isHovered}
            onEdit={handlePriceClick}
            onSave={handlePriceSave}
            onCancel={handlePriceCancel}
            onValueChange={setPrice}
            onKeyDown={handlePriceKeyPress}
            inputType="number"
            placeholder="Enter product price..."
            step="1"
            min="0"
            displayComponent={
              <Typography variant="h6" className="price-text" sx={{
                ...priceStyles.displayText,
                color: price ? 'inherit' : '#999',
                fontStyle: price ? 'normal' : 'italic'
              }}>
                {price ? `₹${parseFloat(price).toFixed(2)}` : "Click to add price"}
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
            value={description}
            editedValue={description}
            isEditing={isEditingDescription}
            isHovered={isHovered}
            onEdit={handleDescriptionClick}
            onSave={handleDescriptionSave}
            onCancel={handleDescriptionCancel}
            onValueChange={setDescription}
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
                  color: description ? 'inherit' : '#999',
                  fontStyle: description ? 'normal' : 'italic'
                }}
              >
                {description || "Click to add product description"}
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
            variant="primary"
            onClick={handleCreate}
            disabled={!isFormValid()}
            sx={{ 
              fontSize: '0.875rem',
              opacity: isFormValid() ? 1 : 0.6
            }}
          >
            <Save sx={{ fontSize: 16, marginRight: 1 }} />
            Create Product
          </StyledButton>
          <StyledButton
            variant="original"
            onClick={handleCancel}
            sx={{ fontSize: '0.875rem' }}
          >
            Cancel
          </StyledButton>
        </Box>
      </div>
    </div>
  );
};