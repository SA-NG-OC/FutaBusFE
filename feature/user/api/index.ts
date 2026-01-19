import { 
  CustomerFilterRequest, 
  CustomerListResponse, 
  ProfileData, 
  UpdateProfileRequest, 
  UpdatePasswordRequest,
  User,
  ActivityLogFilterRequest,
  ActivityLogResponse
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userApi = {
  // ==================== Customer Management ====================
  
  /**
   * Get all customers (users with role USER)
   */
  getCustomers: async (params: CustomerFilterRequest = {}): Promise<CustomerListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const response = await fetch(`${API_BASE}/users/customers?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch customers');
    return data.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: number): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.data;
  },

  /**
   * Update user status (Lock/Unlock account)
   */
  updateUserStatus: async (userId: number, status: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${userId}/status?status=${status}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user status');
    return data.data;
  },

  /**
   * Get customer's tickets/bookings
   */
  getCustomerTickets: async (userId: number, page: number = 0, size: number = 10) => {
    const response = await fetch(
      `${API_BASE}/bookings/user/${userId}?page=${page}&size=${size}`,
      { headers: getAuthHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch customer tickets');
    return data.data;
  },

  // ==================== Profile Management ====================

  /**
   * Get current user's profile
   */
  getMyProfile: async (): Promise<ProfileData> => {
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data.data;
  },

  /**
   * Update current user's profile
   */
  updateMyProfile: async (request: UpdateProfileRequest): Promise<ProfileData> => {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data.data;
  },

  /**
   * Update current user's password
   */
  updateMyPassword: async (request: UpdatePasswordRequest): Promise<void> => {
    const response = await fetch(`${API_BASE}/users/profile/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update password');
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<ProfileData> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/users/profile/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to upload avatar');
    return data.data; // Returns ProfileResponseDTO
  },

  // ==================== Activity Logs (Audit Logs) ====================

  /**
   * Get audit logs with filters (for admin)
   */
  getActivityLogs: async (params: ActivityLogFilterRequest = {}): Promise<ActivityLogResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.userId) queryParams.append('userId', params.userId.toString());
    if (params.action) queryParams.append('action', params.action);
    if (params.tableName) queryParams.append('tableName', params.tableName);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE}/audit-logs?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch activity logs');
    return data.data;
  },

  /**
   * Get audit logs for a specific user
   */
  getUserActivityLogs: async (userId: number, page: number = 0, size: number = 20): Promise<ActivityLogResponse> => {
    const response = await fetch(
      `${API_BASE}/audit-logs/user/${userId}?page=${page}&size=${size}`,
      { headers: getAuthHeaders() }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user activity logs');
    return data.data;
  },

  /**
   * Get staff activity logs (employees with STAFF role)
   */
  getStaffActivityLogs: async (params: ActivityLogFilterRequest = {}): Promise<ActivityLogResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.action) queryParams.append('action', params.action);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE}/audit-logs/staff?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch staff activity logs');
    return data.data;
  },

  // ==================== Staff/Employee Management ====================

  /**
   * Get all staff members
   */
  getStaffMembers: async (page: number = 0, size: number = 20) => {
    const response = await fetch(`${API_BASE}/users/role/4?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch staff members');
    return data.data;
  },
};

export default userApi;
