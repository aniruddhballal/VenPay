import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "./store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDisplay from "./pages/ProductDisplay";
import UserDisplay from "./pages/UserDisplay";
import EditProfile from "./pages/EditProfile";
import MakePayments from "./pages/MakePayments"; // Import the new payments component
import AuthProvider from "./components/Auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import type { JSX } from "react";

// Protected route logic
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);
 
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>; // Show loading while checking auth
  }
 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
 
  return children;
}

// Profile-specific protected route that checks if user owns the profile
function ProfileProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
 
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>; // Show loading while checking auth
  }
 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if the logged-in user is trying to edit their own profile
  if (id && user._id !== id) {
    return <Navigate to={`/user/${id}`} replace />;   // redirects to that user's display page instead of the requested edit page
  }                                                   // can redirect to one's own profile page > editprfile later?
 
  return children;
}

// Redirect "/" based on login status
function HomeRedirect() {
  const { user, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);
 
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>; // Show loading while checking auth
  }
 
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDisplay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserDisplay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile/:id"
              element={
                <ProfileProtectedRoute>
                  <EditProfile />
                </ProfileProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <MakePayments />
                </ProtectedRoute>
              }
            />
            {/* Optional: Product-specific payment route */}
            {/* <Route
              path="/payments/:productId"
              element={
                <ProtectedRoute>
                  <MakePayments />
                </ProtectedRoute>
              }
            /> */}
            {/* Optional: Subscription payment route */}
            {/* <Route
              path="/subscribe"
              element={
                <ProtectedRoute>
                  <MakePayments />
                </ProtectedRoute>
              }
            /> */}
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5700}
            hideProgressBar={false}
            newestOnTop={true}
            pauseOnHover
            draggable
          />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;