import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  keyframes,
} from "@mui/material";
import {
  BusinessCenter,
  RequestPage,
  Payment,
  Inventory,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import ProductRequests from "./ProductRequests";
import PaymentRequests from "./PaymentRequests";
import { toast } from "react-toastify";
import { setUser, logout, setLoading, setInitialized } from "../store/authSlice";

// Define RootState type for useSelector
interface RootState {
  auth: {
    user: {
      _id: string;
      email: string;
      name: string;
      userType: "vendor" | "company";
    } | null;
    isLoading: boolean;
    isInitialized: boolean;
  };
}

// Keyframes for animations
const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInSoft = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
`;

// Glassmorphic Navigation Container
const NavigationContainer = styled(Box)(({ /*theme*/ }) => ({
  display: 'flex',
  gap: '1rem',
  marginTop: '3.15rem',
  marginBottom: '2rem',
  padding: '1.5rem',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  animation: `${slideInFromLeft} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    pointerEvents: 'none',
  },
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '0.75rem',
  },
}));

const NavigationButton = styled(Button)(({ /*theme*/ }) => ({
  flex: 1,
  minHeight: '60px',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#1e293b',
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0 1.5rem',
 
  // Container for all four lines
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `
      linear-gradient(90deg, #1e293b, #334155) 0 0/0 3px no-repeat,
      linear-gradient(270deg, #1e293b, #334155) 100% 100%/0 3px no-repeat,
      linear-gradient(0deg, #1e293b, #334155) 0 100%/3px 0 no-repeat,
      linear-gradient(180deg, #1e293b, #334155) 100% 0/3px 0 no-repeat
    `,
    transition: 'background-size 0.3s ease',
  },
 
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&::before': {
      background: `
        linear-gradient(90deg, #1e293b, #334155) 0 0/100% 3px no-repeat,
        linear-gradient(270deg, #1e293b, #334155) 100% 100%/100% 3px no-repeat,
        linear-gradient(0deg, #1e293b, #334155) 0 100%/3px 100% no-repeat,
        linear-gradient(180deg, #1e293b, #334155) 100% 0/3px 100% no-repeat
      `,
    },
  },
 
  '& .MuiSvgIcon-root': {
    fontSize: '1.4rem',
    opacity: 0.8,
  },
}));

const SectionContainer = styled(Box)(({ /*theme*/ }) => ({
  marginBottom: '3rem',
  padding: '2rem',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  scrollMarginTop: '2rem',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
}));

// Styled components
const DashboardContainer = styled(Box)(({ /*theme*/ }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  padding: '2rem',
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  color: '#1e293b',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    backgroundRepeat: 'repeat',
    animation: `${float} 20s linear infinite`,
    zIndex: -1,
    pointerEvents: 'none',
  },
}));

const DashboardHeader = styled(Typography)(({ /*theme*/ }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  marginBottom: '2rem',
  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  position: 'relative',
  animation: `${slideInDown} 0.8s ease-out`,
  textAlign: 'center',
  textShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
}));

const DashboardSubheader = styled(Typography)(({ /*theme*/ }) => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  margin: '2rem 0 1.5rem',
  color: '#475569',
  position: 'relative',
  paddingLeft: '1rem',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '100%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '2px',
  },
}));

const LoadingContainer = styled(Box)(({ /*theme*/ }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  fontSize: '1.5rem',
  color: '#64748b',
  fontWeight: 600,
  animation: `${fadeInSoft} 0.5s ease-in`,
  gap: '1rem',
}));

const LoadingSpinner = styled(Box)(({ /*theme*/ }) => ({
  width: '24px',
  height: '24px',
  border: '3px solid rgba(59, 130, 246, 0.3)',
  borderTop: '3px solid #3b82f6',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
}));

const StyledButton = styled(Button)<{ buttontype: 'profile' | 'logout' }>(({ /*theme,*/ buttontype: buttonType }) => ({
  position: 'absolute',
  width: '120px',
  height: '50px',
  border: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 1000,
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  userSelect: 'none',
  textTransform: 'none',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.4s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
  ...(buttonType === 'profile' && {
    top: '2.15rem',
    right: '3rem',
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(31, 41, 55, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(31, 41, 55, 0.5)',
    },
  }),
  ...(buttonType === 'logout' && {
    top: '7.15rem',
    right: '3rem',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
    '&:hover': {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.5)',
    },
  }),
}));

export default function Dashboard() {
  const { user, isLoading, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    // Only fetch user data if not already initialized
    if (!isInitialized) {
      dispatch(setLoading(true));
     
      api
        .get("/auth/me")
        .then(res => {
          const fetchedUser = res.data.user;
          if (
            fetchedUser?._id &&
            fetchedUser?.email &&
            (fetchedUser.userType === "vendor" || fetchedUser.userType === "company")
          ) {
            dispatch(setUser(fetchedUser));
          } else {
            console.warn("User data incomplete or invalid:", fetchedUser);
            toast.error("Invalid user session. Please log in again.");
            dispatch(setUser(null));
            navigate("/login");
          }
        })
        .catch(err => {
          console.error("Auth check failed:", err);
          toast.error(err.response?.data?.error || "Authentication failed. Please log in again.");
          dispatch(setUser(null));
          navigate("/login");
        })
        .finally(() => {
          dispatch(setLoading(false));
          dispatch(setInitialized());
        });
    }
  }, [dispatch, navigate, isInitialized]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.error || "Logout failed. Please try again.");
    }
  };

  const goToProfile = () => {
    if (user?._id) {
      navigate(`/user/${user._id}`);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        Loading user data...
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (!user) {
    return (
      <LoadingContainer>
        Not authorized
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader variant="h1">Welcome, {user.name}</DashboardHeader>
      
      <StyledButton buttontype="profile" onClick={goToProfile}>
        Profile
      </StyledButton>
      <StyledButton buttontype="logout" onClick={handleLogout}>
        Logout
      </StyledButton>

      {user.userType === "vendor" && (
        <>
          <DashboardSubheader variant="h2">Vendor Dashboard</DashboardSubheader>
          
          <NavigationContainer>
            <NavigationButton onClick={() => scrollToSection('product-management')}>
              <Inventory />
              Product Management
            </NavigationButton>
            <NavigationButton onClick={() => scrollToSection('product-requests')}>
              <RequestPage />
              Product Requests
            </NavigationButton>
          </NavigationContainer>

          <SectionContainer id="product-management">
            <ProductManagement />
          </SectionContainer>
          
          <SectionContainer id="product-requests">
            <ProductRequests />
          </SectionContainer>
        </>
      )}

      {user.userType === "company" && (
        <>
          <DashboardSubheader variant="h2">Company Dashboard</DashboardSubheader>
          
          <NavigationContainer>
            <NavigationButton onClick={() => scrollToSection('product-list')}>
              <BusinessCenter />
              Product Catalog
            </NavigationButton>
            <NavigationButton onClick={() => scrollToSection('payment-requests')}>
              <Payment />
              Payment Requests
            </NavigationButton>
          </NavigationContainer>

          <SectionContainer id="product-list">
            <ProductList />
          </SectionContainer>
          
          <SectionContainer id="payment-requests">
            <PaymentRequests />
          </SectionContainer>
        </>
      )}
    </DashboardContainer>
  );
}
