import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  if (!userId) return <div style={{ padding: "2rem" }}>Invalid user ID.</div>;
  if (loading) return <div style={{ padding: "2rem" }}>Loading user info...</div>;
  if (!user) return <div style={{ padding: "2rem" }}>User not found.</div>;

  const isOwnProfile = loggedInUser && loggedInUser._id === user._id;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>User Details</h2>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User Type:</strong> {user.userType}</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        {isOwnProfile && (
          <button
            onClick={() => navigate(`/edit-profile/${user._id}`)}
            style={{ padding: "0.5rem 1rem" }}
          >
            Edit Profile
          </button>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          style={{ padding: "0.5rem 1rem" }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}