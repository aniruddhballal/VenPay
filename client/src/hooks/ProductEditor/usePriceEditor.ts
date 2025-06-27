interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export const usePriceEditor = (
  product: Product,
  editedPrice: string,
  setEditedPrice: (value: string) => void,
  setIsEditingPrice: (value: boolean) => void,
  onFieldUpdate: (id: string, field: string, value: string | number) => void
) => {
  const handlePriceClick = () => {
    setIsEditingPrice(true);
    setEditedPrice(product.price.toString());
  };

  const handlePriceSave = async () => {
    const newPrice = parseFloat(editedPrice);
    if (!isNaN(newPrice) && newPrice !== product.price && newPrice >= 0) {
      await onFieldUpdate(product._id, 'price', newPrice);
    }
    setIsEditingPrice(false);
  };

  const handlePriceCancel = () => {
    setEditedPrice(product.price.toString());
    setIsEditingPrice(false);
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceSave();
    } else if (e.key === 'Escape') {
      handlePriceCancel();
    }
  };

  return {
    handlePriceClick,
    handlePriceSave,
    handlePriceCancel,
    handlePriceKeyPress,
  };
};