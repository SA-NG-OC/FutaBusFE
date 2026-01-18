import { api, PageResponse } from '@/shared/utils/apiClient';
import {
  DriverRouteAssignmentResponse,
  CreateDriverRouteAssignmentRequest
} from '@/feature/route/types/routeAssignment';

const BASE_URL = '/driver-route-assignments';

export const driverRouteAssignmentApi = {
  /**
   * Get all driver-route assignments with pagination
   */
  getAll: async (page: number = 0, size: number = 20): Promise<PageResponse<DriverRouteAssignmentResponse>> => {
    return api.get<PageResponse<DriverRouteAssignmentResponse>>(BASE_URL, {
      params: { page, size }
    });
  },

  /**
   * Get assignments by driver ID
   */
  getByDriver: async (driverId: number, date?: string): Promise<DriverRouteAssignmentResponse[]> => {
    const params = date ? { date } : {};
    const response = await api.get<DriverRouteAssignmentResponse[]>(
      `${BASE_URL}/driver/${driverId}`,
      { params }
    );
    return response;
  },

  /**
   * Get assignments by route ID (for filtering drivers by route)
   */
  getByRoute: async (routeId: number, date?: string): Promise<DriverRouteAssignmentResponse[]> => {
    const params = date ? { date } : {};
    const response = await api.get<DriverRouteAssignmentResponse[]>(
      `${BASE_URL}/route/${routeId}`,
      { params }
    );
    return response;
  },

  /**
   * Get active assignments for a specific date
   */
  getActiveAssignments: async (date: string, page: number = 0, size: number = 20): Promise<PageResponse<DriverRouteAssignmentResponse>> => {
    return api.get<PageResponse<DriverRouteAssignmentResponse>>(`${BASE_URL}/active`, {
      params: { date, page, size }
    });
  },

  /**
   * Create new driver-route assignment
   */
  create: async (data: CreateDriverRouteAssignmentRequest): Promise<DriverRouteAssignmentResponse> => {
    return api.post<DriverRouteAssignmentResponse>(BASE_URL, data);
  },

  /**
   * Update driver-route assignment
   */
  update: async (id: number, data: CreateDriverRouteAssignmentRequest): Promise<DriverRouteAssignmentResponse> => {
    return api.put<DriverRouteAssignmentResponse>(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete driver-route assignment
   */
  delete: async (id: number): Promise<boolean> => {
    await api.delete(`${BASE_URL}/${id}`);
    return true;
  }
};
