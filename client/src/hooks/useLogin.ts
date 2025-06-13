import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      toast.success(res.data.message || "Logged in!");
      const userRes = await api.get("/auth/me");
      dispatch(setUser(userRes.data.user));
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Login failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, message, loading, handleSubmit };
};
