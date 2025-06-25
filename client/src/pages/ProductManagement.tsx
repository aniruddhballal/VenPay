import React, { useEffect, useState, useRef} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

import { ExpandCard } from "../components/ExpandCard";
import { AddProductCard } from "../components/AddProductCard";

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

  // Restore your original useEffect for fetching from backend:
  useEffect(() => {
     axios
       .get("http://localhost:5000/api/products/my", { withCredentials: true })
       .then((res) => {
         setProducts(res.data);
       })
       .catch((err) => {
         console.error("Failed to fetch products:", err);
         toast.warn(err.response?.data?.error || "Failed to fetch products.");
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
       const res = await axios.post(
         `http://localhost:5000/api/products/upload-image/${productId}`,
         formData,
         {
           headers: { "Content-Type": "multipart/form-data" },
           withCredentials: true,
         }
       );
      // // Update product image url locally in products list
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
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        updateData,
        { withCredentials: true }
      );
      
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
      let res: any;
      if (editingId) {
        res = await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          productData,
          { withCredentials: true }
        );
        
        if (selectedImage) {
          await uploadImage(editingId);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await axios.get(`http://localhost:5000/api/products/${editingId}`, {
            withCredentials: true,
          });
          setProducts(products.map((p) => (p._id === editingId ? updatedProduct.data : p)));
          toast.success("Product with image updated!");
        } else {
          // No image, use original response data
          setProducts(products.map((p) => (p._id === editingId ? res.data : p)));
          toast.success("Product updated successfully!");
        }
        
      } else {
        // Create the product first
        res = await axios.post("http://localhost:5000/api/products/", productData, {
          withCredentials: true,
        });
        
        // Upload image if selected (before adding to state)
        if (selectedImage) {
          await uploadImage(res.data._id);
          
          // Fetch the updated product data with image URL
          const updatedProduct = await axios.get(`http://localhost:5000/api/products/${res.data._id}`, {
            withCredentials: true,
          });
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

  const handleDelete = (id: string) => {
    // Restore your original deletion logic:
     confirmAlert({
       title: "Confirm Deletion",
       message: "Are you sure you want to delete this product?",
       buttons: [
         {
           label: "Yes",
           onClick: async () => {
             try {
               await axios.delete(`http://localhost:5000/api/products/${id}`, {
                 withCredentials: true,
               });
               setProducts((prev) => prev.filter((p) => p._id !== id));
               toast.success("Product deleted successfully.");
             } catch (err: any) {
               console.error("Failed to delete product:", err);
               toast.error(err.response?.data?.error || "Failed to delete product.");
             }
           },
         },
         {
           label: "No",
           onClick: () => {
             toast.info("Deletion cancelled.");
           },
         },
       ],
     });
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
    </div>
  );

  return (
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
  );

};

export default ProductManagement;