// src/api/api.ts
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api";
let hasShownAuthError = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor (optional: add auth headers here if needed)
api.interceptors.request.use(
  (config) => {
    // Example: attach token if available
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || "Something went wrong";

    const isInternalCheck = error.config?.headers?.['X-Internal-Check'];

    if (status === 401) {
      if (isInternalCheck) {
        // Silent fail for background auth checks
        return Promise.reject(error);
      }

      if (!hasShownAuthError) {
        toast.error(message);
        hasShownAuthError = true;
      }

      return Promise.reject(error);
    }

    // For all other non-401 errors, always show toast
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
