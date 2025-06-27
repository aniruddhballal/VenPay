import { useState } from 'react';

export const useCardInteractions = (
  isEditingName: boolean,
  isEditingPrice: boolean,
  isEditingDescription: boolean,
  handleNameSave: () => Promise<void>,
  handlePriceSave: () => Promise<void>,
  handleDescriptionSave: () => Promise<void>,
  onDelete: (id: string) => void,
  navigate: (path: string) => void,
  productId: string
) => {
  const [isHovered, setIsHovered] = useState(false);

  const saveAllEdits = async () => {
    if (isEditingName) {
      await handleNameSave();
    }
    if (isEditingPrice) {
      await handlePriceSave();
    }
    if (isEditingDescription) {
      await handleDescriptionSave();
    }
  };

  const handleVisitProduct = () => {
    navigate(`/product/${productId}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(productId);
  };

  const getCardStyles = () => {
    if (isHovered) {
      return {
        height: 'auto',
        minHeight: '480px',
        maxHeight: 'none',
        transform: 'scale(1.02)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        zIndex: 10,
      };
    } else {
      return {
        height: 'auto',
        minHeight: '320px',
        maxHeight: '320px',
        transform: 'scale(1)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        zIndex: 1,
      };
    }
  };

  return {
    isHovered,
    setIsHovered,
    saveAllEdits,
    handleVisitProduct,
    handleDelete,
    getCardStyles,
  };
};