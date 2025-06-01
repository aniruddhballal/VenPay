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

export default function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${id}`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setUserType(res.data.userType);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, userType },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      navigate(`/user/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading user data...</div>;
  if (!user) return <div style={{ padding: "2rem" }}>User not found.</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          />
        </label>
        <label>
          User Type:
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as "company" | "vendor")}
            required
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          >
            <option value="company">Company</option>
            <option value="vendor">Vendor</option>
          </select>
        </label>
        <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem" }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}