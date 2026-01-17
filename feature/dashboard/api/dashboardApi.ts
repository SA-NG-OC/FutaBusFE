import { api } from '@/shared/utils/apiClient';
import { PageResponse } from '@/shared/utils';
import { DashboardStatsDTO, DashboardChartDTO, DashboardTripDTO } from "../types/index";

export const dashboardApi = {

    // 1. Lấy thống kê tổng quan
    getStats: async (): Promise<DashboardStatsDTO> => {
        return api.get<DashboardStatsDTO>('/dashboard/stats');
    },

    // 2. Lấy biểu đồ
    getCharts: async (): Promise<DashboardChartDTO> => {
        return api.get<DashboardChartDTO>("/dashboard/charts");
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

        return api.get<PageResponse<DashboardTripDTO>>('/dashboard/todays-trips', { params });
    }
}