/**
 * Centralized API Client
 * 
 * Provides a configured axios instance with:
 * - Automatic Bearer token injection
 * - Centralized base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - Automatic error toast notifications
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';

// ========== CONFIG ==========
/**
 * API Base URL - Change this one place to update everywhere
 * Priority: Environment variable > Default localhost
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

// ========== TYPES ==========
/**
 * Standard API Response from backend
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ========== AXIOS INSTANCE ==========
/**
 * Pre-configured axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ========== REQUEST INTERCEPTOR ==========
/**
 * Automatically inject Bearer token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
/**
 * Handle responses and errors uniformly
 */
apiClient.interceptors.response.use(
  (response) => {
    // Check if API returned success: false in response body
    if (response.data && response.data.success === false) {
      const errorMessage = extractErrorMessage(response.data);
      
      // 🔔 Show toast notification for user
      if (typeof window !== 'undefined') {
        toast.error(errorMessage);
      }
      
      return Promise.reject(new Error(errorMessage));
    }
    
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    let errorMessage = 'An unexpected error occurred';
    
    // Handle 401 Unauthorized - could trigger logout or token refresh
    if (error.response?.status === 401) {
      errorMessage = 'Session expired. Please login again.';
      
      if (typeof window !== 'undefined') {
        toast.error(errorMessage);
        // Optional: Clear tokens and redirect to login
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // window.location.href = '/auth/login';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
    
    // Extract error message from response
    if (error.response?.data) {
      errorMessage = extractErrorMessage(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // 🔔 Show toast notification for user
    if (typeof window !== 'undefined') {
      toast.error(errorMessage);
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

// ========== HELPER FUNCTIONS ==========
/**
 * Extract error message from API response
 * Handles validation errors (object with field messages) and simple messages
 */
function extractErrorMessage(payload: ApiResponse): string {
  // Check for validation errors (object format)
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    const validationMessages = Object.values(payload.data);
    if (validationMessages.length > 0) {
      return validationMessages.join('\n');
    }
  }
  
  // Return simple message
  return payload?.message || 'Something went wrong';
}

// ========== CONVENIENCE METHODS ==========
/**
 * Typed GET request
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data as T;
}

/**
 * Typed POST request
 */
export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
}

/**
 * Typed PUT request
 */
export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
}

/**
 * Typed PATCH request
 */
export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
}

/**
 * Typed DELETE request
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data.data as T;
}

// ========== EXPORTS ==========
/**
 * Export the configured axios instance for custom use cases
 */
export default apiClient;

/**
 * Export named methods for cleaner imports
 */
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  client: apiClient, // Direct access to axios instance
};
