export const registerStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    px: 2,
    py: 4,
  },
  
  header: {
    textAlign: "center",
    mb: 6,
  },
  
  subtitle: {
    color: "rgba(255,255,255,0.8)", 
    fontWeight: 300,
    letterSpacing: 2
  },
  
  paper: {
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
  },
  
  title: {
    fontWeight: 700,
    background: "linear-gradient(135deg, #34d399, #60a5fa)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    mb: 4,
    letterSpacing: -0.5
  },
  
  errorMessage: {
    color: "#f87171",
    textAlign: "center",
    mb: 3,
    fontWeight: 500,
    p: 2.5,
    background: "rgba(239, 68, 68, 0.1)",
    borderRadius: 3,
    border: "1px solid rgba(239, 68, 68, 0.2)",
    fontSize: "0.9rem",
  },
  
  footer: {
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
  },
  globalSelection: {
    '& *::selection': {
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
  },
}
};

export const registerFormStyles = {
  form: {
    display: "flex", 
    flexDirection: "column", 
    gap: 3.5
  },
  textField: {
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
  },
  selectField: {
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
  },
  submitButton: {
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
  },
}
