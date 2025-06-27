import { useState } from "react";
import { toast } from "react-toastify";

export const usePasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const validatePassword = () => {
    if (!changePassword) return true;
    
    if (!currentPassword) {
      toast.error("Current password is required.");
      return false;
    }
    
    if (!newPassword) {
      toast.error("New password is required.");
      return false;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return false;
    }
    
    return true;
  };

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    changePassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setChangePassword,
    validatePassword,
  };
};