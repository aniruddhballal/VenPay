import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

// Mock functions for demo purposes
const mockApi = {
  post: (url, data) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === "demo@example.com" && data.password === "password") {
        resolve({ data: { message: "Login successful!" } });
      } else {
        reject({ response: { data: { error: "Invalid credentials" } } });
      }
    }, 1500);
  }),
  get: (url) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { user: { name: "Demo User", email: "demo@example.com" } } });
    }, 500);
  })
};

const mockToast = {
  success: (msg) => console.log("Success:", msg),
  error: (msg) => console.log("Error:", msg)
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textLogoRef = useRef(null);
  const welcomeRef = useRef(null);
  const paperRef = useRef(null);
  const titleRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);
  const linkRef = useRef(null);
  const messageRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    // Create master timeline
    tl.current = gsap.timeline();
    
    // Set initial states
    gsap.set([logoRef.current, textLogoRef.current, welcomeRef.current, paperRef.current], {
      opacity: 0,
      y: 30
    });
    
    gsap.set([titleRef.current, emailRef.current, passwordRef.current, buttonRef.current, linkRef.current], {
      opacity: 0,
      y: 20
    });

    // Entrance animations
    tl.current
      .to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      })
      .to(textLogoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .to(paperRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.4")
      .to([emailRef.current, passwordRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.2")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")
      .to(linkRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2");

    // Add floating animation to logos
    gsap.to([logoRef.current, textLogoRef.current], {
      y: "+=10",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: 0.2
    });

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  // Enhanced input focus animations
  const handleInputFocus = (ref) => {
    gsap.to(ref.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleInputBlur = (ref) => {
    gsap.to(ref.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Button hover animations
  const handleButtonHover = () => {
    if (!loading) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleButtonLeave = () => {
    if (!loading) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Loading animation
  const startLoadingAnimation = () => {
    gsap.to(buttonRef.current, {
      scale: 0.98,
      duration: 0.1
    });
    
    // Pulse animation during loading
    gsap.to(buttonRef.current, {
      scale: 1.02,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  };

  const stopLoadingAnimation = () => {
    gsap.killTweensOf(buttonRef.current);
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // Error message animation
  const showErrorMessage = () => {
    if (messageRef.current) {
      gsap.fromTo(messageRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }
  };

  // Success animation
  const showSuccessAnimation = () => {
    // Scale and fade out the form
    gsap.to(paperRef.current, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Show success feedback
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    startLoadingAnimation();
    
    try {
      const res = await mockApi.post("/auth/login", { email, password });
      const msg = res.data.message || "Logged in!";
      mockToast.success(msg);
      
      // Show success animation
      showSuccessAnimation();
      
      // Simulate navigation after animation
      setTimeout(() => {
        console.log("Navigating to dashboard...");
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed";
      mockToast.error(errorMsg);
      setMessage(errorMsg);
      
      // Shake animation for error
      gsap.to(paperRef.current, {
        x: -10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut",
        onComplete: () => {
          showErrorMessage();
        }
      });
    } finally {
      setLoading(false);
      stopLoadingAnimation();
    }
  };

  return (
    <Box
      ref={containerRef}
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
            ref={logoRef}
            component="div"
            sx={{
              height: { xs: 70, sm: 95 },
              width: { xs: 77, sm: 105 },
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white",
              filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))",
            }}
          >
            VP
          </Box>
          <Box
            ref={textLogoRef}
            sx={{
              height: { xs: 70, sm: 95 },
              display: "flex",
              alignItems: "center",
              filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.4))",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              VenPay
            </Typography>
          </Box>
        </Box>
        <Typography
          ref={welcomeRef}
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.8)",
            fontWeight: 300,
            letterSpacing: 2,
          }}
        >
          Welcome Back
        </Typography>
      </Box>

      <Paper
        ref={paperRef}
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
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
            borderRadius: "16px 16px 0 0",
          },
        }}
      >
        <Typography
          ref={titleRef}
          variant="h4"
          align="center"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
            letterSpacing: -0.5,
          }}
        >
          Sign In
        </Typography>

        {message && (
          <Box
            ref={messageRef}
            sx={{
              color: "#f87171",
              textAlign: "center",
              mb: 3,
              fontWeight: 500,
              p: 2.5,
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: 3,
              border: "1px solid rgba(239, 68, 68, 0.2)",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </Box>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}
        >
          <TextField
            ref={emailRef}
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => handleInputFocus(emailRef)}
            onBlur={() => handleInputBlur(emailRef)}
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
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
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
            }}
          />

          <TextField
            ref={passwordRef}
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => handleInputFocus(passwordRef)}
            onBlur={() => handleInputBlur(passwordRef)}
            required
            fullWidth
            autoComplete="current-password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
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
            }}
          />

          <Button
            ref={buttonRef}
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            sx={{
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
                boxShadow: "0 12px 40px rgba(59, 130, 246, 0.4)",
                "&::before": {
                  left: "100%",
                },
              },
              "&.Mui-disabled": {
                background: "#64748b",
                color: "rgba(255,255,255,0.7)",
                opacity: 0.7,
              },
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Typography
          ref={linkRef}
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
              cursor: "pointer",
              "&:hover": {
                color: "#93c5fd",
                textDecoration: "underline",
              },
            },
          }}
        >
          Don't have an account?{" "}
          <span
            onClick={() => console.log("Navigate to register")}
            style={{ color: "#60a5fa", cursor: "pointer", fontWeight: 600 }}
          >
            Create one
          </span>
        </Typography>
      </Paper>

      {/* Demo Instructions */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          background: "rgba(30, 30, 46, 0.8)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
          Demo Credentials:
        </Typography>
        <Typography variant="body2" sx={{ color: "#60a5fa", fontFamily: "monospace" }}>
          Email: demo@example.com
          <br />
          Password: password
        </Typography>
      </Box>
    </Box>
  );
}