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

const API_BASE_URL = 'http://localhost:5230';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  timestamp: string;
}

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
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data: ApiResponse<AuthResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Đăng nhập thất bại');
  }

  return data.data!;
}

/**
 * Register new user
 */
export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data: ApiResponse<AuthResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Đăng ký thất bại');
  }

  return data.data!;
}

/**
 * Request password reset (sends email/SMS with reset link)
 */
export async function forgotPassword(request: ForgotPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data: ApiResponse<string> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Yêu cầu đặt lại mật khẩu thất bại');
  }

  return data.data || data.message;
}

/**
 * Reset password with token
 */
export async function resetPassword(request: ResetPasswordRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data: ApiResponse<string> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
  }

  return data.data || data.message;
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(refreshToken),
  });

  const data: ApiResponse<AuthResponse> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Làm mới token thất bại');
  }

  return data.data!;
}

/**
 * Validate reset password token
 */
export async function validateResetToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password?token=${token}`);
    const data: ApiResponse<string> = await response.json();
    return data.success;
  } catch (error) {
    return false;
  }
}
