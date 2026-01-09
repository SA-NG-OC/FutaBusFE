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
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: credentials.emailOrPhone,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const result: AuthResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }

      const { accessToken, refreshToken, userId, email, fullName, role } = result.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Create user object (will be enriched with full details later if needed)
      const userData: User = {
        userId,
        fullName,
        email,
        phoneNumber: '', // Will be filled from user profile endpoint if needed
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
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }

      const result: AuthResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Đăng ký thất bại');
      }

      // Auto-login after registration
      await login({
        emailOrPhone: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  /**
   * Logout user and clear all stored data
   */
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    setToken(null);
    setUser(null);
  };

  /**
   * Refresh access token using refresh token
   */
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storedRefreshToken),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result: AuthResponse = await response.json();

      if (result.success) {
        const { accessToken, refreshToken: newRefreshToken } = result.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setToken(accessToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
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
