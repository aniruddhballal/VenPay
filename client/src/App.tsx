import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductDisplay from "./pages/ProductDisplay";
import UserDisplay from "./pages/UserDisplay";
import EditProfile from "./pages/EditProfile"; // 👈 Make sure this import exists
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider

import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap app in AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product/:id" element={<ProductDisplay />} />
          <Route path="/user/:id" element={<UserDisplay />} />
          <Route path="/edit-profile/:id" element={<EditProfile />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
