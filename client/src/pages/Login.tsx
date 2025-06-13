import { Link } from "react-router-dom";
import { Box, Typography, Paper, Fade, Grow } from "@mui/material";

// ==== FORM LOGIC + CUSTOM HOOK ====
import { useLogin } from "../hooks/useLogin";

// ===== COMPONENTS =====
import { AuthLogo } from "../components/AuthLogo";
import { AuthForm } from "../components/AuthForm";

// ===== STYLES SECTION =====
import {
  containerStyles, headerBoxStyles, welcomeTextStyles, paperStyles,
  titleStyles, errorMessageStyles, footerTextStyles
} from '../styles/loginStyles';

export default function Login() {
  const {
    email, setEmail, password, setPassword,
    message, loading, handleSubmit
  } = useLogin();

  return (
    <Box sx={containerStyles}>
      <Fade in timeout={800}>
        <Box sx={headerBoxStyles}>
          <AuthLogo />
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
              <Box sx={errorMessageStyles}>{message}</Box>
            </Fade>
          )}

          <AuthForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            loading={loading}
            onSubmit={handleSubmit}
          />

          <Typography variant="body2" align="center" sx={footerTextStyles}>
            Don't have an account? <Link to="/register">Create one</Link>
          </Typography>
        </Paper>
      </Grow>
    </Box>
  );
}
