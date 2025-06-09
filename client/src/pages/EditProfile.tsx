import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OutlinedInput } from '@mui/material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  /*Button,*/
  Container,
  Alert,
  CircularProgress,
  Stack,
  Fade,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import type { TypographyProps } from '@mui/material';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "company" | "vendor";
}

// Keeping all your beautiful styling but making it more spacious and responsive
const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '700px !important',
  margin: '3rem auto',
  padding: '0 2rem',
  position: 'relative',
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '0 1.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '0 1rem',
  },
}));

const StyledCard = styled(Card)(({ /*theme*/ }) => ({
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
    opacity: 0.9,
    zIndex: 1,
  },
  
  '&:hover': {
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 20px -5px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-3px)',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': {
      transform: 'none',
    },
  },
}));

const Title = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: '2.25rem',
  fontWeight: 700,
  color: '#1f2937',
  marginBottom: '3rem',
  textAlign: 'center',
  letterSpacing: '-0.025em',
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '3px',
    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
    borderRadius: '2px',
  },

  [theme.breakpoints.down('md')]: {
    fontSize: '1.875rem',
    marginBottom: '2.5rem',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },

  '@media (prefers-contrast: high)': {
    '&::after': {
      background: '#000000',
    },
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  
  '&:focus-within': {
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    padding: '0.5rem',
    margin: '-0.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    gap: '2rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    '&:focus-within': {
      boxShadow: 'none',
      padding: '0',
      margin: '0',
    },
  },
}));

const FieldGroup = styled(Box, {
  shouldForwardProp: (prop) => !['focused', 'hasValue', 'hasError', 'isValid'].includes(prop as string),
})<{ focused?: boolean; hasValue?: boolean; hasError?: boolean; isValid?: boolean }>(
  ({ theme, focused, hasValue, hasError, isValid }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    position: 'relative',
    padding: '0.5rem 0',
    
    [theme.breakpoints.down('sm')]: {
      gap: '0.5rem',
    },
    
    '& .MuiInputLabel-root': {
      fontWeight: 600,
      color: focused ? '#7c3aed' : hasValue ? '#059669' : hasError ? '#dc2626' : '#374151',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.5rem',
      transition: 'color 0.2s ease',
      transform: focused ? 'translateY(-2px)' : 'none',
      
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        transform: 'none',
      },
    },
    
    '& .MuiOutlinedInput-root': {
      padding: '0',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      
      '& .MuiOutlinedInput-input': {
        padding: '1.125rem 1.25rem',
        fontSize: '1.1rem',
        fontWeight: 500,
        color: '#1f2937',
        
        '&::placeholder': {
          color: '#9ca3af',
          fontWeight: 400,
          opacity: 1,
        },
        
        [theme.breakpoints.down('md')]: {
          padding: '1rem',
          fontSize: '16px', // Prevents zoom on iOS
        },
      },
      
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#d1d5db',
        transition: 'all 0.3s ease',
        
        '@media (prefers-contrast: high)': {
          borderWidth: '3px',
        },
        
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
      },
      
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#9ca3af',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: isValid ? '#10b981' : hasError ? '#dc2626' : '#3b82f6',
        boxShadow: isValid 
          ? '0 0 0 4px rgba(16, 185, 129, 0.15)' 
          : hasError 
          ? '0 0 0 4px rgba(220, 38, 38, 0.15)' 
          : '0 0 0 4px rgba(59, 130, 246, 0.15)',
        
        '@media (prefers-contrast: high)': {
          borderColor: '#000000',
          boxShadow: '0 0 0 3px #000000',
        },
      },
      
      '&.Mui-focused': {
        transform: 'translateY(-2px)',
        
        '@media (prefers-reduced-motion: reduce)': {
          transform: 'none',
        },
      },
      
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        
        '&:hover .MuiOutlinedInput-notchedOutline': {
          boxShadow: 'none',
        },
      },
    },
  })
);

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '1.125rem 1.25rem',
    paddingRight: '3rem !important',
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#1f2937',
    
    [theme.breakpoints.down('md')]: {
      padding: '1rem',
      paddingRight: '3rem !important',
      fontSize: '16px',
    },
  },
  
  '& .MuiSelect-icon': {
    right: '1rem',
    width: '1.25rem',
    height: '1.25rem',
  },
}));

const StyledLoadingButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '2rem',
  minHeight: '56px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease',
    
    '@media (prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  },
  
  '&:hover::before': {
    left: '100%',
  },
  
  '&:not(:disabled)': {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    
    '&:hover': {
      background: 'linear-gradient(135deg, #059669, #047857)',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5)',
      transform: 'translateY(-2px)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    },
  },
  
  '&:disabled': {
    background: '#9ca3af !important',
    color: '#ffffff !important',
    boxShadow: 'none !important',
    transform: 'none !important',
  },
  
  [theme.breakpoints.down('md')]: {
    padding: '1rem 2rem',
    fontSize: '1rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    
    '&:hover': {
      transform: 'none',
    },
    
    '&:active': {
      transform: 'none',
    },
  },
}));

const BackButton = styled(LoadingButton)(({ theme }) => ({
  padding: '1.25rem 2rem',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '2rem',
  minHeight: '56px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.6s ease',

    '@media (prefers-reduced-motion: reduce)': {
      display: 'none',
    },
  },

  '&:hover::before': {
    left: '100%',
  },

  '&:not(:disabled)': {
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', // purple gradient
    color: 'white',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)', // purple shadow

    '&:hover': {
      background: 'linear-gradient(135deg, #5b21b6, #4c1d95)', // darker purple on hover
      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.5)',
      transform: 'translateY(-2px)',
    },

    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
    },
  },

  '&:disabled': {
    background: '#9ca3af !important',
    color: '#ffffff !important',
    boxShadow: 'none !important',
    transform: 'none !important',
  },

  [theme.breakpoints.down('md')]: {
    padding: '1rem 2rem',
    fontSize: '1rem',
  },

  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',

    '&:hover': {
      transform: 'none',
    },

    '&:active': {
      transform: 'none',
    },
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '4rem 3rem',
  color: '#6b7280',
  fontSize: '1.25rem',
  fontWeight: 500,
  background: 'linear-gradient(45deg, #f9fafb, #ffffff)',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  maxWidth: '700px',
  margin: '3rem auto',
  animation: 'pulse 2s infinite',
  
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.8,
    },
  },
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '2rem 1rem',
  },
  
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
}));

const ErrorContainer = styled(Alert)(({ theme }) => ({
  textAlign: 'center',
  padding: '4rem 3rem',
  fontSize: '1.25rem',
  fontWeight: 500,
  borderRadius: '16px',
  maxWidth: '700px',
  margin: '3rem auto',
  
  [theme.breakpoints.down('md')]: {
    margin: '2rem auto',
    padding: '3rem 2rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    margin: '1rem auto',
    padding: '2rem 1rem',
  },
}));

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
