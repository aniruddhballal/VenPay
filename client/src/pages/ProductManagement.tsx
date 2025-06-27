import React, { useEffect, useState, useRef} from "react";
import { toast } from "react-toastify";

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
  console.log('confirmDelete was called');
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
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    }}
  >
    {/* Backdrop - Click to close */}
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'pointer'
      }}
      onClick={closeDeleteModal}
    />
    
    {/* Modal */}
    <div 
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 1rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        animation: 'scaleIn 0.3s ease-out',
        transform: 'scale(1)'
      }}
    >
      {/* Animated Background Gradient */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 99, 99, 0.1), rgba(255, 165, 0, 0.1), rgba(255, 192, 203, 0.1))',
          animation: 'pulse 3s ease-in-out infinite'
        }}
      />
      
      {/* Shimmer Effect */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 3s ease-in-out infinite'
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: '2rem' }}>
        {/* Close Button */}
        <button
          onClick={closeDeleteModal}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
onMouseEnter={(e) => {
  const target = e.target as HTMLElement;
  target.style.background = 'rgba(255, 255, 255, 0.1)';
  target.style.color = '#fff';
}}
onMouseLeave={(e) => {
  const target = e.target as HTMLElement;
  target.style.background = 'transparent';
  target.style.color = 'rgba(255, 255, 255, 0.7)';
}}

        >
          ✕
        </button>
        
        {/* Warning Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 99, 99, 0.3)',
                borderRadius: '50%',
                filter: 'blur(1rem)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
            <div 
              style={{
                position: 'relative',
                padding: '1rem',
                background: 'rgba(255, 99, 99, 0.2)',
                borderRadius: '50%',
                border: '1px solid rgba(255, 99, 99, 0.3)'
              }}
            >
              <svg 
                style={{ width: '2rem', height: '2rem', color: '#ff6363' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h2 
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          Confirm Deletion
        </h2>
        
        {/* Message */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', fontSize: '1rem' }}>
            Are you sure you want to delete this product?
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
            This action cannot be undone.
          </p>
        </div>
        
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {/* Cancel Button */}
          <button
            onClick={cancelDelete}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontWeight: '500',
              fontSize: '1rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isDeleting ? 0.5 : 1
            }}
onMouseEnter={(e) => {
  if (!isDeleting) {
    const target = e.target as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.2)';
    target.style.transform = 'scale(1.05)';
  }
}}
onMouseLeave={(e) => {
  if (!isDeleting) {
    const target = e.target as HTMLElement;
    target.style.background = 'rgba(255, 255, 255, 0.1)';
    target.style.transform = 'scale(1)';
  }
}}

          >
            No
          </button>
          
          {/* Delete Button */}
          <button
            onClick={confirmDelete}
            disabled={isDeleting}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #ff6363, #ff8a80)',
              border: 'none',
              color: '#fff',
              fontWeight: '500',
              fontSize: '1rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isDeleting ? 0.5 : 1,
              boxShadow: '0 4px 15px rgba(255, 99, 99, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
onMouseEnter={(e) => {
  if (!isDeleting) {
    const target = e.target as HTMLElement;
    target.style.background = 'linear-gradient(135deg, #ff5252, #ff7961)';
    target.style.transform = 'scale(1.05)';
    target.style.boxShadow = '0 6px 20px rgba(255, 99, 99, 0.4)';
  }
}}
onMouseLeave={(e) => {
  if (!isDeleting) {
    const target = e.target as HTMLElement;
    target.style.background = 'linear-gradient(135deg, #ff6363, #ff8a80)';
    target.style.transform = 'scale(1)';
    target.style.boxShadow = '0 4px 15px rgba(255, 99, 99, 0.3)';
  }
}}

          >
            {/* Button Shimmer */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.7s ease'
              }}
              onMouseEnter={(e) => {
  const target = e.target as HTMLElement;
  target.style.transform = 'translateX(100%)';
}}

            />
            
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {isDeleting ? (
                <>
                  <div 
                    style={{
                      width: '1rem',
                      height: '1rem',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
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

    {/* CSS Animations */}
    {/* <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { 
          opacity: 0;
          transform: scale(0.9);
        }
        to { 
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style> */}
  </div>
)}
  </>
);
}
export default ProductManagement;