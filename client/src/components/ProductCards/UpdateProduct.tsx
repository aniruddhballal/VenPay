import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grow, Tooltip, IconButton, Avatar, CircularProgress } from '@mui/material';
import { Check, Close, CameraAlt, AddPhotoAlternate } from '@mui/icons-material';

import { StyledButton } from "../Buttons/StyledButton";
import { InlineEditField } from "./InlineEdit/InlineEditField";
import { ProductEditorHooks } from '../../hooks';

import { useState, useEffect } from "react";

import {
  imageStyles,
  nameStyles,
  priceStyles,
  descriptionStyles,
  actionButtonStyles
} from '../../styles/updateProductStyles';

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface UpdateProductProps {
  product: Product;
  onDelete: (id: string) => void;
  onFieldUpdate: (id: string, field: string, value: string | number) => void;
}

export const UpdateProduct: React.FC<UpdateProductProps> = ({
  product,
  onDelete,
  onFieldUpdate
}) => {
  const navigate = useNavigate();

  const { useProductEditor, useNameEditor, usePriceEditor, useDescriptionEditor,
  useImageEditor, useCardInteractions } = ProductEditorHooks;

const [showCameraIcon, setShowCameraIcon] = useState(false);
const [spinKey, setSpinKey] = useState(0);





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
  // useEffect to detect hover-in
  useEffect(() => {
    if (cardInteractions.isHovered) {
      setSpinKey(prev => prev + 1);
      setShowCameraIcon(false);
      setTimeout(() => setShowCameraIcon(true), 400); // match spin duration
    } else {
      setShowCameraIcon(false);
    }
  }, [cardInteractions.isHovered]);
  
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
        sx={imageStyles.section}
        onClick={imageEditor.handleImageClick}
      >
        {/* Background Image or Upload Placeholder */}
        <Box sx={imageStyles.backgroundOrPlaceholder(product.image)}>
          {/* Upload placeholder content */}
          {!product.image && (
            <>
              <Avatar
                className="upload-icon"
                sx={imageStyles.uploadAvatar}
                onClick={imageEditor.handleImageClick}
              >
                {!showCameraIcon ? (
                  <AddPhotoAlternate
                    key={`spin-${spinKey}`}
                    sx={imageStyles.rotatingIcon}
                  />
                ) : (
                  <CameraAlt sx={imageStyles.fadeInIcon} />
                )}
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

        <Grow in={editorState.isEditingImage} timeout={300}>
          <Box sx={imageStyles.editingOverlay(editorState.previewUrl)}>
            <Box sx={imageStyles.editingOverlayInner}>
              <Tooltip title="Save image" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    imageEditor.handleImageSave();
                  }}
                  disabled={editorState.uploadingImage}
                  size="large"
                  sx={imageStyles.saveButton}
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
          ref={editorState.imageInputRef}
          accept="image/*"
          onChange={imageEditor.handleImageChange}
          style={{ display: 'none' }}
        />
      </Box>
      
      <div className="content">
        <div className="basic-info" style={nameStyles.container}>
          {/* Name Field */}
          <InlineEditField
            value={product.name}
            editedValue={editorState.editedName}
            isEditing={editorState.isEditingName}
            isHovered={cardInteractions.isHovered}
            onEdit={nameEditor.handleNameClick}
            onSave={nameEditor.handleNameSave}
            onCancel={nameEditor.handleNameCancel}
            onValueChange={editorState.setEditedName}
            onKeyDown={nameEditor.handleNameKeyPress}
            inputType="text"
            placeholder="Enter product name..."
            maxLength={MAX_NAME_LENGTH}
            displayComponent={
              <Typography variant="h6" className="name-text" sx={nameStyles.displayText}>
                {product.name}
              </Typography>
            }
            editLabel="Click to edit name"
            containerSx={nameStyles.section}
            inputSx={nameStyles.textField}
            displaySx={nameStyles.displayPaper}
          />
          
          {/* Price Field */}
          <InlineEditField
            value={product.price}
            editedValue={editorState.editedPrice}
            isEditing={editorState.isEditingPrice}
            isHovered={cardInteractions.isHovered}
            onEdit={priceEditor.handlePriceClick}
            onSave={priceEditor.handlePriceSave}
            onCancel={priceEditor.handlePriceCancel}
            onValueChange={editorState.setEditedPrice}
            onKeyDown={priceEditor.handlePriceKeyPress}
            inputType="number"
            placeholder="Enter product price..."
            step="1"
            min="0"
            displayComponent={
              <Typography variant="h6" className="price-text" sx={priceStyles.displayText}>
                ₹{product.price.toFixed(2)}
              </Typography>
            }
            editLabel="Click to edit price"
            hintText="Enter to save • Esc to cancel"
            containerSx={priceStyles.wrapper}
            inputSx={priceStyles.textField}
            displaySx={priceStyles.displayPaper}
          />
        </div>

        {/* Description Field */}
        <Box
          className="details"
          sx={descriptionStyles.container(editorState.isEditingDescription, cardInteractions.isHovered)}
        >
          <InlineEditField
            value={product.description}
            editedValue={editorState.editedDescription}
            isEditing={editorState.isEditingDescription}
            isHovered={cardInteractions.isHovered}
            onEdit={descriptionEditor.handleDescriptionClick}
            onSave={descriptionEditor.handleDescriptionSave}
            onCancel={descriptionEditor.handleDescriptionCancel}
            onValueChange={editorState.setEditedDescription}
            onKeyDown={descriptionEditor.handleDescriptionKeyPress}
            inputType="textarea"
            placeholder="Enter product description..."
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
            displayComponent={
              <Typography
                variant="body1"
                className="desc-text"
                sx={descriptionStyles.typography(cardInteractions.isHovered)}
              >
                {product.description}
              </Typography>
            }
            editLabel="Click to edit description"
            inputRef={editorState.descriptionInputRef}
            inputSx={descriptionStyles.input}
            displaySx={descriptionStyles.previewPaper(cardInteractions.isHovered)}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={actionButtonStyles.container}>
          <StyledButton
            variant="primary"
            onClick={cardInteractions.handleVisitProduct}
            sx={{ fontSize: '0.875rem' }}
          >
            Details
          </StyledButton>
          <StyledButton
            variant="danger"
            onClick={cardInteractions.handleDelete}
            sx={{ fontSize: '0.875rem' }}
          >
            🗑️ Delete
          </StyledButton>
        </Box>
      </div>
    </div>
  );
};