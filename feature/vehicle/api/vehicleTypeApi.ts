import { api } from '@/shared/utils/apiClient';

export interface VehicleTypeResponse {
  typeId: number;
  typeName: string;
  totalSeats: number;
  numberOfFloors: number;
  description?: string;
}

export interface VehicleTypeRequest {
  typeName: string;
  totalSeats: number;
  numberOfFloors?: number;
  description?: string;
}

export const vehicleTypeApi = {
  /**
   * Get all vehicle types for selection (no pagination)
   */
  getAllForSelection: async (): Promise<VehicleTypeResponse[]> => {
    return api.get<VehicleTypeResponse[]>('/vehicle-types/selection');
  },

  /**
   * Get all vehicle types with pagination
   */
  getAll: async (page: number = 0, size: number = 20): Promise<{ content: VehicleTypeResponse[]; totalElements: number; totalPages: number }> => {
    return api.get('/vehicle-types', {
      params: { page, size }
    });
  },

  /**
   * Get vehicle type by ID
   */
  getById: async (id: number): Promise<VehicleTypeResponse> => {
    return api.get<VehicleTypeResponse>(`/vehicle-types/${id}`);
  },

  /**
   * Create new vehicle type
   */
  create: async (data: VehicleTypeRequest): Promise<VehicleTypeResponse> => {
    return api.post<VehicleTypeResponse>('/vehicle-types', data);
  },

  /**
   * Update vehicle type
   */
  update: async (id: number, data: VehicleTypeRequest): Promise<VehicleTypeResponse> => {
    return api.put<VehicleTypeResponse>(`/vehicle-types/${id}`, data);
  },

  /**
   * Delete vehicle type
   */
  delete: async (id: number): Promise<boolean> => {
    await api.delete(`/vehicle-types/${id}`);
    return true;
  }
};
