import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "../api";
import { setUser } from "../store/authSlice";

export function useRegister() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("vendor");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        email, name, password, userType,
      });
      toast.success(res.data.message || "Registration successful!");

      const userRes = await api.get("/auth/me");
      dispatch(setUser(userRes.data.user));

      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail, name, setName, password, setPassword,
    userType, setUserType, message, loading, handleSubmit
  };
}
