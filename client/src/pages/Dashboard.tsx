import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import VendorRequests from "./VendorRequests";
import CompanyRequests from "./CompanyRequests";
import { toast } from "react-toastify";

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

        if (
          fetchedUser?.email &&
          (fetchedUser.userType === "vendor" || fetchedUser.userType === "company")
        ) {
          setUser(fetchedUser);
        } else {
          console.warn("User data incomplete or invalid:", fetchedUser);
          toast.error("Invalid user session. Please log in again.");
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Auth check failed:", err);
        toast.error(err.response?.data?.error || "Authentication failed. Please log in again.");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.error || "Logout failed. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading user data...</div>;
  if (!user) return <div className="unauthorized">Not authorized</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome, {user.name}</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {user.userType === "vendor" && (
        <>
          <h2 className="dashboard-subheader">Vendor Dashboard</h2>
          <ProductManagement />
          <VendorRequests />
        </>
      )}

      {user.userType === "company" && (
        <>
          <h2 className="dashboard-subheader">Company Dashboard</h2>
          <ProductList />
          <CompanyRequests />
        </>
      )}
    </div>
  );
}
