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
const ExpandCard = ({ product, onDelete, onFieldUpdate }: { 
  product: Product; 
  onDelete: (id: string) => void;
  onFieldUpdate: (id: string, field: string, value: string | number) => void;
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());
  const [editedDescription, setEditedDescription] = useState(product.description);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product._id);
  };

  // Name editing handlers
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

  // Price editing handlers
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

  // Description editing handlers
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

  // Image editing handlers
  const handleImageClick = () => {
    setIsEditingImage(true);
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      // Create preview URL
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
    }
  };

  const handleImageSave = async () => {
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
      
      // Update the product with new image URL
      await onFieldUpdate(product._id, 'image', res.data.image);
      toast.success("Product image updated!");
      
      // Clean up
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

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="expand-card-compact">
      <div className="image-section">
        {isEditingImage && selectedImage ? (
          <div className="image-edit-container">
            <img 
              src={previewUrl} 
              alt="Preview"
              className="product-image image-preview-inline"
            />
            <div className="image-edit-overlay">
              <div className="image-edit-buttons">
                <button 
                  className="btn-save-image"
                  onClick={handleImageSave}
                  disabled={uploadingImage}
                  title="Save image"
                >
                  {uploadingImage ? '⏳' : '✓'}
                </button>
                <button 
                  className="btn-cancel-image"
                  onClick={handleImageCancel}
                  disabled={uploadingImage}
                  title="Cancel"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ) : product.image ? (
          <div 
            className="image-container-editable" 
            onClick={handleImageClick} 
            title="Click to change image"
            style={{ 
              position: 'relative', 
              cursor: 'pointer',
              border: '2px dashed transparent',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px dashed #007bff';
              const hint = e.currentTarget.querySelector('.image-edit-hint');
              if (hint) (hint as HTMLElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px dashed transparent';
              const hint = e.currentTarget.querySelector('.image-edit-hint');
              if (hint) (hint as HTMLElement).style.opacity = '0';
            }}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
            <div 
              className="image-edit-hint"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '12px',
                opacity: '0',
                transition: 'opacity 0.2s ease',
                borderBottomLeftRadius: '6px',
                borderBottomRightRadius: '6px'
              }}
            >
              📷 Click to change
            </div>
          </div>
        ) : (
          <div 
            className="image-placeholder image-placeholder-editable" 
            onClick={handleImageClick} 
            title="Click to add image"
            style={{
              cursor: 'pointer',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              backgroundColor: '#f8f9fa'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '2px dashed #007bff';
              e.currentTarget.style.backgroundColor = '#e3f2fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '2px dashed #ccc';
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
              <div 
                className="image-upload-hint"
                style={{
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: '500'
                }}
              >
                📷 Click to add image
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden file input for image editing */}
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="content">
        <div className="basic-info">
          {isEditingName ? (
            <div className="name-edit-container">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleNameKeyPress}
                onBlur={handleNameSave}
                autoFocus
                className="name-edit-input"
              />
              <div className="name-edit-buttons">
                <button 
                  className="btn-save-name"
                  onClick={handleNameSave}
                >
                  ✓
                </button>
                <button 
                  className="btn-cancel-name"
                  onClick={handleNameCancel}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <h3 
              className="product-name-editable"
              onClick={handleNameClick}
              title="Click to edit"
            >
              {product.name}
            </h3>
          )}
          {isEditingPrice ? (
            <div className="price-edit-container">
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                onKeyDown={handlePriceKeyPress}
                onBlur={handlePriceSave}
                autoFocus
                className="price-edit-input"
              />
              <div className="price-edit-buttons">
                <button 
                  className="btn-save-price"
                  onClick={handlePriceSave}
                >
                  ✓
                </button>
                <button 
                  className="btn-cancel-price"
                  onClick={handlePriceCancel}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="price product-price-editable"
              onClick={handlePriceClick}
              title="Click to edit"
            >
              ₹{product.price.toFixed(2)}
            </div>
          )}
        </div>
        <div className="details">
          {isEditingDescription ? (
            <div className="description-edit-container">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onKeyDown={handleDescriptionKeyPress}
                onBlur={handleDescriptionSave}
                autoFocus
                className="description-edit-textarea"
                rows={3}
              />
              <div className="description-edit-buttons">
                <button 
                  className="btn-save-description"
                  onClick={handleDescriptionSave}
                >
                  ✓
                </button>
                <button 
                  className="btn-cancel-description"
                  onClick={handleDescriptionCancel}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <p 
              className="product-description-editable"
              onClick={handleDescriptionClick}
              title="Click to edit"
            >
              {product.description}
            </p>
          )}
        </div>
        <div className="actions">
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

// Add Product Card Component
const AddProductCard = ({ 
  form, 
  onFormChange, 
  onSubmit, 
  onImageChange, 
  selectedImage, 
  previewUrl, 
  isSubmitting, 
  uploadingImage, 
  fileInputRef,
  editingId,
  onCancel
}: {
  form: { name: string; description: string; price: string };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  previewUrl: string;
  isSubmitting: boolean;
  uploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  editingId: string | null;
  onCancel: () => void;
}) => {
  return (
    <div className="expand-card-compact add-product-card" style={{
      border: '2px dashed #007bff',
      backgroundColor: '#f8f9ff',
      transition: 'all 0.2s ease'
    }}>
      <form onSubmit={onSubmit} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="image-section">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected product"
              className="product-image"
              style={{ borderRadius: '8px' }}
            />
          ) : (
            <div 
              className="image-placeholder"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {selectedImage ? selectedImage.name : 'Click to add image'}
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="basic-info" style={{ marginBottom: '12px' }}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              style={{
                width: '80%',
                padding: '8px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            />
            <input
              name="price"
              placeholder="Price (₹)"
              type="number"
              step="1"
              value={form.price}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              style={{
                width: '52%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                marginLeft: '10px'
              }}
            />
          </div>
          
          <div className="details" style={{ flex: 1, marginBottom: '12px' }}>
            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={onFormChange}
              required
              disabled={isSubmitting}
              rows={3}
              style={{
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
                maxHeight: '70px',
              }}
            />
          </div>
          
          <div className="actions">
            <button 
              type="submit" 
              className="btn btn-success btn-small"
              disabled={isSubmitting || uploadingImage}
              style={{ marginRight: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <span>⏳</span>
                  {editingId ? (
                    selectedImage ? ' Updating...' : ' Updating...'
                  ) : (
                    selectedImage ? ' Creating...' : ' Creating...'
                  )}
                </>
              ) : (
                <>
                  <span>{editingId ? '💾' : '➕'}</span>
                  {editingId ? ' Update' : ' Create'}
                </>
              )}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-cancel btn-small"
                disabled={isSubmitting}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
      </form>
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
        toast.error(err.response?.data?.error || "Failed to save product.");
      //alert("Failed to save product.");
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
