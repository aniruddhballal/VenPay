import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, Paper, TextField, Button, Fade, Grow } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

// ===== STYLES SECTION =====
const containerStyles = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
  px: 2,
  py: 4,
};

const headerBoxStyles = {
  textAlign: "center",
  mb: 6,
};

const logoContainerStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  mb: 2,
};

const logoImageStyles = {
  height: { xs: 70, sm: 95 },
  width: { xs: 77, sm: 105 },
  filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))",
};

const textImageStyles = {
  height: { xs: 70, sm: 95 },
  width: "auto",
  filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))",
};

const welcomeTextStyles = {
  color: "rgba(255,255,255,0.8)",
  fontWeight: 300,
  letterSpacing: 2,
};

const paperStyles = {
  p: { xs: 3, sm: 5 },
  borderRadius: 4,
  width: "100%",
  maxWidth: 420,
  background: "rgba(30, 30, 46, 0.95)",
  backdropFilter: "blur(30px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 32px 64px -12px rgba(0,0,0,0.4)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
    borderRadius: "16px 16px 0 0",
  },
};

const titleStyles = {
  fontWeight: 700,
  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  mb: 4,
  letterSpacing: -0.5,
};

const errorMessageStyles = {
  color: "#f87171",
  textAlign: "center",
  mb: 3,
  fontWeight: 500,
  p: 2.5,
  background: "rgba(239, 68, 68, 0.1)",
  borderRadius: 3,
  border: "1px solid rgba(239, 68, 68, 0.2)",
  fontSize: "0.9rem",
};

const formStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 3.5,
};

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transform: "translateY(-1px)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transform: "translateY(-1px)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
    },
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#60a5fa",
    },
  },
};

const buttonStyles = {
  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
  color: "white",
  fontWeight: 600,
  borderRadius: 3,
  py: 1.8,
  fontSize: "1.1rem",
  textTransform: "none",
  boxShadow: "0 8px 30px rgba(59, 130, 246, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    transform: "translateY(-3px)",
    boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
  "&:active": {
    transform: "translateY(-1px)",
  },
  "&.Mui-disabled": {
    background: "#64748b",
    color: "rgba(255,255,255,0.7)",
    opacity: 0.7,
  },
};

const footerTextStyles = {
  mt: 4,
  color: "rgba(255,255,255,0.6)",
  "& a": {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: 600,
    transition: "color 0.2s",
    "&:hover": {
      color: "#93c5fd",
      textDecoration: "underline",
    },
  },
};

// ===== COMPONENT SECTION =====
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Remove the extra API call since AuthProvider will handle it
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const msg = res.data.message || "Logged in!";
      toast.success(msg);
      
      // The login endpoint should set the JWT cookie
      // Then fetch user data
      const userRes = await api.get("/auth/me");
      dispatch(setUser(userRes.data.user));
      
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={containerStyles}>
      <Fade in timeout={800}>
        <Box sx={headerBoxStyles}>
          <Box sx={logoContainerStyles}>
            <Box
              component="img"
              src="/images/venpay-logo.png"
              alt="VenPay Logo"
              sx={logoImageStyles}
            />
            <Box
              component="img"
              src="/images/venpay-text.png"
              alt="VenPay Text"
              sx={textImageStyles}
            />
          </Box>
          <Typography variant="h6" sx={welcomeTextStyles}>
            Welcome Back
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={1000}>
        <Paper elevation={24} sx={paperStyles}>
          <Typography variant="h4" align="center" sx={titleStyles}>
            Sign In
          </Typography>

          {message && (
            <Fade in>
              <Box sx={errorMessageStyles}>
                {message}
              </Box>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
            <TextField
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              sx={textFieldStyles}
            />

            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              sx={textFieldStyles}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={buttonStyles}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={footerTextStyles}>
            Don't have an account? <Link to="/register">Create one</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
