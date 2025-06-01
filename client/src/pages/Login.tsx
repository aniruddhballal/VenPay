import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const msg = res.data.message || "Logged in!";
      toast.success(msg);

      // Optionally fetch user and store it in context
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });

      const user = userRes.data.user;
      localStorage.setItem("user", JSON.stringify(user)); // optional if using context
      setMessage(msg);
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    }
  };


  return (
    <div className="loginContainer">
      <div className="loginHeader">
        <img src="/images/venpay-logo.png" alt="VenPay Logo" className="loginLogo" />
        <img src="/images/venpay-text.png" alt="VenPay Text" className="loginBrandText" />
      </div>
      <div className="loginCardWrapper">
        <div className="loginCard">
          <h2 className="loginTitle">Login</h2>
          {message && <p className="loginMessage">{message}</p>}
          <form onSubmit={handleSubmit} className="loginForm">
            <input
              type="email"
              className="loginInput"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              className="loginInput"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button type="submit" className="loginButton">
              Login
            </button>
          </form>
          <p className="loginLink">
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
