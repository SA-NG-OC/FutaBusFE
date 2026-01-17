import { ApiResponse as Res, RouteData, RouteRequest } from "../types";
import axios from "axios";
import { ApiResponse } from "@/shared/utils"; // Giả sử import đúng

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

// 1. Cấu hình Axios
const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        // Chỉ chạy logic này khi ở phía Client (Trình duyệt)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            // Nếu có token, gắn vào Header Authorization
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const extractErrorMessage = (payload: any): string => {
    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        const validationMessages = Object.values(payload.data);
        if (validationMessages.length > 0) {
            return validationMessages.join('\n');
        }
    }
    return payload?.message || "Something went wrong (Unknown Error)";
};

axiosClient.interceptors.response.use(
    (response) => {
        if (response.data && response.data.success === false) {
            const errorMessage = extractErrorMessage(response.data);
            return Promise.reject(new Error(errorMessage));
        }
        return response;
    },
    (error) => {
        // if (error.response?.status === 401) {

        // }

        if (error.response && error.response.data) {
            const errorMessage = extractErrorMessage(error.response.data);
            return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(error);
    }
);

export const routeApi = {

    // ===== Locations =====
    getLocations: async (): Promise<any[]> => {
        const response = await axiosClient.get<ApiResponse<any[]>>("/locations");
        return response.data.data;
    },

    // ===== Route Stops =====
    getRouteStops: async (): Promise<any[]> => {
        const response = await axiosClient.get<ApiResponse<any[]>>("/routes/route-stop");
        return response.data.data;
    },

    // ===== Get All (List) =====
    getAll: async (page: number, size: number = 10, keyword?: string): Promise<any> => {
        const params: any = { page, size };
        if (keyword) {
            params.keyword = keyword;
        }

        const response = await axiosClient.get('/routes', { params });
        return response.data;
    },

    // ===== Create =====
    create: async (data: RouteRequest): Promise<RouteData> => {
        const response = await axiosClient.post<ApiResponse<RouteData>>("/routes", data);
        return response.data.data;
    },

    // ===== Update =====
    update: async (id: number, data: RouteRequest): Promise<RouteData> => {
        const response = await axiosClient.put<ApiResponse<RouteData>>(`/routes/${id}`, data);
        return response.data.data;
    },

    // ===== Delete =====
    delete: async (id: number): Promise<boolean> => {
        await axiosClient.delete<ApiResponse<null>>(`/routes/${id}`);
        return true;
    },
};