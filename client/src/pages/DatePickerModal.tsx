import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  IconButton,
  GlobalStyles 
} from '@mui/material';
import { Calendar, X, Check } from 'lucide-react';
import { datePickerModalStyles } from '../styles/datePickerModalStyles';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  title: string;
}

function DatePickerModal({ isOpen, onClose, onConfirm, title }: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Set minimum date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = tomorrow.toISOString().split('T')[0];
      setSelectedDate(minDate);
      setError("");
      
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
   
    const selectedDateObj = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
   
    if (selectedDateObj <= now) {
      setError("Please select a future date");
    } else {
      setError("");
    }
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }
   
    const selectedDateObj = new Date(selectedDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
   
    if (selectedDateObj <= now) {
      setError("Please select a future date");
      return;
    }
   
    onConfirm(selectedDate);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close modal when clicking the overlay (but not the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const modalContent = (
    <>
      <GlobalStyles styles={datePickerModalStyles.globalStyles} />
      <Box sx={datePickerModalStyles.modalOverlay} onClick={handleOverlayClick}>
        <Paper sx={datePickerModalStyles.modalContainer}>
          {/* Modal Header */}
          <Box sx={datePickerModalStyles.modalHeader}>
            <Box sx={datePickerModalStyles.modalTitleContainer}>
              <Box 
                component={Calendar} 
                sx={datePickerModalStyles.modalIcon}
              />
              <Typography sx={datePickerModalStyles.modalTitle}>
                {title}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={datePickerModalStyles.modalCloseBtn}>
              <X size={20} />
            </IconButton>
          </Box>
         
          {/* Modal Content */}
          <Box sx={datePickerModalStyles.modalContent}>
            <Box sx={datePickerModalStyles.dateInputContainer}>
              <Typography 
                component="label" 
                htmlFor="payment-deadline" 
                sx={datePickerModalStyles.dateLabel}
              >
                Payment Deadline
              </Typography>
              <TextField
                id="payment-deadline"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                inputProps={{
                  min: minDate,
                  max: maxDate,
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    '& fieldset': {
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fefefe',
                      '& fieldset': {
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                    },
                    '&.Mui-error': {
                      '& fieldset': {
                        borderColor: '#ef4444',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#ef4444',
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#1f2937',
                    '&::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                    },
                  },
                }}
                variant="outlined"
                fullWidth={false}
                error={!!error}
              />
              {error && (
                <Typography sx={datePickerModalStyles.errorMessage}>
                  {error}
                </Typography>
              )}
            </Box>
           
            {selectedDate && !error && (
              <Box sx={datePickerModalStyles.datePreview}>
                <Typography sx={datePickerModalStyles.previewLabel}>
                  Selected deadline:
                </Typography>
                <Typography sx={datePickerModalStyles.previewDate}>
                  {new Date(selectedDate + 'T23:59:59').toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            )}
          </Box>
         
          {/* Modal Actions */}
          <Box sx={datePickerModalStyles.modalActions}>
            <Button 
              onClick={onClose} 
              sx={datePickerModalStyles.cancelBtn}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              sx={datePickerModalStyles.btnConfirm}
              disabled={!selectedDate || !!error}
              variant="contained"
              startIcon={<Check size={16} />}
            >
              Set Deadline
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );

  // Render the modal at the document body level using a portal
  return createPortal(modalContent, document.body);
}

export default DatePickerModal;
