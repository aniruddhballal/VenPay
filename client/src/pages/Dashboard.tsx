import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import VendorRequests from "./VendorRequests";
import CompanyRequests from "./CompanyRequests";

type User = {
  email: string;
  name: string;
  userType: "vendor" | "company";
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then(res => {
        const fetchedUser = res.data.user;
        //console.log("Fetched user:", fetchedUser);

        // Ensure user has required fields
        if (fetchedUser?.email && (fetchedUser.userType === "vendor" || fetchedUser.userType === "company")) {
          setUser(fetchedUser);
        } else {
          console.warn("User data incomplete or invalid:", fetchedUser);
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Auth check failed:", err);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <div>Loading user data...</div>;
  if (!user) return <div>Not authorized</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>

      {user.userType === "vendor" && (
        <>
          <h2>Vendor Dashboard</h2>
          <ProductManagement />
          <VendorRequests />
        </>
      )}

      {user.userType === "company" && (
        <>
          <h2>Company Dashboard</h2>
          <ProductList />
          <CompanyRequests />
        </>
      )}
    </div>
  );
}