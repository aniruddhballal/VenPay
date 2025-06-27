import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { StyledButton } from './StyledButton';
import { actionButtonStyles } from '../styles/expandCardStyles';

interface EditControlsProps {
  onSave: () => void;
  onCancel: () => void;
  showHint?: boolean;
  hintText?: string;
  characterCount?: string;
  maxLength?: number;
  currentLength?: number;
  showControls?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  saveTooltip?: string;
  cancelTooltip?: string;
}

export const EditControls: React.FC<EditControlsProps> = ({
  onSave,
  onCancel,
  showHint = true,
  hintText = "Enter to save • Esc to cancel",
  characterCount,
  maxLength,
  currentLength,
  showControls = true,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  saveTooltip = "Save changes (Enter)",
  cancelTooltip = "Cancel editing (Esc)"
}) => {
  return (
    <>
      {/* Meta Bar with character count and hint */}
      {showHint && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 1, 
          mb: 1 
        }}>
          {(characterCount || (maxLength && currentLength !== undefined)) && (
            <Typography variant="caption" color="text.secondary">
              {characterCount || `${currentLength}/${maxLength} characters`}
            </Typography>
          )}
          <Chip
            label={hintText}
            size="small"
            variant="filled"
            sx={{
              flex: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: 'text.secondary',
              fontSize: '0.65rem',
              height: 20,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      )}

      {/* Action Buttons */}
      {showControls && (
        <Box sx={{ display: 'flex', gap: 2, mt: showHint ? 0 : 1 }}>
          <Tooltip title={saveTooltip} arrow>
            <StyledButton
              variant="original"
              onClick={onSave}
              startIcon={<Check />}
              sx={actionButtonStyles.saveButton}
            >
              {saveLabel}
            </StyledButton>
          </Tooltip>

          <Tooltip title={cancelTooltip} arrow>
            <StyledButton
              variant="original"
              onClick={onCancel}
              startIcon={<Close />}
              sx={actionButtonStyles.cancelButton}
            >
              {cancelLabel}
            </StyledButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
};