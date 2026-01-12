// /features/reports/api/reportApi.ts
import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils"; // Giả sử bạn có utils này
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
            // Return empty page structure on error
            throw new Error("Failed to fetch top routes data");
        }
    },

    exportReport: async (params: ReportFilterParams): Promise<void> => {
        try {
            const response = await axiosClient.get('/analytics/export', {
                params,
                responseType: 'blob', // QUAN TRỌNG: Để nhận dữ liệu binary
            });

            // Tạo link ảo để download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Đặt tên file
            link.setAttribute('download', `Bao_cao_thang_${params.month}_${params.year}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error("Failed to export report");
        }
    }
};