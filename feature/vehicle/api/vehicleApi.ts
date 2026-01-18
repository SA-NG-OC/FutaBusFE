import { api } from '@/shared/utils/apiClient';
import { PageResponse } from '@/shared/utils';
import { Vehicle, VehicleRequest } from "../types";

export const vehicleApi = {
  // =====================================================
  // 1️⃣ GET – Lấy danh sách vehicles (phân trang)
  // URL: GET /vehicles?page={page}&size={size}
  // =====================================================
  getAll: async (page: number, size: number = 10): Promise<PageResponse<Vehicle>> => {
    return api.get<PageResponse<Vehicle>>('/vehicles', {
      params: { page, size }
    });
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
};
