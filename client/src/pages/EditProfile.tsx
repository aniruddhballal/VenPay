import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OutlinedInput } from '@mui/material';
import { Box, CardContent, Typography, TextField, MenuItem, FormControl, InputLabel, CircularProgress, Stack,
  Fade} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

import { StyledContainer, StyledCard, Title, StyledForm, FieldGroup, StyledSelect, StyledLoadingButton, BackButton,
  LoadingContainer, ErrorContainer } from '../styles/editProfileStyles';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "company" | "vendor";
}

export default function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string>("");

  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing.");
      setLoading(false);
      return;
    }
    
    axios
      .get(`http://localhost:5000/api/users/${id}`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setUserType(res.data.userType);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, userType },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      navigate(`/dashboard`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/user/${id}`);
  };

  if (loading) {
    return (
      <StyledContainer>
        <LoadingContainer>
          <CircularProgress 
            size={48} 
            thickness={4} 
            sx={{ 
              color: '#3b82f6',
              marginBottom: '1.5rem'
            }} 
          />
          <Typography>Loading user data...</Typography>
        </LoadingContainer>
      </StyledContainer>
    );
  }

  if (!user) {
    return (
      <StyledContainer>
        <ErrorContainer severity="error">
          <Typography variant="h6" sx={{ marginBottom: '0.75rem' }}>
            User not found
          </Typography>
          <Typography variant="body2">
            The requested user profile could not be located.
          </Typography>
        </ErrorContainer>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Fade in timeout={800}>
        <StyledCard elevation={0}>
          <CardContent sx={{ padding: '3rem' }}>
            <Title component="h1">
              Edit Profile
            </Title>

            <StyledForm onSubmit={handleSubmit}>
              <FieldGroup
                focused={focusedField === 'name'}
                hasValue={!!name}
                isValid={name.length >= 2}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  required
                  placeholder="Enter your full name"
                  InputLabelProps={{
                    sx: {
                      left: 50, // Move label to the right
                      top: 21,   // Move label slightly down
                      backgroundColor: 'white',
                      px: 0.5,
                    },
                  }}
                  InputProps={{
                    notched: false,
                    startAdornment: (
                      <PersonIcon sx={{ color: 'action.active', mr: 1.5, paddingLeft: '20px', paddingRight: '125px'}} />
                    ),
                  }}
                />
              </FieldGroup>

              <FieldGroup
                focused={focusedField === 'email'}
                hasValue={!!email}
                isValid={email.includes('@') && email.includes('.')}
              >
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  required
                  placeholder="Enter your email address"
                  InputLabelProps={{
                    sx: {
                      left: 50,
                      top: 21,
                      backgroundColor: 'white',
                      px: 0.5,
                    },
                  }}
                  InputProps={{
                    notched: false, // <--- add this
                    startAdornment: (
                      <EmailIcon sx={{color: 'action.active', mr: 1.5 , paddingLeft: '20px', paddingRight: '125px'}} />
                    ),
                  }}
                />
              </FieldGroup>

              <FieldGroup
                focused={focusedField === 'userType'}
                hasValue={true}
                isValid={true}
              >
                <FormControl fullWidth required variant="outlined">
                  <InputLabel
                    sx={{
                      left: 50,
                      top: 30,
                      backgroundColor: 'white',
                      px: 0.5,
                    }}
                    shrink={true} // force label to stay "shrunk" so it doesn't overlap
                  >
                    Account Type
                  </InputLabel>

                  <StyledSelect
                    value={userType}
                    label="Account Type"
                    onChange={(e) => setUserType(e.target.value as 'company' | 'vendor')}
                    onFocus={() => setFocusedField('userType')}
                    onBlur={() => setFocusedField('')}
                    startAdornment={
                      <BusinessIcon sx={{ color: 'action.active', mr: 1.5, pl: '20px', pr: '125px' }} />
                    }
                    input={
                      <OutlinedInput
                        notched={false}  // <---- This disables the notch gap
                        label="Account Type"
                      />
                    }
                  >
                    {/* MenuItems here */}
                    <MenuItem value="company">
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <BusinessIcon fontSize="small" />
                        <Box>
                          <Typography variant="body1">Company</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Business entity that purchases products
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="vendor">
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <PersonIcon fontSize="small" />
                        <Box>
                          <Typography variant="body1">Vendor</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Individual or business that sells products
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  </StyledSelect>
                </FormControl>
              </FieldGroup>

              <Stack direction="row" spacing={2} sx={{ marginTop: '2rem' }}>
                <BackButton
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  sx={{ flex: 1 }}
                >
                  Back to Profile
                </BackButton>
                
                <StyledLoadingButton
                  type="submit"
                  loading={saving}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  size="large"
                  sx={{ flex: 1 }}
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </StyledLoadingButton>
              </Stack>
            </StyledForm>
          </CardContent>
        </StyledCard>
      </Fade>
    </StyledContainer>
  );
}
