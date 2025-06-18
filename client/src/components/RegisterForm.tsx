import { Box, Button, MenuItem, TextField } from "@mui/material";
import { registerFormStyles } from "../styles/registerStyles";

export function RegisterForm({
  email, setEmail,
  name, setName,
  password, setPassword,
  userType, setUserType,
  loading,
  handleSubmit
}: any) {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={registerFormStyles.form}>
      <TextField
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required fullWidth autoComplete="email"
        sx={registerFormStyles.textField}
      />
      <TextField
        type="text"
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required fullWidth autoComplete="name"
        sx={registerFormStyles.textField}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required fullWidth autoComplete="new-password"
        sx={registerFormStyles.textField}
      />
      <TextField
        select
        label="Account Type"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        required fullWidth sx={registerFormStyles.selectField}
      >
        <MenuItem value="vendor">Vendor</MenuItem>
        <MenuItem value="company">Company</MenuItem>
      </TextField>
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={registerFormStyles.submitButton}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>
    </Box>
  );
}