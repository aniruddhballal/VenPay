import { useState, useRef, useEffect } from 'react';

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