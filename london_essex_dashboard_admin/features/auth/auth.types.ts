export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  role: "admin";
  adminSetupSecret: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  email?: string;
  token?: string;
};

export type AuthenticatedUserResponse = {
  user: User;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
