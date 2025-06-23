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

import { useEditProfile } from '../hooks/useEditProfile';

export default function EditProfile() {
  const {
    // State values
    name,
    email,
    userType,
    profilePicturePreview,
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    changePassword,
    saving,
    focusedField,
    fileInputRef,
    
    // rtk
    currentUser,
    userLoading,
    userError,
    
    // set the states here, modularise further
    setName,
    setEmail,
    setUserType,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setChangePassword,
    setFocusedField,
    
    // action handling
    handleProfilePictureChange,
    handleProfilePictureClick,
    handleSubmit,
    handleBack,
  } = useEditProfile();

  // Loading state from RTK
  if (userLoading) {
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

  // RTK errors if any
  if (userError && !currentUser) {
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
              <Divider sx={{ my: 0 }}>
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
                            <VpnKeyIcon sx={{ color: 'action.active', mr: 0, paddingLeft: '20px', paddingRight: '175px'}} />
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <CameraIconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                sx={{
                                  marginRight: '20px',
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
                                  marginRight: '20px',
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
                                  marginRight: '20px',
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