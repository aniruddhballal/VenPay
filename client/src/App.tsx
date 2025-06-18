import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDisplay from "./pages/ProductDisplay";
import UserDisplay from "./pages/UserDisplay";
import EditProfile from "./pages/EditProfile";
import AuthProvider from "./components/AuthProvider";
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
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
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
