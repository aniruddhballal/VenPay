import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, Paper, TextField, Button, MenuItem, Fade, Grow } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { registerStyles } from "../styles/registerStyles";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("vendor");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      const res = await api.post("/auth/register", { 
        email, 
        name, 
        password, 
        userType 
      });
      const msg = res.data.message || "Registration successful!";
      toast.success(msg);
      
      // After successful registration, fetch user data and update Redux store
      const userRes = await api.get("/auth/me");
      dispatch(setUser(userRes.data.user));
      
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={registerStyles.container}>
      <Fade in timeout={800}>
        <Box sx={registerStyles.header}>
          <Box sx={registerStyles.logoContainer}>
            <Box
              component="img"
              src="/images/venpay-logo.png"
              alt="VenPay Logo"
              sx={registerStyles.logo}
            />
            <Box
              component="img"
              src="/images/venpay-text.png"
              alt="VenPay Brand Text"
              sx={registerStyles.brandText}
            />
          </Box>
          <Typography variant="h6" sx={registerStyles.subtitle}>
            Join VenPay Today
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={1000}>
        <Paper elevation={24} sx={registerStyles.paper}>
          <Typography variant="h4" align="center" sx={registerStyles.title}>
            Create Account
          </Typography>

          {message && (
            <Fade in>
              <Box sx={registerStyles.errorMessage}>
                {message}
              </Box>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={registerStyles.form}>
            <TextField
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              sx={registerStyles.textField}
            />

            <TextField
              type="text"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoComplete="name"
              sx={registerStyles.textField}
            />
            
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              sx={registerStyles.textField}
            />

            <TextField
              select
              label="Account Type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              fullWidth
              sx={registerStyles.selectField}
            >
              <MenuItem value="vendor">Vendor</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={registerStyles.submitButton}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={registerStyles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
