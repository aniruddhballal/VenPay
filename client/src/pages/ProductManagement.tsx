import React, { useEffect, useState, useRef} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // new optional image URL field
}

// 3D Flip Card Component
const FlipCard = ({ product, onEdit, onDelete }: { 
  product: Product; 
  onEdit: (product: Product) => void; 
  onDelete: (id: string) => void; 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product._id);
  };

  return (
    <div 
      className="flip-card-container"
      onClick={handleFlip}
    >
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className="flip-card-face flip-card-front">
          <div className="image-container">
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
          <div className="card-content">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price.toFixed(2)}</p>
          </div>
          <div className="flip-indicator">
            <span>Click for more</span>
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-face flip-card-back">
          <div className="back-content">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            <div className="product-price-large">
              <span>₹{product.price.toFixed(2)}</span>
            </div>
            <div className="card-actions">
              <button 
                className="action-btn edit-btn"
                onClick={handleEdit}
              >
                ✏️ Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null); // New ref for form section

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

    // Clean up URL object on unmount or change
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
      // Update product image url locally in products list
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, image: res.data.image } : p))
      );
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      toast.error(err.response?.data?.error || "Failed to upload image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          toast.success("Product updated and image uploaded!");
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
          toast.success("Product created and image uploaded!");
        } else {
          toast.success("Product created successfully!");
        }
      }

      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedImage(null); // clear state too
    } catch (err: any) {
      console.error("Failed to save product:", err);
      toast.error(err.response?.data?.error || "Failed to save product.");
    }
  };

  const handleDelete = (id: string) => {
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
    setSelectedImage(null); // reset selectedImage because image is from server

    // Scroll to form section smoothly
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  if (loading) return <div className="product-management-container">Loading products...</div>;

  return (
    <>
      <div className="styles.product-management-container">
        <div ref={formSectionRef}> {/* Wrap form section with ref */}
          <h2 className="product-management-heading">{editingId ? "Edit Product" : "Add Product"}</h2>
          <form onSubmit={handleSubmit} className="product-management-form" encType="multipart/form-data">
            <input
              className="product-management-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <textarea
              className="product-list-textarea"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <input
              className="product-management-input"
              name="price"
              placeholder="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="product-image-input"
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected product"
                style={{ width: "120px", height: "120px", objectFit: "cover", marginTop: "10px", borderRadius: "8px" }}
              />
            )}

            <div className="product-management-button-group">
              <button type="submit" className="button submit-button">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="button cancel-button">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 className="product-management-heading">Your Products</h2>
        {products.length === 0 && <p>No products added yet.</p>}
        
        <div className="products-grid">
          {products.map((product) => (
            <FlipCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
}
