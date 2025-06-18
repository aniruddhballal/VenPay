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
            <Title component="h1" sx={{ marginBottom: '2rem' }}>
              User Profile
            </Title>

            {/* Horizontal Layout: Profile Picture + User Info */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: '2rem', md: '3rem' },
              marginBottom: '3rem',
              alignItems: { xs: 'center', md: 'flex-start' }
            }}>
              {/* Profile Picture */}
              <Box sx={{
                width: { xs: '300px', md: '360px' },
                height: { xs: '300px', md: '360px' },
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                flexShrink: 0,
              }}>
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={`${user.name}'s profile`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
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
                  style={{ 
                    display: user.profilePicture ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    color: '#9ca3af',
                    fontSize: '4rem'
                  }}
                >
                  <PersonIcon fontSize="inherit" />
                </Box>
              </Box>

              {/* User Information */}
              <Box sx={{ 
                flex: 1, 
                width: { xs: '100%', md: 'auto' },
                textAlign: { xs: 'center', md: 'left' }
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    marginBottom: '1rem', 
                    color: '#1f2937', 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' }
                  }}
                >
                  {user.name}
                </Typography>

                <Box>
                  <InfoRow sx={{ marginBottom: '1rem' }}>
                    <InfoLabel className="info-label">
                      <BadgeIcon fontSize="small" className="info-icon" />
                      User ID
                    </InfoLabel>
                    <InfoValue className="info-value" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {user._id}
                    </InfoValue>
                  </InfoRow>

                  <InfoRow sx={{ marginBottom: '1rem' }}>
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
              </Box>
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
                Back to Dashboard
              </SecondaryButton>
            </Stack>
          </CardContent>
        </StyledCard>
      </Fade>
    </StyledContainer>
  );
}
