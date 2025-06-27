interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export const useDescriptionEditor = (
  product: Product,
  editedDescription: string,
  setEditedDescription: (value: string) => void,
  setIsEditingDescription: (value: boolean) => void,
  onFieldUpdate: (id: string, field: string, value: string | number) => void
) => {
  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
    setEditedDescription(product.description);
  };

  const handleDescriptionSave = async () => {
    if (editedDescription.trim() !== product.description && editedDescription.trim() !== '') {
      await onFieldUpdate(product._id, 'description', editedDescription.trim());
    }
    setIsEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setEditedDescription(product.description);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  return {
    handleDescriptionClick,
    handleDescriptionSave,
    handleDescriptionCancel,
    handleDescriptionKeyPress,
  };
};