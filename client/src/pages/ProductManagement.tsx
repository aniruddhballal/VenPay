import React, { useEffect, useState, useRef} from "react";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

import { ExpandCard } from "../components/ExpandCard";
import { AddProductCard } from "../components/AddProductCard";
import api from "../api";

const MAX_DESCRIPTION_LENGTH = 96;
const MAX_NAME_LENGTH = 18;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);

// 2. Add these state variables at the top of your parent component (where you have the products state)
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const [isDeleting, setIsDeleting] = useState(false);


  // Restore your original useEffect for fetching from backend:
  useEffect(() => {
     api
      .get("/products/my")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        // toast.warn is optional — api.ts already shows a toast for most errors
      })
      .finally(() => setLoading(false));
    
  }, []);

  // Create image preview on image select
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingId(null);
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If it's the description field, enforce character limit
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    
    // If it's the name field, enforce character limit
    if (name === 'name' && value.length > MAX_NAME_LENGTH) {
      return;
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Upload image separately after product creation/update
  const uploadImage = async (productId: string) => {
    if (!selectedImage) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
       const res = await api.post(
        `/products/upload-image/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      // Update product image url locally in products list
       setProducts((prev) =>
         prev.map((p) => (p._id === productId ? { ...p, image: res.data.image } : p))
       );
      
      console.log("Image upload placeholder");
    } catch (err: any) {
      console.error("Failed to upload image:", err);
       toast.error(err.response?.data?.error || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // New function to handle inline field updates
  const handleFieldUpdate = async (id: string, field: string, value: string | number) => {
    try {
      const updateData = { [field]: value };
      await api.put(`/products/${id}`, updateData);
      
      setProducts(prev => 
        prev.map(p => p._id === id ? { ...p, [field]: value } : p)
      );
      
      const fieldName = field === 'name' ? 'name' : field === 'price' ? 'price' : field === 'description' ? 'description' : 'image';
      if (field !== 'image') {
        toast.success(`Product ${fieldName} updated!`);
      }
    } catch (err: any) {
      console.error(`Failed to update product ${field}:`, err);
      toast.error(err.response?.data?.error || `Failed to update product ${field}.`);
    }
  };

  // 6. Optional: Add validation before form submission:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  // Validate description length
  if (form.description.length > MAX_DESCRIPTION_LENGTH) {
    toast.error(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.`);
    return;
  }

    setIsSubmitting(true);
  
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
    };

    try {
      if (editingId) {
        const res = await api.put(`/products/${editingId}`, productData);
        
        if (selectedImage) {
          await uploadImage(editingId);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await api.get(`/products/${editingId}`);

          setProducts(products.map((p) => (p._id === editingId ? updatedProduct.data : p)));
          toast.success("Product with image updated!");
        } else {
          // No image, use original response data
          setProducts(products.map((p) => (p._id === editingId ? res.data : p)));
          toast.success("Product updated successfully!");
        }
        
      } else {
        // Create the product first
        const res = await api.post("/products/", productData);
        
        // Upload image if selected (before adding to state)
        if (selectedImage) {
          await uploadImage(res.data._id);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await api.get(`/products/${res.data._id}`);

          setProducts([...products, updatedProduct.data]);
          toast.success("Product with image created!");
        } else {
          // No image, use original response data
          setProducts([...products, res.data]);
          toast.success("Product created successfully!");
        }
      }
      
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedImage(null);
      
    } catch (err: any) {
      console.error("Failed to save product:", err);
      toast.error(err.response?.data?.error || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

// 3. Replace your handleDelete function with this:
const handleDelete = (id: string) => {
  setSelectedProductId(id);
  setShowDeleteModal(true);
};

// 4. Add these helper functions:
const confirmDelete = async () => {
  if (!selectedProductId) return;
  
  setIsDeleting(true);
  
  try {
    await api.delete(`/products/${selectedProductId}`);
    setProducts((prev) => prev.filter((p) => p._id !== selectedProductId));
    toast.success("Product deleted successfully.");
    closeDeleteModal();
  } catch (err) {
    console.error("Failed to delete product:", err);
  } finally {
    setIsDeleting(false);
  }
};

const cancelDelete = () => {
  toast.info("Deletion cancelled.");
  closeDeleteModal();
};

const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setSelectedProductId(null);
};

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
    </div>
  );

return (
  <>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2 className="section-heading">Your Products</h2>
      
      <div className="cards-grid-small">
        {products.map((product) => (
          <ExpandCard
            key={product._id}
            product={product}
            onDelete={handleDelete}
            onFieldUpdate={handleFieldUpdate}
          />
        ))}
        
        {/* Add Product Card as the last item in the grid */}
        <AddProductCard
          form={form}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          onImageChange={handleImageChange}
          selectedImage={selectedImage}
          previewUrl={previewUrl}
          isSubmitting={isSubmitting}
          uploadingImage={uploadingImage}
          fileInputRef={fileInputRef}
          editingId={editingId}
          onCancel={resetForm}
        />
      </div>
      
      {products.length === 0 && (
        <p className="no-products" style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No products yet. Use the card above to create your first product!
        </p>
      )}
    </div>

    {/* Glassmorphic Delete Modal */}
    {showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeDeleteModal}
        ></div>
        
        {/* Modal */}
        <div className="relative transform transition-all duration-300">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl max-w-md w-full mx-4">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-pink-500/10 animate-pulse"></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
              {/* Close button */}
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative p-4 bg-red-500/20 rounded-full border border-red-400/30">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Confirm Deletion
              </h2>
              
              {/* Message */}
              <div className="text-center mb-8">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete this product?
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This action cannot be undone.
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 font-medium"
                >
                  No
                </button>
                
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      'Yes'
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* CSS for shimmer animation */}
    {/* <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style> */}
  </>
);
}
export default ProductManagement;