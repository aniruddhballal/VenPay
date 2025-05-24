import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch vendor's products on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/products/my", { withCredentials: true })
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to fetch products.");
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
      name: form.name, 
      description: form.description, 
      price: parseFloat(form.price),
    };

    try {
      if (editingId) {
        // Update
        const res = await axios.put(`http://localhost:5000/api/products/${editingId}`, productData, { withCredentials: true });
        setProducts(products.map(p => p._id === editingId ? res.data : p));
      } else {
        // Create
        const res = await axios.post("http://localhost:5000/api/products/", productData, { withCredentials: true });
        setProducts([...products, res.data]);
      }
      resetForm();
    } catch {
      alert("Failed to save product.");
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
      setProducts(products.filter(p => p._id !== id));
    } catch {
      alert("Failed to delete product.");
    }
  };

  // Edit product - fill form with product data
  const handleEdit = (product: Product) => {
    setForm({ name: product.name, description: product.description, price: product.price.toString() });
    setEditingId(product._id);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={handleChange} 
          required 
        />
        <textarea 
          name="description" 
          placeholder="Description" 
          value={form.description} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="price" 
          placeholder="Price" 
          type="number" 
          step="0.01"
          value={form.price} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <h2>Your Products</h2>
      {products.length === 0 && <p>No products added yet.</p>}
      <ul>
        {products.map(product => (
          <li key={product._id}>
            <strong>{product.name}</strong> (₹{product.price.toFixed(2)})
            <p>{product.description}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}