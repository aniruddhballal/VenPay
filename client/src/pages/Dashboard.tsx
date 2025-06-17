import { useEffect } from 'react';

import ConnectingLines from './ConnectingLines'; // adjust path if needed

import { useSelector, useDispatch } from "react-redux";
import {
  BusinessCenter,
  RequestPage,
  Payment,
  Inventory,
  AccountCircle,
} from "@mui/icons-material";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import ProductList from "./ProductList";
import ProductRequests from "./ProductRequests";
import PaymentRequests from "./PaymentRequests";
import { toast } from "react-toastify";
import { setUser, logout, setLoading, setInitialized } from "../store/authSlice";

import {
  DashboardContainer, DashboardHeader, DashboardSubheader, NavigationContainer, NavigationButton,
  NavigationButton2, SectionContainer, LoadingContainer, LoadingSpinner, StyledButton,
  ProfileButton, ProfileImage } from "../styles/dashboardStyles";

// Define RootState type for useSelector
interface RootState {
  auth: {
    user: {
      _id: string;
      email: string;
      name: string;
      userType: "vendor" | "company";
      profilePicture?: string;
    } | null;
    isLoading: boolean;
    isInitialized: boolean;
  };
}

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
    <div style={{ position: 'absolute', zIndex: 0, top: 0, left: 0, width: '100%', height: '100%' }}>
      <ConnectingLines />
    </div>      
      <DashboardHeader variant="h1">Welcome, {user.name}</DashboardHeader>
      
      <ProfileButton onClick={goToProfile}>
        {user.profilePicture ? (
          <ProfileImage src={user.profilePicture} alt={`${user.name}'s profile`} />
        ) : (
          <AccountCircle />
        )}
      </ProfileButton>
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
            <NavigationButton2 onClick={() => scrollToSection('product-requests')}>
              <RequestPage />
              Product Requests
            </NavigationButton2>
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
            <NavigationButton2 onClick={() => scrollToSection('payment-requests')}>
              <Payment />
              Payment Requests
            </NavigationButton2>
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
