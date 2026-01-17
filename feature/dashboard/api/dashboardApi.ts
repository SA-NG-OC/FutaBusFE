import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";
import { DashboardStatsDTO, DashboardChartDTO, DashboardTripDTO } from "../types/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

// 1. Cấu hình Axios
const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        // Chỉ chạy khi ở Client side
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
        if (error.response?.status === 403) {
            return Promise.reject(new Error("Bạn không có quyền truy cập dữ liệu này (Chỉ Admin)."));
        }

        if (error.response && error.response.data) {
            const errorMessage = extractErrorMessage(error.response.data);
            return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(error);
    }
);

export const dashboardApi = {

    // 1. Lấy thống kê tổng quan
    getStats: async (): Promise<DashboardStatsDTO> => {
        const response = await axiosClient.get<ApiResponse<DashboardStatsDTO>>('/dashboard/stats');
        return response.data.data;
    },

    // 2. Lấy biểu đồ
    getCharts: async (): Promise<DashboardChartDTO> => {
        const response = await axiosClient.get<ApiResponse<DashboardChartDTO>>("/dashboard/charts");
        return response.data.data;
    },

    // 3. Lấy danh sách chuyến đi hôm nay
    getTrip: async (
        date?: string,
        page: number = 0,
        size: number = 10
    ): Promise<PageResponse<DashboardTripDTO>> => {

        const params: any = { page, size };
        if (date) {
            params.date = date;
        }

        const response = await axiosClient.get<ApiResponse<PageResponse<DashboardTripDTO>>>('/dashboard/todays-trips', { params });
        return response.data.data;
    }
}