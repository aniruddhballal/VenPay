import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { OutlinedInput } from '@mui/material';
import { 
  Box, CardContent, Typography, TextField, MenuItem, FormControl, InputLabel,
  CircularProgress, Stack, Fade, InputAdornment, Divider
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
  StyledContainer, StyledCard, Title, StyledForm, FieldGroup, StyledSelect, StyledLoadingButton, 
  BackButton, LoadingContainer, ErrorContainer,
  // New style imports
  ProfilePictureContainer, ProfilePictureWrapper, StyledAvatar, CameraIconButton, HiddenFileInput,
  PasswordToggleCard, PasswordFieldsContainer, ActionButtonsContainer, FlexButton
} from '../styles/editProfileStyles';

import { useDispatch } from "react-redux";
import { resetInitialized } from "../store/authSlice"; // Adjust path as needed

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "company" | "vendor";
  profilePicture?: string;
}

export default function EditProfile() {

  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User data states
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  
  // pfp states
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
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file.");
        return;
      }
      
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

      // Reset the initialized state so Dashboard re-fetches user data
      dispatch(resetInitialized()); // Add this line

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
              <ProfilePictureContainer>
                <ProfilePictureWrapper>
                  <StyledAvatar
                    src={profilePicturePreview}
                    onClick={handleProfilePictureClick}
                  >
                    {!profilePicturePreview && <PersonIcon sx={{ fontSize: 60 }} />}
                  </StyledAvatar>
                  <CameraIconButton onClick={handleProfilePictureClick}>
                    <PhotoCameraIcon />
                  </CameraIconButton>
                  <HiddenFileInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                  />
                </ProfilePictureWrapper>
              </ProfilePictureContainer>

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
                    onChange={(e: any) => setUserType(e.target.value as 'company' | 'vendor')}
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

              <PasswordToggleCard 
                active={changePassword}
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
              </PasswordToggleCard>

              {changePassword && (
                <Fade in timeout={400}>
                  <PasswordFieldsContainer>
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
                            <VpnKeyIcon sx={{ color: 'action.active', mr: 0, paddingLeft: '20px', paddingRight: '180px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <CameraIconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                sx={{
                                  paddingRight: '20px',
                                  position: 'static',
                                  backgroundColor: 'transparent',
                                  color: 'action.active',
                                  width: 'auto',
                                  height: 'auto',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                              </CameraIconButton>
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
                            <LockIcon sx={{ color: 'action.active', mr: 0, paddingLeft: '20px', paddingRight: '150px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <CameraIconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                sx={{
                                  paddingRight: '20px',
                                  position: 'static',
                                  backgroundColor: 'transparent',
                                  color: 'action.active',
                                  width: 'auto',
                                  height: 'auto',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                              </CameraIconButton>
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
                        label="Confirmation"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="Re-enter your new password"
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
                            <LockIcon sx={{ color: 'action.active', mr: 0, paddingLeft: '20px', paddingRight: '150px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <CameraIconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                sx={{
                                  paddingRight: '20px',
                                  position: 'static',
                                  backgroundColor: 'transparent',
                                  color: 'action.active',
                                  width: 'auto',
                                  height: 'auto',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </CameraIconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FieldGroup>
                  </PasswordFieldsContainer>
                </Fade>
              )}

              {/* Action Buttons */}
              <ActionButtonsContainer>
                <FlexButton>
                  <BackButton
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    fullWidth
                  >
                    Back to Profile
                  </BackButton>
                </FlexButton>
                
                <FlexButton>
                  <StyledLoadingButton
                    type="submit"
                    loading={saving}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </StyledLoadingButton>
                </FlexButton>
              </ActionButtonsContainer>
            </StyledForm>
          </CardContent>
        </StyledCard>
      </Fade>
    </StyledContainer>
  );
}