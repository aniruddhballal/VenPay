import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OutlinedInput } from '@mui/material';
import { 
  Box, 
  CardContent, 
  Typography, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  CircularProgress, 
  Stack,
  Fade,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
  Card
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';

import { 
  StyledContainer, 
  StyledCard, 
  Title, 
  StyledForm, 
  FieldGroup, 
  StyledSelect, 
  StyledLoadingButton, 
  BackButton,
  LoadingContainer, 
  ErrorContainer 
} from '../styles/editProfileStyles';

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "company" | "vendor";
  profilePicture?: string;
}

export default function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User data states
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  
  // Profile picture states
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  // UI states
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
        if (res.data.profilePicture) {
          setProfilePicturePreview(res.data.profilePicture);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const validatePassword = () => {
    if (!changePassword) return true;
    
    if (!currentPassword) {
      toast.error("Current password is required.");
      return false;
    }
    
    if (!newPassword) {
      toast.error("New password is required.");
      return false;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('userType', userType);
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      
      if (changePassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }
      
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success("Profile updated successfully!");
      navigate(`/dashboard`);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
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
              {/* Profile Picture Section */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={profilePicturePreview}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      cursor: 'pointer',
                      border: '4px solid #e5e7eb',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}
                    onClick={handleProfilePictureClick}
                  >
                    {!profilePicturePreview && <PersonIcon sx={{ fontSize: 60 }} />}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        backgroundColor: '#2563eb'
                      }
                    }}
                    onClick={handleProfilePictureClick}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </Box>
              </Box>

              {/* Basic Information */}
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
                      left: 50,
                      top: 21,
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
                    notched: false,
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
                    shrink={true}
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
                        notched={false}
                        label="Account Type"
                      />
                    }
                  >
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

              {/* Password Section */}
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Security Settings
                </Typography>
              </Divider>

              <Card 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: changePassword ? '#f8fafc' : '#fafafa',
                  border: changePassword ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setChangePassword(!changePassword)}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LockIcon color={changePassword ? 'primary' : 'action'} />
                  <Box>
                    <Typography variant="body1" fontWeight={changePassword ? 600 : 400}>
                      Change Password
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {changePassword ? 'Click to cancel password change' : 'Click to update your password'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              {changePassword && (
                <Fade in timeout={400}>
                  <Box>
                    <FieldGroup
                      focused={focusedField === 'currentPassword'}
                      hasValue={!!currentPassword}
                      isValid={currentPassword.length > 0}
                    >
                      <TextField
                        fullWidth
                        type={showCurrentPassword ? 'text' : 'password'}
                        label="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        onFocus={() => setFocusedField('currentPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="Enter your current password"
                        InputLabelProps={{
                          sx: {
                            left: 50,
                            top: 21,
                            backgroundColor: 'white',
                            px: 0.5,
                          },
                        }}
                        InputProps={{
                          notched: false,
                          startAdornment: (
                            <VpnKeyIcon sx={{ color: 'action.active', mr: 1.5, paddingLeft: '20px', paddingRight: '125px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                edge="end"
                              >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup
                      focused={focusedField === 'newPassword'}
                      hasValue={!!newPassword}
                      isValid={newPassword.length >= 6}
                    >
                      <TextField
                        fullWidth
                        type={showNewPassword ? 'text' : 'password'}
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setFocusedField('newPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="Enter your new password"
                        InputLabelProps={{
                          sx: {
                            left: 50,
                            top: 21,
                            backgroundColor: 'white',
                            px: 0.5,
                          },
                        }}
                        InputProps={{
                          notched: false,
                          startAdornment: (
                            <LockIcon sx={{ color: 'action.active', mr: 1.5, paddingLeft: '20px', paddingRight: '125px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FieldGroup>

                    <FieldGroup
                      focused={focusedField === 'confirmPassword'}
                      hasValue={!!confirmPassword}
                      isValid={confirmPassword === newPassword && confirmPassword.length > 0}
                    >
                      <TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="Confirm your new password"
                        error={confirmPassword.length > 0 && confirmPassword !== newPassword}
                        helperText={
                          confirmPassword.length > 0 && confirmPassword !== newPassword 
                            ? "Passwords do not match" 
                            : ""
                        }
                        InputLabelProps={{
                          sx: {
                            left: 50,
                            top: 21,
                            backgroundColor: 'white',
                            px: 0.5,
                          },
                        }}
                        InputProps={{
                          notched: false,
                          startAdornment: (
                            <LockIcon sx={{ color: 'action.active', mr: 1.5, paddingLeft: '20px', paddingRight: '125px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FieldGroup>
                  </Box>
                </Fade>
              )}

              {/* Action Buttons */}
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