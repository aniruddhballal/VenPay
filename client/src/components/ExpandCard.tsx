// components/ExpandCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Paper, Fade, Grow, Chip, Tooltip, alpha,
  IconButton, Avatar, CircularProgress } from '@mui/material';
import { Check, Close, Edit, CameraAlt, AddPhotoAlternate } from '@mui/icons-material';

import { StyledButton } from "./StyledButton";
import { useProductEditor, useNameEditor, usePriceEditor, useDescriptionEditor,
  useImageEditor, useCardInteractions } from '../hooks/useEditor';

import { imageSectionSx, backgroundImageOrPlaceholderSx, uploadAvatarSx, uploadTextSx, uploadCaptionSx,
  editOverlayTextSx, editOverlayAvatarSx, editOverlaySx, imageEditingOverlaySx, imageEditingOverlayInnerSx,
   saveButtonSx, cancelButtonSx, nameMetaChipSx, nameMetaBarSx, nameTextFieldSx, nameSectionSx, basicInfoContainerStyle,
   nameEditorActionsRowSx, nameSaveButtonSx, nameCancelButtonSx, editIndicatorTextSx, editIndicatorIconSx,
   editIndicatorBoxSx, nameDisplayTextSx, nameDisplayPaperSx, priceEditorWrapperSx, priceTextFieldSx, priceMetaBarSx,
   priceMetaTextSx, priceMetaChipSx, priceActionRowSx, priceSaveButtonSx, priceCancelButtonSx, priceDisplayPaperSx,
   priceTextSx, priceEditIndicatorSx, priceEditIconSx, priceEditTextSx, detailsContainerSx, descriptionInputSx,
   descriptionControlBarSx, controlChipSx, saveDescriptionButtonSx, cancelDescriptionButtonSx, 
   descriptionPreviewPaperSx, descriptionTypographySx, descriptionEditIndicatorSx, descriptionEditIconSx,
   descriptionEditLabelSx, actionButtonsContainerSx
} from '../styles/expandCardStyles';

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
        sx={imageSectionSx}
        onClick={imageEditor.handleImageClick}
      >
        {/* Background Image or Upload Placeholder */}
          <Box sx={backgroundImageOrPlaceholderSx(product.image)}>
            {/* Upload placeholder content */}
            {!product.image && (
              <>
                <Avatar className="upload-icon" sx={uploadAvatarSx}>
                  <AddPhotoAlternate sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                  className="upload-text"
                  variant="h6"
                  sx={uploadTextSx}
                >
                  Add Product Image
                </Typography>

              <Typography
                variant="caption"
                sx={uploadCaptionSx}
              >
                Click to upload • JPG, PNG, or GIF
              </Typography>
            </>
          )}
        </Box>

        <Box className="edit-overlay" sx={editOverlaySx}>
          <Avatar sx={editOverlayAvatarSx}>
            <CameraAlt sx={{ fontSize: 24 }} />
          </Avatar>
          <Typography variant="caption" sx={editOverlayTextSx}>
            Click to change image
          </Typography>
        </Box>

        <Grow in={editorState.isEditingImage} timeout={300}>
          <Box sx={imageEditingOverlaySx(editorState.previewUrl)}>
            <Box sx={imageEditingOverlayInnerSx}>
              <Tooltip title="Save image" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    imageEditor.handleImageSave();
                  }}
                  disabled={editorState.uploadingImage}
                  size="large"
                  sx={saveButtonSx}
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
                  sx={cancelButtonSx}
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
        <div
          className="basic-info"
          style={basicInfoContainerStyle}
        >
          <Box
            className="name-section"
            sx={nameSectionSx}
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
                    sx={nameTextFieldSx}
                  />

                  <Box sx={nameMetaBarSx}>
                    <Typography variant="caption" color="text.secondary">
                      {editorState.editedName.length}/{MAX_NAME_LENGTH} characters
                    </Typography>
                    <Chip
                      label="Enter to save • Esc to cancel"
                      size="small"
                      variant="filled"
                      sx={nameMetaChipSx}
                    />
                  </Box>

                  <Box sx={nameEditorActionsRowSx}>
                    <Tooltip title="Save changes (Enter)" arrow>
                      <StyledButton
                        variant="original"
                        onClick={nameEditor.handleNameSave}
                        startIcon={<Check />}
                        sx={nameSaveButtonSx}
                      >
                        Save
                      </StyledButton>
                    </Tooltip>

                    <Tooltip title="Cancel editing (Esc)" arrow>
                      <StyledButton
                        variant="original"
                        onClick={nameEditor.handleNameCancel}
                        startIcon={<Close />}
                        sx={nameCancelButtonSx}
                      >
                        Cancel
                      </StyledButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grow>
            ) : (
              <Fade in={!editorState.isEditingName} timeout={200}>
                <Paper onClick={nameEditor.handleNameClick} elevation={0} sx={nameDisplayPaperSx}>
                  <Typography variant="h6" className="name-text" sx={nameDisplayTextSx}>
                    {product.name}
                  </Typography>
                  <Box className="edit-indicator" sx={editIndicatorBoxSx}>
                    <Edit sx={editIndicatorIconSx} />
                    <Typography variant="caption" sx={editIndicatorTextSx}>
                      Click to edit name
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Box>
          
          {editorState.isEditingPrice ? (
            <Grow in={editorState.isEditingPrice} timeout={300}>
              <Box sx={priceEditorWrapperSx}>
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{ step: '1', min: '0' }}
                  value={editorState.editedPrice}
                  onChange={(e) => editorState.setEditedPrice(e.target.value)}
                  onKeyDown={priceEditor.handlePriceKeyPress}
                  autoFocus
                  variant="outlined"
                  placeholder="Enter product price..."
                  sx={priceTextFieldSx}
                />

                <Box sx={priceMetaBarSx}>
                  <Typography variant="caption" color="text.secondary" sx={priceMetaTextSx}>
                    Price in ₹ (minimum: 0)
                  </Typography>
                  <Chip
                    label="Enter to save • Esc to cancel"
                    size="small"
                    variant="filled"
                    sx={priceMetaChipSx}
                  />
                </Box>

                <Box sx={priceActionRowSx}>
                  <Tooltip title="Save changes (Enter)" arrow>
                    <StyledButton
                      variant="original"
                      onClick={priceEditor.handlePriceSave}
                      startIcon={<Check />}
                      sx={priceSaveButtonSx}
                    >
                      Save
                    </StyledButton>
                  </Tooltip>

                  <Tooltip title="Cancel editing (Esc)" arrow>
                    <StyledButton
                      variant="original"
                      onClick={priceEditor.handlePriceCancel}
                      startIcon={<Close />}
                      sx={priceCancelButtonSx}
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
                sx={priceDisplayPaperSx}
              >
                <Typography variant="h6" className="price-text" sx={priceTextSx}>
                  ₹{product.price.toFixed(2)}
                </Typography>

                <Box className="edit-indicator" sx={priceEditIndicatorSx}>
                  <Edit sx={priceEditIconSx} />
                  <Typography variant="caption" sx={priceEditTextSx}>
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
          sx={detailsContainerSx(editorState.isEditingDescription, cardInteractions.isHovered)}
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
                  inputProps={{ maxLength: MAX_DESCRIPTION_LENGTH }}
                  sx={descriptionInputSx}
                />

                {cardInteractions.isHovered && (
                  <>
                    <Box sx={descriptionControlBarSx(cardInteractions.isHovered)}>
                      <Typography variant="caption" color="text.secondary">
                        {editorState.editedDescription.length}/{MAX_DESCRIPTION_LENGTH} characters
                      </Typography>
                      <Chip
                        label="Enter to save • Esc to cancel"
                        size="small"
                        variant="filled"
                        sx={controlChipSx}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mt: 0 }}>
                      <Tooltip title="Save changes (Enter)" arrow>
                        <StyledButton
                          variant="original"
                          onClick={descriptionEditor.handleDescriptionSave}
                          startIcon={<Check />}
                          sx={saveDescriptionButtonSx}
                        >
                          Save
                        </StyledButton>
                      </Tooltip>

                      <Tooltip title="Cancel editing (Esc)" arrow>
                        <StyledButton
                          variant="original"
                          onClick={descriptionEditor.handleDescriptionCancel}
                          startIcon={<Close />}
                          sx={cancelDescriptionButtonSx}
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
                sx={descriptionPreviewPaperSx(cardInteractions.isHovered)}
              >
                <Typography
                  variant="body1"
                  className="desc-text"
                  sx={descriptionTypographySx(cardInteractions.isHovered)}
                >
                  {product.description}
                </Typography>

                <Box className="edit-indicator" sx={descriptionEditIndicatorSx}>
                  <Edit sx={descriptionEditIconSx} />
                  <Typography variant="caption" sx={descriptionEditLabelSx}>
                    Click to edit description
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>
        <div style={actionButtonsContainerSx}>
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
        </div>
      </div>
    </div>
  );
};