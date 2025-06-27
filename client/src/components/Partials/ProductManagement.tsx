import React, { useEffect, useState, useRef} from "react";
import { toast } from "react-toastify";

import { ExpandCard } from "../ProductCards/UpdateProduct";
import { AddProductCard } from "../ProductCards/CreateProduct";
import api from "../../api/api";

import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';

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

  {/* Clean and simple modal usage */}
    <DeleteConfirmationModal
      isOpen={showDeleteModal}
      onClose={closeDeleteModal}
      onCancel={cancelDelete}
      onConfirm={confirmDelete}
      isDeleting={isDeleting}
      title="Confirm Deletion"
      message="Are you sure you want to delete this product?"
      subtitle="This action cannot be undone."
    />
  </>
);
}
export default ProductManagement;