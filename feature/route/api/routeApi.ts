// src/feature/routes/api/routeApi.ts
import { ApiResponse, RouteData, RouteRequest } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

export const routeApi = {

    getLocations: async (): Promise<any[]> => {
        const res = await fetch(`${API_URL}/locations`);
        if (!res.ok) throw new Error("Failed to fetch locations");
        return res.json();
    },

    getRouteStops: async (): Promise<any> => {
        const res = await fetch(`${API_URL}/routes/route-stop`);
        if (!res.ok) throw new Error("Failed to fetch route stops");
        const json = await res.json();
        return json.data; // Trả về mảng data: [{routeStopId, routeStopName}, ...]
    },

    // 1. Lấy danh sách (GET)
    getAll: async (page: number, size: number = 10): Promise<ApiResponse> => {
        const res = await fetch(`${API_URL}/routes?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
    },

    // 2. Thêm mới (POST)
    // data ở đây tương ứng với RouteRequestDTO bên Java
    create: async (data: RouteRequest): Promise<ApiResponse> => {
        const res = await fetch(`${API_URL}/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            // Xử lý lỗi từ backend trả về (nếu có message lỗi cụ thể)
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || `Error: ${res.status}`);
        }

        return res.json();
    },

    // 3. Cập nhật (PUT)
    update: async (id: number, data: RouteRequest): Promise<ApiResponse> => {
        const res = await fetch(`${API_URL}/routes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || `Error: ${res.status}`);
        }

        return res.json();
    },

    // 4. Xóa (DELETE)
    delete: async (id: number): Promise<boolean> => {
        const res = await fetch(`${API_URL}/routes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.ok;
    }
};