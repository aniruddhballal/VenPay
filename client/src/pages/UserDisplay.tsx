import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../styles/UserDisplay.module.css";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "company" | "vendor";
}

export default function UserDisplay() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedInUser: User | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!userId) {
      toast.error("User ID not provided.");
      setLoading(false);
      return;
    }
    axios
      .get(`http://localhost:5000/api/users/${userId}`, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return <div className={styles.errorState}>Invalid user ID.</div>;
  if (loading) return <div className={styles.loadingState}>Loading user info...</div>;
  if (!user) return <div className={styles.errorState}>User not found.</div>;

  const isOwnProfile = loggedInUser && loggedInUser._id === user._id;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Details</h2>
      
      <div className={styles.userInfo}>
        <div className={styles.infoRow}>
          <span className={styles.label}>ID:</span>
          <span className={styles.value}>{user._id}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.label}>Name:</span>
          <span className={styles.value}>{user.name}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user.email}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.label}>User Type:</span>
          <span className={`${styles.value} ${user.userType === 'company' ? styles.userTypeCompany : styles.userTypeVendor}`}>
            {user.userType}
          </span>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {isOwnProfile && (
          <button
            onClick={() => navigate(`/edit-profile/${user._id}`)}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Edit Profile
          </button>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className={`${styles.button} ${styles.secondaryButton}`}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
