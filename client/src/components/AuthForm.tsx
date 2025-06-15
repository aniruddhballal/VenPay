import { Box, TextField, Button} from "@mui/material";

// ===== STYLES SECTION =====
import { authFormStyles } from "../styles/loginStyles";

type Props = {
  email: string;
  password: string;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export const AuthForm = ({ email, password, onEmailChange, onPasswordChange, loading, onSubmit }: Props) => (
  <Box component="form" onSubmit={onSubmit} sx={authFormStyles.form}>
    <TextField
      type="email"
      label="Email Address"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      required fullWidth autoComplete="email" sx={authFormStyles.textField}
    />
    <TextField
      type="password"
      label="Password"
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
      required fullWidth autoComplete="current-password" sx={authFormStyles.textField}
    />
    <Button
      type="submit" variant="contained" size="large"
      disabled={loading} sx={authFormStyles.button}
    >
      {loading ? "Signing In..." : "Sign In"}
    </Button>
  </Box>
);
