import { Link } from "react-router-dom";
import { Box, Typography, Paper, Fade, Grow } from "@mui/material";

// ==== FORM LOGIC + CUSTOM HOOK ====
import { useLogin } from "../hooks";

// ===== COMPONENTS =====
import { AuthLogo } from "../components/Auth/AuthLogo";
import { AuthForm } from "../components/Auth/LoginForm";
import { ErrorMessage } from "../components/Auth/ErrorMessage";

// ===== STYLES SECTION =====
import { loginStyles } from '../styles/loginStyles';

export default function Login() {
  const {
    email, setEmail, password, setPassword,
    message, loading, handleSubmit
  } = useLogin();

  return (
    <Box sx={loginStyles.container}>
      <Fade in timeout={800}>
        <Box sx={loginStyles.headerBox}>
          <AuthLogo />
          <Typography variant="h6" sx={loginStyles.welcomeText}>
            Welcome Back
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={1000}>
        <Paper elevation={24} sx={loginStyles.paper}>
          <Typography variant="h4" align="center" sx={loginStyles.title}>
            Sign In
          </Typography>

          <ErrorMessage message={message} sx={loginStyles.errorMessage} />

          <AuthForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            loading={loading}
            onSubmit={handleSubmit}
          />

          <Typography variant="body2" align="center" sx={loginStyles.footerText}>
            Don't have an account? <Link to="/register">Create one</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
