import { useEffect, useState } from "react";
import axios from "axios";

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
        const productsRes = await axios.get("http://localhost:5000/api/products", { withCredentials: true });
        const requestsRes = await axios.get<string[]>(
          "http://localhost:5000/api/requests/company",
          { withCredentials: true }
        );

        setProducts(productsRes.data);
        setRequestedProducts(new Set(requestsRes.data));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMessageChange = (productId: string, value: string) => {
    setMessages(prev => ({ ...prev, [productId]: value }));
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantities(prev => ({ ...prev, [productId]: parsed }));
    }
  };

  const handleRequest = async (productId: string) => {
    const message = messages[productId] || "";
    const quantity = quantities[productId] || 1; // default to 1 if not specified

    try {
      await axios.post(
        "http://localhost:5000/api/requests",
        { productId, message, quantity },
        { withCredentials: true }
      );
      alert("Request sent successfully!");
      setRequestedProducts(prev => new Set(prev).add(productId));

      // Clear inputs
      setMessages(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      setQuantities(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>No products available.</div>;

  return (
    <div>
      <h2>Available Products</h2>
      <ul>
        {products.map(product => {
          const isRequested = requestedProducts.has(product._id);
          return (
            <li
              key={product._id}
              style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
              <p><strong>Vendor:</strong> {product.vendorId.name}</p>
              <p><strong>Contact:</strong> {product.vendorId.email}</p>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={quantities[product._id] || ""}
                onChange={e => handleQuantityChange(product._id, e.target.value)}
                disabled={isRequested}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />

              <textarea
                placeholder="Request Payback Duration (defaults to Net30 if empty)"
                value={messages[product._id] || ""}
                onChange={e => handleMessageChange(product._id, e.target.value)}
                disabled={isRequested}
                style={{ width: "100%", height: "60px", marginBottom: "0.5rem" }}
              />

              <button
                onClick={() => handleRequest(product._id)}
                disabled={isRequested}
              >
                {isRequested ? "Requested" : "Request Product"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
