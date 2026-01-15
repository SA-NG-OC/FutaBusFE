import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";
import {
  Vehicle,
  VehicleRequest,
} from "../types";

/**
 * ⚠️ API_URL
 * 👉 chỉnh lại nếu BE khác route
 * Ví dụ:
 *  - /vehicles
 *  - /api/vehicles
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";

/**
 * ⚠️ axiosClient
 * 👉 dùng chung config giống routeApi
 */
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vehicleApi = {
  // =====================================================
  // 1️⃣ GET – Lấy danh sách vehicles (phân trang)
  // URL: GET /vehicles?page={page}&size={size}
  // =====================================================
  getAll: async (
    page: number,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<Vehicle>>> => {
    const res = await axiosClient.get<
      ApiResponse<PageResponse<Vehicle>>
    >(
      `/vehicles?page=${page}&size=${size}` // 🔴 chỉnh URL tại đây nếu BE khác
    );

    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to fetch vehicles"
      );
    }

    return res.data;
  },

  // =====================================================
  // 2️⃣ GET – Lấy vehicle theo ID
  // URL: GET /vehicles/{id}
  // =====================================================
  getById: async (id: number): Promise<Vehicle> => {
    const res = await axiosClient.get<
      ApiResponse<Vehicle>
    >(
      `/vehicles/${id}` // 🔴 chỉnh URL tại đây nếu BE khác
    );

    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to fetch vehicle"
      );
    }

    return res.data.data;
  },

  // =====================================================
  // 3️⃣ POST – Tạo mới vehicle
  // URL: POST /vehicles
  // =====================================================
  create: async (
    data: VehicleRequest
  ): Promise<Vehicle> => {
    const res = await axiosClient.post<
      ApiResponse<Vehicle>
    >(
      `/vehicles`, // 🔴 chỉnh URL tại đây nếu BE khác
      data
    );

    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to create vehicle"
      );
    }

    return res.data.data;
  },

  // =====================================================
  // 4️⃣ PUT – Cập nhật vehicle
  // URL: PUT /vehicles/{id}
  // =====================================================
  update: async (
    id: number,
    data: VehicleRequest
  ): Promise<Vehicle> => {
    const res = await axiosClient.put<
      ApiResponse<Vehicle>
    >(
      `/vehicles/${id}`, // 🔴 chỉnh URL tại đây nếu BE khác
      data
    );

    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to update vehicle"
      );
    }

    return res.data.data;
  },

  // =====================================================
  // 5️⃣ DELETE – Xoá vehicle
  // URL: DELETE /vehicles/{id}
  // =====================================================
  delete: async (id: number): Promise<boolean> => {
    const res = await axiosClient.delete<
      ApiResponse<null>
    >(
      `/vehicles/${id}` // 🔴 chỉnh URL tại đây nếu BE khác
    );

    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to delete vehicle"
      );
    }

    return true;
  },
};
