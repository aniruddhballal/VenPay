import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetInitialized, setUser } from "../store/authSlice";
import { fetchUserById, clearUser } from "../store/userSlice";
import type { RootState, AppDispatch } from "../store";

export const useEditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // RTK
  const { currentUser, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  
  // Form states - - -  initialized from redux
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  
  // pfp
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");
  
  // pw
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  // overall UI states
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string>("");

  // Fetch user data using RTK
  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing.");
      return;
    }
    
    // Dispatch the async thunk to fetch user data
    dispatch(fetchUserById(id as string));
  }, [id, dispatch]);

  // Update form fields when user data is loaded from RTK store
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setUserType(currentUser.userType || "company");
      if (currentUser.profilePicture) {
        setProfilePicturePreview(currentUser.profilePicture);
      }
    }
  }, [currentUser]);

  // Handle RTK loading and error states
  useEffect(() => {
    if (userError) {
      toast.error("Failed to fetch user details.");
    }
  }, [userError]);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file.");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const response = await axios.put(
        `http://localhost:5000/api/users/${id as string}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

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
    navigate(`/user/${id}`);
  };

  return {
    // State values
    name,
    email,
    userType,
    profilePicture,
    profilePicturePreview,
    currentPassword,
    newPassword,
    confirmPassword,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    changePassword,
    saving,
    focusedField,
    fileInputRef,
    
    // rtk
    currentUser,
    userLoading,
    userError,
    
    // set the states here, modularise further
    setName,
    setEmail,
    setUserType,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setChangePassword,
    setFocusedField,
    
    // action handling
    handleProfilePictureChange,
    handleProfilePictureClick,
    handleSubmit,
    handleBack,
  };
};