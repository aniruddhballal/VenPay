import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import ProductRequests from "./ProductRequests";
import PaymentRequests from "./PaymentRequests";
import { toast } from "react-toastify";
import styles from "../styles/Dashboard.module.css"; // 👈 CSS Module import

type User = {
  _id: string;
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
          fetchedUser?._id &&
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

  const goToProfile = () => {
    if (user?._id) {
      navigate(`/user/${user._id}`);
    }
  };

  if (loading) return <div className={styles["loading"]}>Loading user data...</div>;
  if (!user) return <div className={styles["unauthorized"]}>Not authorized</div>;

  return (
    <div className={styles["dashboard-container"]}>
      <h1 className={styles["dashboard-header"]}>Welcome, {user.name}</h1>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button className={`${styles["btn"]} ${styles["profile-button"]}`} onClick={goToProfile}>
          Profile
        </button>
        <button className={`${styles["btn"]} ${styles["logout-button"]}`} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {user.userType === "vendor" && (
        <>
          <h2 className={styles["dashboard-subheader"]}>Vendor Dashboard</h2>
          <section style={{ marginBottom: "3rem" }}>
            <ProductManagement />
          </section>

          <section>
            <ProductRequests />
          </section>
        </>
      )}

      {user.userType === "company" && (
        <>
          <h2 className={styles["dashboard-subheader"]}>Company Dashboard</h2>
          <ProductList />
          <PaymentRequests />
        </>
      )}
    </div>
  );
}
