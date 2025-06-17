import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "vendor" | "company";
  profilePicture?: string; // Add this if you want to include profile picture
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean; // initial auth check tracking
}

const initialState: AuthState = {
  user: null, // start with null
  isLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.isInitialized = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    resetInitialized: (state) => {
      state.isInitialized = false;
    },
  },
});

export const { setUser, logout, setLoading, setInitialized, resetInitialized } = authSlice.actions;
export default authSlice.reducer;