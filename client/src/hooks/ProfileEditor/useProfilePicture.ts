import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  profilePicture?: string;
}

export const useProfilePicture = (currentUser: User | null) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");

  // Set initial profile picture preview
  useEffect(() => {
    if (currentUser?.profilePicture) {
      setProfilePicturePreview(currentUser.profilePicture);
    }
  }, [currentUser]);

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

  return {
    profilePicture,
    profilePicturePreview,
    fileInputRef,
    handleProfilePictureChange,
    handleProfilePictureClick,
  };
};