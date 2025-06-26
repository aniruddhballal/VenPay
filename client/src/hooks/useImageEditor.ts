// hooks/useImageEditor.ts

import axios from 'axios';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

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