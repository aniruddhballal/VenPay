import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import { resetInitialized, setUser } from "../../store/authSlice";
import { fetchUserById, clearUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store";

interface SubmitParams {
  id: string | undefined;
  currentUser: any;
  authUser: any;
  dispatch: AppDispatch;
  name: string;
  email: string;
  userType: "company" | "vendor";
  profilePicture: File | null;
  changePassword: boolean;
  currentPassword: string;
  newPassword: string;
  validatePassword: () => boolean;
}

export const useEditProfileSubmit = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (params: SubmitParams) => {
    const {
      id,
      currentUser,
      authUser,
      dispatch,
      name,
      email,
      userType,
      profilePicture,
      changePassword,
      currentPassword,
      newPassword,
      validatePassword
    } = params;

    if (!validatePassword()) {
      return;
    }

    // Check for changes using RTK store data
    const hasChanged =
      name !== currentUser?.name ||
      email !== currentUser?.email ||
      userType !== currentUser?.userType ||
      !!profilePicture ||
      (changePassword && currentPassword && newPassword);

    if (!hasChanged) {
      toast.info("No changes detected.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('userType', userType);

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      if (changePassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      const response = await api.put(`/users/${id as string}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      
      // Update both auth and user slices with new data
      const updatedUser = response.data;
      
      // Update auth slice if this is the current authenticated user
      if (authUser && authUser._id === id) {
        dispatch(setUser(updatedUser));
      }
      
      // Clear and refetch user data to ensure consistency
      dispatch(clearUser());
      dispatch(fetchUserById(id as string));
      
      // Reset initialization to trigger auth refetch if needed
      dispatch(resetInitialized());
      
      navigate(`/dashboard`);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return {
    saving,
    handleSubmit,
    handleBack,
  };
};