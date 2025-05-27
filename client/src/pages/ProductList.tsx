import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  vendorId: {
    _id: string;
    email: string;
    name: string;
    type: string;
  };
}

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
          axios.get("http://localhost:5000/api/products", { withCredentials: true }),
          axios.get<string[]>("http://localhost:5000/api/requests/company", {
            withCredentials: true,
          }),
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
    }
  };

  const handleRequest = async (id: string) => {
    const message = messages[id] || "";
    const quantity = quantities[id] || 1;

    try {
      await axios.post(
        "http://localhost:5000/api/requests",
        { productId: id, message, quantity },
        { withCredentials: true }
      );
      setRequestedProducts(prev => new Set(prev).add(id));
      setMessages(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
      setQuantities(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      console.error("Failed to send request:", err);
      toast.error(err.response?.data?.error || "Failed to send request.");
    }
  };

  if (loading) return <div className="product-list-loading">Loading products...</div>;
  if (error) return <div className="product-list-error">{error}</div>;
  if (products.length === 0) return <div className="product-list-empty">No products available.</div>;

  return (
    <div className="product-list-wrapper">
      <h2 className="product-list-title">Available Products</h2>
      <div className="product-list-grid">
        {products.map(product => {
          const isRequested = requestedProducts.has(product._id);
          return (
            <div className="product-list-card" key={product._id}>
              <div className="product-list-header">
                <h3>{product.name}</h3>
                <span className="product-price">₹{product.price.toFixed(2)}</span>
              </div>
              <p className="product-list-description">{product.description}</p>
              <p className="product-vendor">By {product.vendorId.name} ({product.vendorId.email})</p>

              <input
                type="number"
                min="1"
                className="product-list-input"
                placeholder="Quantity"
                value={quantities[product._id] || ""}
                onChange={e => handleQuantityChange(product._id, e.target.value)}
                disabled={isRequested}
              />

              <textarea
                className="product-list-textarea"
                placeholder="Request Payback Duration (defaults to Net30)"
                value={messages[product._id] || ""}
                onChange={e => setMessages(prev => ({ ...prev, [product._id]: e.target.value }))}
                disabled={isRequested}
              />

              <button
                className={`product-list-button ${isRequested ? "product-list-button-disabled" : ""}`}
                onClick={() => handleRequest(product._id)}
                disabled={isRequested}
              >
                {isRequested ? "Requested" : "Request Product"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
