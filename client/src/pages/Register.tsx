import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, Paper, TextField, Button, MenuItem, Fade, Grow } from "@mui/material";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("vendor");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, name, password, userType },
        { withCredentials: true }
      );
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Fade in timeout={800}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              mb: 2,
            }}
          >
            <Box
              component="img"
              src="/images/venpay-logo.png"
              alt="VenPay Logo"
              sx={{ 
                height: { xs: 70, sm: 95 }, 
                width: { xs: 77, sm: 105 },
                filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))"
              }}
            />
            <Box
              component="img"
              src="/images/venpay-text.png"
              alt="VenPay Brand Text"
              sx={{ 
                height: { xs: 70, sm: 95 }, 
                width: "auto",
                filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))"
              }}
            />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "rgba(255,255,255,0.8)", 
              fontWeight: 300,
              letterSpacing: 2
            }}
          >
            Join VenPay Today
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={1000}>
        <Paper
          elevation={24}
          sx={{
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
              background: "linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)",
              borderRadius: "16px 16px 0 0",
            }
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #34d399, #60a5fa)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
              letterSpacing: -0.5
            }}
          >
            Create Account
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}
          >
            <TextField
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              sx={{
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
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#60a5fa",
                  }
                }
              }}
            />

            <TextField
              type="text"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoComplete="name"
              sx={{
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
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#60a5fa",
                  }
                }
              }}
            />
            
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              sx={{
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
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#60a5fa",
                  }
                }
              }}
            />

            <TextField
              select
              label="Account Type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              fullWidth
              sx={{
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
                  }
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#60a5fa",
                  }
                },
                "& .MuiSelect-icon": {
                  color: "rgba(255, 255, 255, 0.7)",
                }
              }}
            >
              <MenuItem value="vendor">Vendor</MenuItem>
              <MenuItem value="company">Company</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                color: "white",
                fontWeight: 600,
                borderRadius: 3,
                py: 1.8,
                fontSize: "1.1rem",
                textTransform: "none",
                boxShadow: "0 8px 30px rgba(16, 185, 129, 0.3)",
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
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.5s",
                },
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 40px rgba(16, 185, 129, 0.4)",
                  "&::before": {
                    left: "100%",
                  }
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  background: "#64748b",
                  color: "rgba(255,255,255,0.7)",
                  opacity: 0.7,
                }
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              mt: 4, 
              color: "rgba(255,255,255,0.6)",
              "& a": {
                color: "#60a5fa",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.2s",
                "&:hover": {
                  color: "#93c5fd",
                  textDecoration: "underline"
                }
              }
            }}
          >
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
