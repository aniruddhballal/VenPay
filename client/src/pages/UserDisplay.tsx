import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUserById } from '../store/userSlice';
import type { RootState, AppDispatch } from '../store'
import {
  Box,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Fade,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

import {
  StyledContainer,
  StyledCard,
  Title,
  InfoRow,
  InfoLabel,
  InfoValue,
  UserTypeChip,
  StyledLoadingButton,
  SecondaryButton,
  LoadingContainer,
  ErrorContainer,
  ProfileSection,
  ProfileImageContainer,
  ProfileName,
  ProfileEmail,
} from '../styles/userDisplayStyles';

export default function UserDisplay() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get data from Redux store instead of local state
  const { currentUser: user, loading, error } = useSelector((state: RootState) => state.user);
  
  // Get logged-in user from Redux store instead of localStorage
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    if (!userId) {
      toast.error("User ID not provided.");
      return;
    }
   
    // Dispatch Redux action instead of manual axios call
    dispatch(fetchUserById(userId));
  }, [userId, dispatch]);

  // Handle error state
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch user.");
    }
  }, [error]);

  if (!userId) {
    return (
      <StyledContainer>
        <ErrorContainer severity="error">
          <Typography variant="h6" sx={{ marginBottom: '0.75rem' }}>
            Invalid user ID
          </Typography>
          <Typography variant="body2">
            The requested user ID is not valid.
          </Typography>
        </ErrorContainer>
      </StyledContainer>
    );
  }

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
          <Typography>Loading user info...</Typography>
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

  const isOwnProfile = loggedInUser && loggedInUser._id === user._id;

  return (
    <StyledContainer>
      <Fade in timeout={800}>
        <StyledCard elevation={0}>
          <CardContent sx={{ padding: '3rem' }}>
            <Title component="h1">
              User Profile
            </Title>

            <ProfileSection>
              <ProfileImageContainer>
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={`${user.name}'s profile`}
                    className="profile-image"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <Box 
                  className="profile-placeholder"
                  style={{ 
                    display: user.profilePicture ? 'none' : 'flex' 
                  }}
                >
                  <PersonIcon fontSize="inherit" />
                </Box>
              </ProfileImageContainer>
              
              <ProfileName>
                {user.name}
              </ProfileName>
              
              <ProfileEmail>
                {user.email}
              </ProfileEmail>
              
              <Box sx={{ marginTop: '1rem' }}>
                <UserTypeChip
                  usertype={user.userType}
                  icon={user.userType === 'company' ? <BusinessIcon /> : <PersonIcon />}
                  label={user.userType}
                />
              </Box>
            </ProfileSection>

            <Typography 
              variant="h6" 
              sx={{ 
                marginBottom: '2rem', 
                color: '#374151', 
                fontWeight: 600,
                fontSize: '1.25rem'
              }}
            >
              Account Details
            </Typography>

            <Box sx={{ marginBottom: '3rem' }}>
              <InfoRow>
                <InfoLabel className="info-label">
                  <BadgeIcon fontSize="small" className="info-icon" />
                  User ID
                </InfoLabel>
                <InfoValue className="info-value" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                  {user._id}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel className="info-label">
                  <PersonIcon fontSize="small" className="info-icon" />
                  Full Name
                </InfoLabel>
                <InfoValue className="info-value">
                  {user.name}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel className="info-label">
                  <EmailIcon fontSize="small" className="info-icon" />
                  Email Address
                </InfoLabel>
                <InfoValue className="info-value">
                  <a href={`mailto:${user.email}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {user.email}
                  </a>
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel className="info-label">
                  <AccountCircleIcon fontSize="small" className="info-icon" />
                  Account Type
                </InfoLabel>
                <Box>
                  <UserTypeChip
                    usertype={user.userType}
                    icon={user.userType === 'company' ? <BusinessIcon /> : <PersonIcon />}
                    label={user.userType}
                  />
                </Box>
              </InfoRow>
            </Box>

            <Divider sx={{ marginY: '2rem' }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {isOwnProfile && (
                <StyledLoadingButton
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/edit-profile/${user._id}`)}
                  sx={{ flex: 1 }}
                >
                  Edit Profile
                </StyledLoadingButton>
              )}
              
              <SecondaryButton
                startIcon={<DashboardIcon />}
                onClick={() => navigate(-1)}
                sx={{ flex: 1 }}
              >
                Go Back
              </SecondaryButton>
            </Stack>
          </CardContent>
        </StyledCard>
      </Fade>
    </StyledContainer>
  );
}
