import { useState, useEffect } from "react";

interface User {
  name?: string;
  email?: string;
  userType?: "company" | "vendor";
  profilePicture?: string;
}

export const useEditProfileForm = (currentUser: User | null) => {
  // Form states initialized from redux
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "vendor">("company");
  const [focusedField, setFocusedField] = useState<string>("");

  // Update form fields when user data is loaded from RTK store
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setUserType(currentUser.userType || "company");
    }
  }, [currentUser]);

  return {
    name,
    email,
    userType,
    focusedField,
    setName,
    setEmail,
    setUserType,
    setFocusedField,
  };
};