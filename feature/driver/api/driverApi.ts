import { api, PageResponse } from '@/shared/utils/apiClient';

// ========== TYPES ==========
export interface Driver {
  driverId: number;
  driverLicense: string;
  licenseExpiry: string;
  dateOfBirth: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar?: string;
  status: string;
  activeRoutes: ActiveRoute[];
}

export interface ActiveRoute {
  assignmentId: number;
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
  preferredRole: string; // 'Main' | 'Backup'
  priority: number;
  startDate: string;
  endDate?: string;
}

export interface DriverRequest {
  userId: number;
  driverLicense: string;
  licenseExpiry: string;
  dateOfBirth: string;
  salary?: number;
}

export interface CreateDriverWithAccountRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  driverLicense: string;
  licenseExpiry: string;
  dateOfBirth: string;
  salary?: number;
  avatarUrl?: string;
}

export interface DriverSelection {
  value: number;
  label: string;
  licenseNumber: string;
  phoneNumber: string;
}

export interface DriverStats {
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
}

// ========== API METHODS ==========
export const driverApi = {
  /**
   * Get all drivers with pagination and search
   */
  getAll: async (
    page: number = 0, 
    size: number = 20, 
    keyword?: string,
    status?: string,
    routeId?: number
  ): Promise<PageResponse<Driver>> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    if (routeId) params.routeId = routeId.toString();

    return api.get<PageResponse<Driver>>('/drivers', { params });
  },

  /**
   * Get driver by ID with active routes
   */
  getById: async (id: number): Promise<Driver> => {
    return api.get<Driver>(`/drivers/${id}`);
  },

  /**
   * Create new driver (old method - requires existing user)
   */
  create: async (data: DriverRequest): Promise<Driver> => {
    return api.post<Driver>('/drivers', data);
  },

  /**
   * Create new driver with account (user + driver in one transaction)
   * Now accepts FormData with avatar file
   */
  createWithAccount: async (data: CreateDriverWithAccountRequest, avatarFile?: File): Promise<Driver> => {
    const formData = new FormData();
    
    // Append all form fields
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('driverLicense', data.driverLicense);
    formData.append('licenseExpiry', data.licenseExpiry);
    formData.append('dateOfBirth', data.dateOfBirth);
    if (data.salary !== undefined) {
      formData.append('salary', data.salary.toString());
    }
    
    // Append avatar file if provided
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    
    return api.post<Driver>('/drivers/with-account', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update existing driver
   */
  update: async (id: number, data: DriverRequest): Promise<Driver> => {
    return api.put<Driver>(`/drivers/${id}`, data);
  },

  /**
   * Delete driver
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },

  /**
   * Get drivers for selection dropdown
   */
  getSelection: async (): Promise<DriverSelection[]> => {
    return api.get<DriverSelection[]>('/drivers/selection');
  },

  /**
   * Get driver statistics
   */
  getStats: async (): Promise<DriverStats> => {
    return api.get<DriverStats>('/drivers/stats');
  },
};
