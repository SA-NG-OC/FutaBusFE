import { api } from '@/shared/utils/apiClient';
import { PageResponse } from '@/shared/utils';
import { Vehicle, VehicleRequest, VehicleStats } from "../types";

export const vehicleApi = {
  // =====================================================
  // 1️⃣ GET – Lấy danh sách vehicles (phân trang)
  // URL: GET /vehicles?page={page}&size={size}&status={status}&routeId={routeId}
  // =====================================================
  getAll: async (
    page: number, 
    size: number = 10, 
    status?: string, 
    routeId?: number
  ): Promise<PageResponse<Vehicle>> => {
    const params: any = { page, size };
    if (status) params.status = status;
    if (routeId) params.routeId = routeId;
    
    return api.get<PageResponse<Vehicle>>('/vehicles', { params });
  },

  // =====================================================
  // 2️⃣ GET – Lấy vehicle theo ID
  // URL: GET /vehicles/{id}
  // =====================================================
  getById: async (id: number): Promise<Vehicle> => {
    return api.get<Vehicle>(`/vehicles/${id}`);
  },

  // =====================================================
  // 3️⃣ POST – Tạo mới vehicle
  // URL: POST /vehicles
  // =====================================================
  create: async (data: VehicleRequest): Promise<Vehicle> => {
    return api.post<Vehicle>('/vehicles', data);
  },

  // =====================================================
  // 4️⃣ PUT – Cập nhật vehicle
  // URL: PUT /vehicles/{id}
  // =====================================================
  update: async (id: number, data: VehicleRequest): Promise<Vehicle> => {
    return api.put<Vehicle>(`/vehicles/${id}`, data);
  },

  // =====================================================
  // 5️⃣ DELETE – Xoá vehicle
  // URL: DELETE /vehicles/{id}
  // =====================================================
  delete: async (id: number): Promise<boolean> => {
    await api.delete(`/vehicles/${id}`);
    return true;
  },

  // =====================================================
  // 6️⃣ GET – Lấy thống kê vehicles
  // URL: GET /vehicles/stats
  // =====================================================
  getStats: async (): Promise<VehicleStats> => {
    return api.get<VehicleStats>('/vehicles/stats');
  },
};
