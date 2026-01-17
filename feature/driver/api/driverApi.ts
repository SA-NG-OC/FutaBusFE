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

export interface DriverSelection {
  value: number;
  label: string;
  licenseNumber: string;
  phoneNumber: string;
}

// ========== API METHODS ==========
export const driverApi = {
  /**
   * Get all drivers with pagination and search
   */
  getAll: async (page: number = 0, size: number = 20, keyword?: string): Promise<PageResponse<Driver>> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (keyword) {
      params.keyword = keyword;
    }

    return api.get<PageResponse<Driver>>('/drivers', { params });
  },

  /**
   * Get driver by ID with active routes
   */
  getById: async (id: number): Promise<Driver> => {
    return api.get<Driver>(`/drivers/${id}`);
  },

  /**
   * Create new driver
   */
  create: async (data: DriverRequest): Promise<Driver> => {
    return api.post<Driver>('/drivers', data);
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
};
