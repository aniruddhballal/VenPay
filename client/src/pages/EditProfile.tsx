import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./EditProfile.module.css";

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const getFieldGroupClass = (fieldName: string, value: string) => {
    let classes = [styles.fieldGroup];
    
    if (focusedField === fieldName) {
      classes.push(styles.focused);
    }
    
    if (value.trim()) {
      classes.push(styles.hasValue);
    }
    
    return classes.join(' ');
  };

  if (loading) return <div className={styles.loadingState}>Loading user data...</div>;
  if (!user) return <div className={styles.errorState}>User not found.</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Profile</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={getFieldGroupClass('name', name)}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className={getFieldGroupClass('email', email)}>
          <label className={styles.label} htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            placeholder="Enter your email address"
          />
        </div>

        <div className={getFieldGroupClass('userType', userType)}>
          <label className={styles.label} htmlFor="userType">
            User Type
          </label>
          <select
            id="userType"
            className={styles.select}
            value={userType}
            onChange={(e) => setUserType(e.target.value as "company" | "vendor")}
            onFocus={() => setFocusedField('userType')}
            onBlur={() => setFocusedField(null)}
            required
          >
            <option value="company">Company</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={saving}
        >
          {saving && <div className={styles.loadingSpinner}></div>}
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
