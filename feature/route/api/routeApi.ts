// src/feature/routes/api/routeApi.ts
import { ApiResponse as Res, RouteData, RouteRequest } from "../types";
import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

// 1. Cấu hình Axios
const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 2. Hàm Helper: Trích xuất thông báo lỗi từ cấu trúc JSON của BE
// Input là response.data hoặc error.response.data
const extractErrorMessage = (payload: any): string => {
    // Nếu BE trả về lỗi validation trong trường "data" (dạng object key-value)
    // VD: data: { destinationName: "...", originName: "..." }
    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        const validationMessages = Object.values(payload.data);
        if (validationMessages.length > 0) {
            // Nối các lỗi lại, xuống dòng để dễ đọc trong Toast
            return validationMessages.join('\n');
        }
    }

    // Nếu không có data chi tiết, lấy message chung hoặc lỗi mặc định
    return payload?.message || "Something went wrong (Unknown Error)";
};

// 3. Interceptor: Chặn mọi phản hồi để kiểm tra lỗi trước
axiosClient.interceptors.response.use(
    (response) => {
        // Trường hợp API trả về HTTP 200 nhưng logic thất bại (success: false)
        if (response.data && response.data.success === false) {
            const errorMessage = extractErrorMessage(response.data);
            return Promise.reject(new Error(errorMessage));
        }
        // Thành công -> Trả về response để các hàm bên dưới xử lý tiếp
        return response;
    },
    (error) => {
        // Trường hợp API trả về HTTP 400, 404, 500...
        if (error.response && error.response.data) {
            const errorMessage = extractErrorMessage(error.response.data);
            return Promise.reject(new Error(errorMessage));
        }
        // Lỗi mạng hoặc server chết hẳn
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
    // Đã chuyển sang dùng axiosClient để bắt lỗi đồng bộ
    getAll: async (page: number, size: number = 10, keyword?: string): Promise<any> => {
        const params: any = { page, size };
        if (keyword) {
            params.keyword = keyword;
        }

        const response = await axiosClient.get('/routes', { params });
        // Trả về nguyên response.data vì logic phân trang của bạn cần biến 'content', 'totalPages' nằm trong đó
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