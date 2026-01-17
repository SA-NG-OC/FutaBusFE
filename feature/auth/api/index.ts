/**
 * Auth API Service
 * 
 * Handles authentication-related API calls:
 * - Login
 * - Register
 * - Forgot password
 * - Reset password
 * - Refresh token
 */

import { api, API_BASE_URL } from '@/shared/utils/apiClient';

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  emailOrPhone: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  refreshToken: string;
}

/**
 * Login user
 */
export async function login(request: LoginRequest): Promise<AuthResponse> {
  console.log('[Auth API] Login request:', { emailOrPhone: request.emailOrPhone });
  console.log('[Auth API] Calling:', `${API_BASE_URL}/auth/login`);
  
  try {
    const data = await api.post<AuthResponse>('/auth/login', request);
    console.log('[Auth API] Login successful');
    return data;
  } catch (error) {
    console.error('[Auth API] Login failed:', error);
    throw error;
  }
}

/**
 * Register new user
 */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  console.log('[Auth API] Register request:', { email: request.email, fullName: request.fullName });
  console.log('[Auth API] Calling:', `${API_BASE_URL}/auth/register`);
  
  try {
    const data = await api.post<AuthResponse>('/auth/register', request);
    console.log('[Auth API] Register successful');
    return data;
  } catch (error) {
    console.error('[Auth API] Register failed:', error);
    throw error;
  }
}

/**
 * Request password reset (sends email/SMS with reset link)
 */
export async function forgotPassword(request: ForgotPasswordRequest): Promise<string> {
  try {
    const data = await api.post<string>('/auth/forgot-password', request);
    return data || 'Reset link sent successfully';
  } catch (error) {
    console.error('[Auth API] Forgot password failed:', error);
    throw error;
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(request: ResetPasswordRequest): Promise<string> {
  try {
    const data = await api.post<string>('/auth/reset-password', request);
    return data || 'Password reset successfully';
  } catch (error) {
    console.error('[Auth API] Reset password failed:', error);
    throw error;
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  try {
    const data = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  } catch (error) {
    console.error('[Auth API] Refresh token failed:', error);
    throw error;
  }
}

/**
 * Validate reset password token
 */
export async function validateResetToken(token: string): Promise<boolean> {
  try {
    await api.get<string>(`/auth/reset-password?token=${token}`);
    return true;
  } catch (error) {
    console.error('[Auth API] Token validation failed:', error);
    return false;
  }
}
