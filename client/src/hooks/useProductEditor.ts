// hooks/useProductEditor.ts
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface UseProductEditorProps {
  product: Product;
  onFieldUpdate: (id: string, field: string, value: string | number) => void;
}

export const useProductEditor = ({ product }: UseProductEditorProps) => {
  // Editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  
  // Form values
  const [editedName, setEditedName] = useState(product.name);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());
  const [editedDescription, setEditedDescription] = useState(product.description);
  
  // Image handling
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Refs
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);
  const fileSelectedRef = useRef(false);

  // Focus description input when editing starts
  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      const input = descriptionInputRef.current;
      const length = input.value.length;
      input.setSelectionRange(length, length);
      input.focus();
    }
  }, [isEditingDescription]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Update local state when product changes
  useEffect(() => {
    setEditedName(product.name);
    setEditedPrice(product.price.toString());
    setEditedDescription(product.description);
  }, [product]);

  return {
    // States
    isEditingName,
    isEditingPrice,
    isEditingDescription,
    isEditingImage,
    editedName,
    editedPrice,
    editedDescription,
    selectedImage,
    previewUrl,
    uploadingImage,
    
    // Refs
    imageInputRef,
    descriptionInputRef,
    fileSelectedRef,
    
    // Setters
    setIsEditingName,
    setIsEditingPrice,
    setIsEditingDescription,
    setIsEditingImage,
    setEditedName,
    setEditedPrice,
    setEditedDescription,
    setSelectedImage,
    setPreviewUrl,
    setUploadingImage,
  };
};

// hooks/useNameEditor.ts
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

// hooks/usePriceEditor.ts
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

// hooks/useDescriptionEditor.ts
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

// hooks/useImageEditor.ts
export const useImageEditor = (
  product: Product,
  selectedImage: File | null,
  previewUrl: string,
  // @ts-expect-error Used in consuming component
  uploadingImage: boolean,
  imageInputRef: React.RefObject<HTMLInputElement | null>,
  fileSelectedRef: React.RefObject<boolean>,
  setIsEditingImage: (value: boolean) => void,
  setSelectedImage: (value: File | null) => void,
  setPreviewUrl: (value: string) => void,
  setUploadingImage: (value: boolean) => void,
  onFieldUpdate: (id: string, field: string, value: string | number) => void
) => {
  const handleImageClick = () => {
    setIsEditingImage(true);
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fileSelectedRef.current) {
      fileSelectedRef.current = true;
    }
    if (e.target.files && e.target.files[0]) {
      console.log("selected one");
      console.log(e.target.files[0].name);
      setSelectedImage(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
    }
  };

  const handleImageSave = async () => {
    console.log("here, you clicked!");
    if (!selectedImage) {
      setIsEditingImage(false);
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/upload-image/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      
      await onFieldUpdate(product._id, 'image', res.data.image);
      toast.success("Product image updated!");
      
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      toast.error(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      setIsEditingImage(false);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setIsEditingImage(false);
  };

  return {
    handleImageClick,
    handleImageChange,
    handleImageSave,
    handleImageCancel,
  };
};

// hooks/useCardInteractions.ts
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