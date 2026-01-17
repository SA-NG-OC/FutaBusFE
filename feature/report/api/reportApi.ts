// /features/reports/api/reportApi.ts
import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";
import {
    DashboardSummaryRes,
    ChartDataRes,
    RouteAnalyticsRes,
    ReportFilterParams
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        // Kiểm tra xem có đang chạy ở trình duyệt không (tránh lỗi Next.js server-side)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            // Nếu có token thì gắn vào Header
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

export const reportApi = {
    // 1. KPI Summary
    getSummary: async (params: ReportFilterParams): Promise<DashboardSummaryRes> => {
        try {
            const response = await axiosClient.get<ApiResponse<DashboardSummaryRes>>('/analytics/summary', { params });
            return response.data.data;
        } catch (error) {
            throw new Error("Failed to fetch summary data");
        }
    },

    // 2. Revenue by Day of Week
    getWeeklyRevenue: async (params: ReportFilterParams): Promise<ChartDataRes[]> => {
        try {
            const response = await axiosClient.get<ApiResponse<ChartDataRes[]>>('/analytics/revenue-weekly', { params });
            return response.data.data;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch weekly revenue data");
        }
    },

    // 3. Revenue by Shift
    getShiftRevenue: async (params: ReportFilterParams): Promise<ChartDataRes[]> => {
        try {
            const response = await axiosClient.get<ApiResponse<ChartDataRes[]>>('/analytics/revenue-shifts', { params });
            return response.data.data;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch shift revenue data");
        }
    },

    // 4. Top Routes
    getTopRoutes: async (params: ReportFilterParams & { page?: number, size?: number }): Promise<PageResponse<RouteAnalyticsRes>> => {
        try {
            const response = await axiosClient.get<ApiResponse<PageResponse<RouteAnalyticsRes>>>('/analytics/top-routes', { params });
            return response.data.data;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch top routes data");
        }
    },

    exportReport: async (params: ReportFilterParams): Promise<void> => {
        try {
            const response = await axiosClient.get('/analytics/export', {
                params,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bao_cao_thang_${params.month}_${params.year}.xlsx`);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error("Failed to export report");
        }
    }
};