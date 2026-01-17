'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


/**
 * User interface matching backend User entity
 */
export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avt?: string; // Avatar URL from backend
  role: {
    roleId: number;
    roleName: 'ADMIN' | 'USER' | 'DRIVER' | 'STAFF';
  };
  status: string;
}

/**
 * Auth response from backend /auth/login endpoint
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    email: string;
    fullName: string;
    avt?: string;
    role: string;
    expiresIn: number;
  };
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register credentials
 */
export interface RegisterCredentials {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

/**
 * AuthProvider - Wraps entire app to provide authentication state
 * Place in root layout to make auth available everywhere
 * 
 * Features:
 * - Persistent login (localStorage)
 * - Auto token refresh
 * - Centralized login modal state
 * - Role-based access control
 */
export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Login user with email/phone and password
   */
  const login = async (credentials: LoginCredentials) => {
    console.log('[AuthContext] Login request started:', { emailOrPhone: credentials.emailOrPhone });
    
    try {
      console.log('[AuthContext] Sending login request to:', `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: credentials.emailOrPhone,
          password: credentials.password,
        }),
      });

      console.log('[AuthContext] Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AuthContext] Login failed - Response not OK:', errorData);
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const result: AuthResponse = await response.json();
      console.log('[AuthContext] Login response:', { success: result.success, message: result.message });

      if (!result.success) {
        console.error('[AuthContext] Login failed - Success false:', result.message);
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      const { accessToken, refreshToken, userId, email, fullName, avt, role } = result.data;
      console.log('[AuthContext] User logged in:', { userId, email, fullName, role });

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('[AuthContext] Tokens stored in localStorage');
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        console.log('[AuthContext] Remember me enabled');
      }

      // Create user object (will be enriched with full details later if needed)
      const userData: User = {
        userId,
        fullName,
        email,
        phoneNumber: '', // Will be filled from user profile endpoint if needed
        avt, // Avatar URL from backend
        role: {
          roleId: role === 'ADMIN' ? 1 : role === 'DRIVER' ? 3 : role === 'STAFF' ? 4 : 2,
          roleName: role as 'ADMIN' | 'USER' | 'DRIVER' | 'STAFF',
        },
        status: 'Active',
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      setIsLoginModalOpen(false);
      
      console.log('[AuthContext] Login successful, user role:', userData.role.roleName);
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (credentials: RegisterCredentials) => {
    console.log('[AuthContext] Register request started:', { email: credentials.email, fullName: credentials.fullName });
    
    try {
      console.log('[AuthContext] Sending register request to:', `${API_BASE_URL}/auth/register`);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      console.log('[AuthContext] Register response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AuthContext] Register failed - Response not OK:', errorData);
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      const result: AuthResponse = await response.json();
      console.log('[AuthContext] Register response:', { success: result.success, message: result.message });

      if (!result.success) {
        console.error('[AuthContext] Register failed - Success false:', result.message);
        throw new Error(result.message || 'Đăng ký thất bại');
      }

      console.log('[AuthContext] Registration successful, auto-logging in...');
      // Auto-login after registration
      await login({
        emailOrPhone: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error('[AuthContext] Register error:', error);
      throw error;
    }
  };

  /**
   * Logout user and clear all stored data
   */
  const logout = () => {
    console.log('[AuthContext] Logging out user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    setToken(null);
    setUser(null);
    console.log('[AuthContext] User logged out, all data cleared');
  };

  /**
   * Refresh access token using refresh token
   */
  const refreshToken = async () => {
    console.log('[AuthContext] Token refresh started');
    
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        console.error('[AuthContext] No refresh token available');
        throw new Error('No refresh token available');
      }

      console.log('[AuthContext] Sending refresh token request to:', `${API_BASE_URL}/auth/refresh`);
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storedRefreshToken),
      });

      console.log('[AuthContext] Refresh token response status:', response.status);

      if (!response.ok) {
        console.error('[AuthContext] Token refresh failed - Response not OK');
        throw new Error('Token refresh failed');
      }

      const result: AuthResponse = await response.json();
      console.log('[AuthContext] Refresh token response:', { success: result.success });

      if (result.success) {
        const { accessToken, refreshToken: newRefreshToken } = result.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setToken(accessToken);
        console.log('[AuthContext] Token refreshed successfully');
      } else {
        console.warn('[AuthContext] Token refresh failed - Success false, logging out');
        logout();
      }
    } catch (error) {
      console.error('[AuthContext] Token refresh error:', error);
      logout();
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Must be used inside AuthProvider
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
