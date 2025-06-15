import { Box, Typography, Paper, Fade, Grow } from "@mui/material";
import { Link } from "react-router-dom";

// ==== FORM LOGIC + CUSTOM HOOK ====
import { useRegister } from "../hooks/useRegister";

// ===== COMPONENTS =====
import { AuthLogo } from "../components/AuthLogo";
import { RegisterForm } from "../components/RegisterForm";
import { ErrorMessage } from "../components/ErrorMessage";

// ===== STYLES SECTION =====
import { registerStyles } from "../styles/registerStyles";

export default function Register() {
  const {
    email, setEmail, name, setName, password, setPassword,
    userType, setUserType, message, loading, handleSubmit
  } = useRegister();

  return (
    <Box sx={registerStyles.container}>
      <Fade in timeout={800}>
        <Box sx={registerStyles.header}>
          <AuthLogo />
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

          <ErrorMessage message={message} sx={registerStyles.errorMessage} />

          <RegisterForm
            email={email} setEmail={setEmail}
            name={name} setName={setName}
            password={password} setPassword={setPassword}
            userType={userType} setUserType={setUserType}
            loading={loading}
            handleSubmit={handleSubmit}
          />

          <Typography variant="body2" align="center" sx={registerStyles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
