import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import ProductRequests from "./ProductRequests";
import PaymentRequests from "./PaymentRequests";
import { toast } from "react-toastify";
import { setUser, logout, setLoading, setInitialized } from "../store/authSlice";
import styles from "../styles/Dashboard.module.css";

// Define RootState type for useSelector
interface RootState {
  auth: {
    user: {
      _id: string;
      email: string;
      name: string;
      userType: "vendor" | "company";
    } | null;
    isLoading: boolean;
    isInitialized: boolean;
  };
}

export default function Dashboard() {
  const { user, isLoading, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch user data if not already initialized
    if (!isInitialized) {
      dispatch(setLoading(true));
      
      api
        .get("/auth/me")
        .then(res => {
          const fetchedUser = res.data.user;
          if (
            fetchedUser?._id &&
            fetchedUser?.email &&
            (fetchedUser.userType === "vendor" || fetchedUser.userType === "company")
          ) {
            dispatch(setUser(fetchedUser));
          } else {
            console.warn("User data incomplete or invalid:", fetchedUser);
            toast.error("Invalid user session. Please log in again.");
            dispatch(setUser(null));
            navigate("/login");
          }
        })
        .catch(err => {
          console.error("Auth check failed:", err);
          toast.error(err.response?.data?.error || "Authentication failed. Please log in again.");
          dispatch(setUser(null));
          navigate("/login");
        })
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setInitialized());
        });
    }
  }, [dispatch, navigate, isInitialized]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logout());
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

  if (isLoading) return <div className={styles["loading"]}>Loading user data...</div>;
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
