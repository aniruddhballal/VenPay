// (Composer hook)
import { useEditProfileData } from './useEditProfileData';
import { useEditProfileForm } from './useEditProfileForm';
import { useProfilePicture } from './useProfilePicture';
import { usePasswordChange } from './usePasswordChange';
import { useEditProfileSubmit } from './useEditProfileSubmit';

export const useEditProfile = () => {
  const {
    id,
    currentUser,
    userLoading,
    userError,
    authUser,
    dispatch
  } = useEditProfileData();

  const {
    name,
    email,
    userType,
    focusedField,
    setName,
    setEmail,
    setUserType,
    setFocusedField,
  } = useEditProfileForm(currentUser);

  const {
    profilePicture,
    profilePicturePreview,
    fileInputRef,
    handleProfilePictureChange,
    handleProfilePictureClick,
  } = useProfilePicture(currentUser);

  const {
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
  } = usePasswordChange();

  const {
    saving,
    handleSubmit: baseHandleSubmit,
    handleBack,
  } = useEditProfileSubmit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    baseHandleSubmit({
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
    });
  };

  return {
    // State values
    name,
    email,
    userType,
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
    
    // setters
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