import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton,
  GlobalStyles 
} from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';
import { deleteConfirmationModalStyles } from '../../styles/deleteConfirmationModalStyles';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
  subtitle?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onCancel,
  isDeleting = false,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this product?",
  subtitle = "This action cannot be undone."
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    } else {
      // Restore body scroll when modal is closed
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      <GlobalStyles styles={deleteConfirmationModalStyles.globalStyles} />
      <Box sx={deleteConfirmationModalStyles.modalOverlay} onClick={handleBackdropClick}>
        <Paper sx={deleteConfirmationModalStyles.modalContainer}>
          {/* Modal Header */}
          <Box sx={deleteConfirmationModalStyles.modalHeader}>
            <Box />
            <IconButton onClick={handleCancel} sx={deleteConfirmationModalStyles.modalCloseBtn}>
              <X size={20} />
            </IconButton>
          </Box>
         
          {/* Modal Content */}
          <Box sx={deleteConfirmationModalStyles.modalContent}>
            {/* Warning Icon */}
            <Box sx={deleteConfirmationModalStyles.warningIconContainer}>
              <Box sx={deleteConfirmationModalStyles.warningIconWrapper}>
                <Box sx={deleteConfirmationModalStyles.warningIcon}>
                  <AlertTriangle size={32} />
                </Box>
              </Box>
            </Box>
            
            {/* Title */}
            <Typography component="h2" sx={deleteConfirmationModalStyles.modalTitle}>
              {title}
            </Typography>
            
            {/* Message */}
            <Box sx={deleteConfirmationModalStyles.messageContainer}>
              <Typography sx={deleteConfirmationModalStyles.message}>
                {message}
              </Typography>
              <Typography sx={deleteConfirmationModalStyles.subtitle}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
         
          {/* Modal Actions */}
          <Box sx={deleteConfirmationModalStyles.modalActions}>
            <Button 
              onClick={handleCancel} 
              sx={deleteConfirmationModalStyles.cancelBtn}
              disabled={isDeleting}
              variant="outlined"
            >
              No
            </Button>
            <Button
              onClick={onConfirm}
              sx={deleteConfirmationModalStyles.confirmBtn}
              disabled={isDeleting}
              variant="contained"
            >
              {isDeleting ? (
                <>
                  <Box sx={deleteConfirmationModalStyles.loadingSpinner} />
                  Deleting...
                </>
              ) : (
                'Yes'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );

  // Render the modal at the document body level using a portal
  return createPortal(modalContent, document.body);
};

export default DeleteConfirmationModal;