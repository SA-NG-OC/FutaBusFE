// User Types for Customer Management

export interface User {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  address: string | null;
  avatarUrl: string | null;
  status: 'Active' | 'Inactive' | 'Locked' | 'Pending';
  role: {
    roleId: number;
    roleName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CustomerFilterRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface UpdateUserStatusRequest {
  userId: number;
  status: 'Active' | 'Inactive' | 'Locked';
}

export interface ProfileData {
  userId: number;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: {
    roleId: number;
    roleName: string;
  };
  createdAt: string;
  position?: string;
  location?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Activity Log Types (matches AuditLogResponseDTO from BE)
export interface ActivityLog {
  logId: number;
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  tableName: string | null;
  recordId: number | null;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface ActivityLogFilterRequest {
  page?: number;
  size?: number;
  userId?: number;
  action?: string;
  tableName?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityLogResponse {
  content: ActivityLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
