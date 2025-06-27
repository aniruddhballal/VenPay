import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  vendorId: {
    _id: string;
    email: string;
    name: string;
    type: string;
  };
}

// Enhanced Hover Expand Card Component for Product List
const ProductListExpandCard = ({ 
  product, 
  isRequested, 
  quantity, 
  message, 
  onQuantityChange, 
  onMessageChange, 
  onRequest 
}: { 
  product: Product; 
  isRequested: boolean;
  quantity: number;
  message: string;
  onQuantityChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onRequest: () => void;
}) => {
  return (
    <div className="expand-card">
      <div className="image-section">
        {product.image ? (
          <Link to={`/product/${product._id}`}>
            <img 
              src={product.image} 
              alt={product.name}
              className="product-image"
            />
          </Link>
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
          <p className="product-description">{product.description}</p>
          <Link to={`/user/${product.vendorId._id}`}>
            By {product.vendorId.name} ({product.vendorId.email})
          </Link>
          <div className="product-inputs">
            <input
              type="number"
              min="1"
              className="quantity-input"
              placeholder="Quantity"
              value={quantity || ""}
              onChange={e => onQuantityChange(e.target.value)}
              disabled={isRequested}
            />
            
            <textarea
              className="message-textarea"
              placeholder="Request Payback Duration (defaults to Net30)"
              value={message || ""}
              onChange={e => onMessageChange(e.target.value)}
              disabled={isRequested}
              rows={2}
            />
          </div>
        </div>
        <div className="actions">
          <button
            className={`btn ${isRequested ? "btn-disabled btn-full" : "btn-primary btn-full"}`}
            onClick={onRequest}
            disabled={isRequested}
          >
            {isRequested ? "✓ Requested" : "📋 Request Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestedProducts, setRequestedProducts] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<{ [key: string]: string }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, requestsRes] = await Promise.all([
          api.get("/products"),
          api.get<string[]>("/requests/company"),
        ]);

        setProducts(productsRes.data);
        setRequestedProducts(new Set(requestsRes.data));
      } catch (err) {
        console.error("Failed to load products or requests:", err);
        setError("Failed to load data.");
        toast.error("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuantityChange = (id: string, value: string) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantities(prev => ({ ...prev, [id]: parsed }));
    } else if (value === "") {
      setQuantities(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRequest = async (id: string) => {
    const message = messages[id] || "";
    const quantity = quantities[id] || 1;

    try {
      await api.post("/requests", { productId: id, message, quantity });
      setRequestedProducts((prev) => new Set(prev).add(id));
      setMessages((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      setQuantities((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      toast.success("Product request sent successfully!");
      } catch (err: any) {
      console.error("Failed to send request:", err);
      toast.error(err.response?.data?.error || "Failed to send request.");
    }
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading products...</div>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#e53e3e' }}>{error}</div>
    </div>
  );
  
  if (products.length === 0) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.2rem', color: '#666' }}>No products available.</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2 className="section-heading">Available Products</h2>
      
      <div className="cards-grid">
        {products.map(product => {
          const isRequested = requestedProducts.has(product._id);
          return (
            <ProductListExpandCard
              key={product._id}
              product={product}
              isRequested={isRequested}
              quantity={quantities[product._id] || 0}
              message={messages[product._id] || ""}
              onQuantityChange={(value) => handleQuantityChange(product._id, value)}
              onMessageChange={(value) => setMessages(prev => ({ ...prev, [product._id]: value }))}
              onRequest={() => handleRequest(product._id)}
            />
          );
        })}
      </div>
    </div>
  );
}
