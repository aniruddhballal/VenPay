import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        });
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>{product.name}</h2>
      {product.image && <img src={product.image} alt={product.name} style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} />}
      <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Vendor:</strong> {product.vendorId.name} ({product.vendorId.email})</p>
    </div>
  );
}