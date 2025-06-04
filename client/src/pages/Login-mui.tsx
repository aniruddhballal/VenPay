import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
} from "@mui/material";

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

      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });

      const user = userRes.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setMessage(msg);
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 6,
        }}
      >
        <Box
          component="img"
          src="/images/venpay-logo.png"
          alt="VenPay Logo"
          sx={{ height: 94.6, width: 104.8 }}
        />
        <Box
          component="img"
          src="/images/venpay-text.png"
          alt="VenPay Text"
          sx={{ height: 94.6, width: "auto" }}
        />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 450 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "justify",
            background: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.4) inset",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            color="#000"
            mb={4}
          >
            Login
          </Typography>

          {message && (
            <Box
              sx={{
                color: "#ef4444",
                textAlign: "center",
                mb: 3,
                fontWeight: 600,
                p: 2,
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: 2,
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {message}
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "white",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.5,
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
                textTransform: "none",
                '&:hover': {
                  background: "linear-gradient(135deg, #2563eb, #1e40af)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
                },
              }}
            >
              Login
            </Button>
          </Box>

          <Typography variant="body2" align="center" mt={3}>
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}