import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../store/userSlice";
import type { RootState, AppDispatch } from "../../store";

export const useEditProfileData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  
  // RTK selectors
  const { currentUser, loading: userLoading, error: userError } = useSelector((state: RootState) => state.user);
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  // Fetch user data using RTK
  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing.");
      return;
    }
    
    dispatch(fetchUserById(id as string));
  }, [id, dispatch]);

  // Handle RTK loading and error states
  useEffect(() => {
    if (userError) {
      toast.error("Failed to fetch user details.");
    }
  }, [userError]);

  return {
    id,
    currentUser,
    userLoading,
    userError,
    authUser,
    dispatch
  };
};