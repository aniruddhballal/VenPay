// api.ts
import axios from "axios";
import { toast } from "react-toastify";

let hasShownAuthError = false;

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if your API URL is different
  withCredentials: true, // important for cookies (like your JWT token)
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error;
    if (message === "Please log in again." && !hasShownAuthError) {
      hasShownAuthError = true;
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;