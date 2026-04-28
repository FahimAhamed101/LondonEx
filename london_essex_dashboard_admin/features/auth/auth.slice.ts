import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/features/auth/auth.types";

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  recoveryEmail: string | null;
  verifiedOtp: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  recoveryEmail: null,
  verifiedOtp: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken?: string | null;
        user: User | null;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.user = action.payload.user;
    },
    setRecoveryEmail: (state, action: PayloadAction<string | null>) => {
      state.recoveryEmail = action.payload;
    },
    setVerifiedOtp: (state, action: PayloadAction<string | null>) => {
      state.verifiedOtp = action.payload;
    },
    clearAuthState: () => initialState,
  },
});

export const {
  clearAuthState,
  setCredentials,
  setRecoveryEmail,
  setVerifiedOtp,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
