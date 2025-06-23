import { Box, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { authFormStyles } from "../styles/loginStyles";

type Props = {
  email: string;
  password: string;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export const AuthForm = ({ email, password, onEmailChange, onPasswordChange, loading, onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit} sx={authFormStyles.form}>
      <TextField
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        sx={authFormStyles.textField}
      />

      <TextField
        type={showPassword ? "text" : "password"}
        label="Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
        sx={authFormStyles.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"
              sx={{
                marginRight: '0px',
                position: 'static',
                color: 'white',
                width: 'auto',
                height: 'auto',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={authFormStyles.button}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </Box>
  );
};