import React from 'react';
import { Box, Typography, Paper, Fade } from '@mui/material';
import { Edit } from '@mui/icons-material';

interface EditableDisplayProps {
  children: React.ReactNode;
  onClick: () => void;
  editLabel: string;
  hovered?: boolean;
  isVisible?: boolean;
  sx?: any;
  elevation?: number;
  className?: string;
}

export const EditableDisplay: React.FC<EditableDisplayProps> = ({
  children,
  onClick,
  editLabel,
  isVisible = true,
  sx = {},
  elevation = 0,
  className
}) => {
  const paperStyles = {
    cursor: 'pointer',
    position: 'relative',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
    // border: '2px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    //   border: '2px solid rgba(25, 118, 210, 0.2)',
      '& .edit-indicator': {
        opacity: 1,
      },
    },
    ...sx
  };

  const editIndicatorStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    opacity: 0,
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderRadius: 'inherit',
    border: '2px dashed rgba(25, 118, 210, 0.3)',
    backdropFilter: 'blur(1px)',
  };

  const editIconStyles = {
    fontSize: 20,
    color: 'primary.main',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
  };

  const editTextStyles = {
    color: 'primary.main',
    fontSize: '0.8rem',
    fontWeight: 600,
    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
  };

  return (
    <Fade in={isVisible} timeout={200}>
      <Paper 
        onClick={onClick} 
        elevation={elevation} 
        sx={paperStyles}
        className={className}
      >
        {children}
        
        <Box className="edit-indicator" sx={editIndicatorStyles}>
          <Edit sx={editIconStyles} />
          <Typography variant="caption" sx={editTextStyles}>
            {editLabel}
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};