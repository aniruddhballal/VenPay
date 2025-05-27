import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("vendor");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, name, password, userType },
        { withCredentials: true }
      );
      navigate("/dashboard");
    } catch (err: any) {
        const errorMessage = err.response?.data?.error || "Registration failed";
        toast.error(errorMessage);
    }
  };

  return (
    <div className="registerContainer">
      <div className="registerHeader">
        <img
          src="/images/venpay-logo.png"
          alt="VenPay Logo"
          className="registerLogo"
        />
        <img
          src="/images/venpay-text.png"
          alt="VenPay Brand Text"
          className="registerBrandText"
        />
      </div>

      <div className="registerCardWrapper">
        <div className="registerFormContainer">
          <h2 className="registerHeading">Create an Account</h2>

          <form onSubmit={handleSubmit} className="registerForm">
            <input
              className="registerInput"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <input
              className="registerInput"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="registerInput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <select
              className="registerSelect"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="vendor">Vendor</option>
              <option value="company">Company</option>
            </select>

            <button type="submit" className="registerButton">
              Register
            </button>
          </form>

          <div className="registerSecondaryButton">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
