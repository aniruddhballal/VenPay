import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProductDisplay.module.css";

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

  if (loading) return <div className={styles.loadingState}>Loading product...</div>;
  if (error) return <div className={styles.errorState}>{error}</div>;
  if (!product) return <div className={styles.notFoundState}>Product not found.</div>;

  return (
    <div className={styles.container}>
      {/* Image Section */}
      <div className={styles.imageSection}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}></div>
        )}
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {/* Product Title */}
        <h1 className={styles.productTitle}>{product.name}</h1>

        {/* Price Section */}
        <div className={styles.priceSection}>
          <div className={styles.priceLabel}>Price</div>
          <div className={styles.priceValue}>₹{product.price.toFixed(2)}</div>
        </div>

        {/* Description Section */}
        <div className={styles.descriptionSection}>
          <div className={styles.descriptionLabel}>Description</div>
          <p className={styles.descriptionText}>{product.description}</p>
        </div>

        {/* Vendor Section */}
        <div className={styles.vendorSection}>
          <div className={styles.vendorLabel}>Vendor Information</div>
          <div className={styles.vendorInfo}>
            <h3 className={styles.vendorName}>{product.vendorId.name}</h3>
            <a 
              href={`mailto:${product.vendorId.email}`}
              className={styles.vendorEmail}
            >
              {product.vendorId.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
