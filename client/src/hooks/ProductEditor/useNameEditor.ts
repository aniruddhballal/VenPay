interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export const useNameEditor = (
  product: Product,
  editedName: string,
  setEditedName: (value: string) => void,
  setIsEditingName: (value: boolean) => void,
  onFieldUpdate: (id: string, field: string, value: string | number) => void
) => {
  const handleNameClick = () => {
    setIsEditingName(true);
    setEditedName(product.name);
  };

  const handleNameSave = async () => {
    if (editedName.trim() !== product.name && editedName.trim() !== '') {
      await onFieldUpdate(product._id, 'name', editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(product.name);
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  return {
    handleNameClick,
    handleNameSave,
    handleNameCancel,
    handleNameKeyPress,
  };
};