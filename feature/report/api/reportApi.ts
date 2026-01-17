// /features/reports/api/reportApi.ts
import { api } from '@/shared/utils/apiClient';
import { PageResponse } from '@/shared/utils';
import {
    DashboardSummaryRes,
    ChartDataRes,
    RouteAnalyticsRes,
    ReportFilterParams
} from "../types";

export const reportApi = {
    // 1. KPI Summary
    getSummary: async (params: ReportFilterParams): Promise<DashboardSummaryRes> => {
        return api.get<DashboardSummaryRes>('/analytics/summary', { params });
    },

    // 2. Revenue by Day of Week
    getWeeklyRevenue: async (params: ReportFilterParams): Promise<ChartDataRes[]> => {
        return api.get<ChartDataRes[]>('/analytics/revenue-weekly', { params });
    },

    // 3. Revenue by Shift
    getShiftRevenue: async (params: ReportFilterParams): Promise<ChartDataRes[]> => {
        return api.get<ChartDataRes[]>('/analytics/revenue-shifts', { params });
    },

    // 4. Top Routes
    getTopRoutes: async (params: ReportFilterParams & { page?: number, size?: number }): Promise<PageResponse<RouteAnalyticsRes>> => {
        return api.get<PageResponse<RouteAnalyticsRes>>('/analytics/top-routes', { params });
    },

    exportReport: async (params: ReportFilterParams): Promise<void> => {
        try {
            const response = await api.client.get('/analytics/export', {
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