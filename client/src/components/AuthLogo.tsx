import { Box } from "@mui/material";

// ===== STYLES SECTION =====
import { logoContainerStyles, logoImageStyles, textImageStyles} from '../styles/loginStyles'

export const AuthLogo = () => (
  <Box sx={logoContainerStyles}>
    <Box component="img" src="/images/venpay-logo.png" sx={logoImageStyles} />
    <Box component="img" src="/images/venpay-text.png" sx={textImageStyles} />
  </Box>
);
