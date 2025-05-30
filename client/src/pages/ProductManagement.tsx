import React, { useEffect, useState, useRef} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

// Hover Expand Card Component
const ExpandCard = ({ product, onEdit, onDelete }: { 
  product: Product; 
  onEdit: (product: Product) => void; 
  onDelete: (id: string) => void; 
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product._id);
  };

    return (
    <div className="expand-card-compact">
      <div className="image-section">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="image-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>
      <div className="content">
        <div className="basic-info">
          <h3>{product.name}</h3>
          <div className="price">₹{product.price.toFixed(2)}</div>
        </div>
        <div className="details">
          <p>{product.description}</p>
        </div>
        <div className="actions">
          <button 
            className="btn btn-primary btn-small"
            onClick={handleEdit}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-danger btn-small"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );

};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);

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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
         setProducts(products.map((p) => (p._id === editingId ? res.data : p)));

         if (selectedImage) {
           await uploadImage(editingId);
           toast.success("Product with image updated!");
         } else {
           toast.success("Product updated successfully!");
         }

      } else {
         res = await axios.post("http://localhost:5000/api/products/", productData, {
           withCredentials: true,
         });
         setProducts([...products, res.data]);

         if (selectedImage) {
           await uploadImage(res.data._id);
           toast.success("Product with image created!");
         } else {
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
      // toast.error(err.response?.data?.error || "Failed to save product.");
      alert("Failed to save product.");
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

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
    });
    setEditingId(product._id);
    setPreviewUrl(product.image || "");
    setSelectedImage(null);

    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
    </div>
  );

      return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div className="form-section" ref={formSectionRef}>
        <h2 className="form-heading">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="product-form">
          <input
            className="form-input"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <textarea
            className="form-textarea"
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
          <input
            className="form-input"
            name="price"
            placeholder="Price"
            type="number"
            step="1"
            value={form.price}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <br />

          <div className="custom-file-upload">
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden-input"
              disabled={isSubmitting}
            />
            <label htmlFor="file-upload" className="upload-button">
              Upload Image
            </label>
            {selectedImage && (
              <span className="file-name">{selectedImage.name}</span>
            )}
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Selected product"
              className="image-preview"
            />
          )}

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={isSubmitting || uploadingImage}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner-small"></div>
                  {editingId ? (
                    selectedImage ? 'Uploading & Updating...' : 'Updating...'
                  ) : (
                    selectedImage ? 'Uploading & Creating...' : 'Creating...'
                  )}
                </>
              ) : (
                editingId ? 'Update Product' : 'Create Product'
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-cancel"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>

        </form>
      </div>

      <h2 className="section-heading">Your Products</h2>
      {products.length === 0 && (
        <p className="no-products">No products added yet.</p>
      )}

      <div className="cards-grid-small">
        {products.map((product) => (
          <ExpandCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );

};

export default ProductManagement;
