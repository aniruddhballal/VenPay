// store/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: "vendor" | "company";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean; // Track if we've done initial auth check
}

const initialState: AuthState = {
  user: null, // Start with null, no localStorage
  isLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserRedux: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setUserRedux, logout, setLoading, setInitialized } = authSlice.actions;
export default authSlice.reducer;