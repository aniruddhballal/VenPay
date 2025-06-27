import React from 'react';
import { Box, TextField, Grow } from '@mui/material';
import { EditableDisplay } from './EditableDisplay';
import { EditControls } from './EditControls';

type InputType = 'text' | 'number' | 'textarea';

interface InlineEditFieldProps {
  // Values
  value: string | number;
  editedValue: string;
  
  // State
  isEditing: boolean;
  isHovered?: boolean;
  
  // Handlers
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onValueChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  
  // Input Configuration
  inputType?: InputType;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  step?: string;
  min?: string;
  
  // Display Configuration
  displayComponent: React.ReactNode;
  editLabel: string;
  
  // Controls Configuration
  showControls?: boolean;
  showHint?: boolean;
  hintText?: string;
  
  // Styling
  containerSx?: any;
  inputSx?: any;
  displaySx?: any;
  
  // Refs
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const InlineEditField: React.FC<InlineEditFieldProps> = ({
  editedValue,
  isEditing,
  isHovered = false,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
  onKeyDown,
  inputType = 'text',
  placeholder = 'Enter value...',
  maxLength,
  rows = 1,
  step,
  min,
  displayComponent,
  editLabel,
  showControls = true,
  showHint = true,
  hintText = "Enter to save • Esc to cancel",
  containerSx = {},
  inputSx = {},
  displaySx = {},
  inputRef
}) => {
  // Input props based on type
  const getInputProps = () => {
    const baseProps = {
      fullWidth: true,
      value: editedValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        onValueChange(e.target.value),
      onKeyDown,
      autoFocus: true,
      variant: 'outlined' as const,
      placeholder,
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: 'background.paper',
          '&:hover': {
            '& > fieldset': {
              borderColor: 'primary.main',
            },
          },
          '&.Mui-focused': {
            '& > fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        },
        ...inputSx
      }
    };

    switch (inputType) {
      case 'number':
        return {
          ...baseProps,
          type: 'number',
          inputProps: { step, min, maxLength }
        };
      case 'textarea':
        return {
          ...baseProps,
          multiline: true,
          rows,
          inputProps: { maxLength },
          inputRef
        };
      default:
        return {
          ...baseProps,
          inputProps: { maxLength }
        };
    }
  };

  return (
    <Box sx={containerSx}>
      {isEditing ? (
        <Grow in={isEditing} timeout={300}>
          <Box>
            <TextField {...getInputProps()} />
            
            {(showControls || showHint) && (
              <EditControls
                onSave={onSave}
                onCancel={onCancel}
                showHint={showHint}
                hintText={hintText}
                currentLength={editedValue.length}
                maxLength={maxLength}
                showControls={showControls && isHovered}
                saveTooltip="Save changes (Enter)"
                cancelTooltip="Cancel editing (Esc)"
              />
            )}
          </Box>
        </Grow>
      ) : (
        <EditableDisplay
          onClick={onEdit}
          editLabel={editLabel}
          hovered={isHovered}
          isVisible={!isEditing}
          sx={displaySx}
        >
          {displayComponent}
        </EditableDisplay>
      )}
    </Box>
  );
};