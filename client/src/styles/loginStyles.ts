export const containerStyles = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
  px: 2,
  py: 4,
};

export const headerBoxStyles = {
  textAlign: "center",
  mb: 6,
};

export const welcomeTextStyles = {
  color: "rgba(255,255,255,0.8)",
  fontWeight: 300,
  letterSpacing: 2,
};

export const paperStyles = {
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

export const titleStyles = {
  fontWeight: 700,
  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  mb: 4,
  letterSpacing: -0.5,
};

export const errorMessageStyles = {
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

export const footerTextStyles = {
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
