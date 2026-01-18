import { api, PageResponse } from '@/shared/utils/apiClient';
import {
  VehicleRouteAssignmentResponse,
  CreateVehicleRouteAssignmentRequest
} from '@/feature/route/types/routeAssignment';

const BASE_URL = '/vehicle-route-assignments';

export const vehicleRouteAssignmentApi = {
  /**
   * Get all vehicle-route assignments with pagination
   */
  getAll: async (page: number = 0, size: number = 20): Promise<PageResponse<VehicleRouteAssignmentResponse>> => {
    return api.get<PageResponse<VehicleRouteAssignmentResponse>>(BASE_URL, {
      params: { page, size }
    });
  },

  /**
   * Get assignments by vehicle ID
   */
  getByVehicle: async (vehicleId: number, date?: string): Promise<VehicleRouteAssignmentResponse[]> => {
    const params = date ? { date } : {};
    const response = await api.get<VehicleRouteAssignmentResponse[]>(
      `${BASE_URL}/vehicle/${vehicleId}`,
      { params }
    );
    return response;
  },

  /**
   * Get assignments by route ID (for filtering vehicles by route)
   */
  getByRoute: async (routeId: number, date?: string): Promise<VehicleRouteAssignmentResponse[]> => {
    const params = date ? { date } : {};
    const response = await api.get<VehicleRouteAssignmentResponse[]>(
      `${BASE_URL}/route/${routeId}`,
      { params }
    );
    return response;
  },

  /**
   * Get active assignments for a specific date
   */
  getActiveAssignments: async (date: string, page: number = 0, size: number = 20): Promise<PageResponse<VehicleRouteAssignmentResponse>> => {
    return api.get<PageResponse<VehicleRouteAssignmentResponse>>(`${BASE_URL}/active`, {
      params: { date, page, size }
    });
  },

  /**
   * Create new vehicle-route assignment
   */
  create: async (data: CreateVehicleRouteAssignmentRequest): Promise<VehicleRouteAssignmentResponse> => {
    return api.post<VehicleRouteAssignmentResponse>(BASE_URL, data);
  },

  /**
   * Update vehicle-route assignment
   */
  update: async (id: number, data: CreateVehicleRouteAssignmentRequest): Promise<VehicleRouteAssignmentResponse> => {
    return api.put<VehicleRouteAssignmentResponse>(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete vehicle-route assignment
   */
  delete: async (id: number): Promise<boolean> => {
    await api.delete(`${BASE_URL}/${id}`);
    return true;
  }
};
