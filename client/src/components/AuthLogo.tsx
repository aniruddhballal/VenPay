import { Box } from "@mui/material";

// ===== STYLES SECTION =====
import { authLogoStyles } from "../styles/loginStyles";

export const AuthLogo = () => (
  <Box sx={authLogoStyles.logoContainer}>
    <Box component="img" src="/images/venpay-logo.png" sx={authLogoStyles.logoImage} />
    <Box component="img" src="/images/venpay-text.png" sx={authLogoStyles.textImage} />
  </Box>
);