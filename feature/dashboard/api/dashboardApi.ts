import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";
import { StatCardProps, StatItemDTO, DashboardStatsDTO, ChartDataDTO, DashboardChartDTO, TripStatus, DashboardTripDTO } from "../types/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

const axiosClient = axios.create(
    {
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }
)

export const dashboardApi = {
    getStats: async (): Promise<DashboardStatsDTO> => {
        try {
            const response = await axiosClient.get<ApiResponse<DashboardStatsDTO>>('/dashboard/stats');
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch dashboard stats")
            }
            return response.data.data;
        }
        catch (error) {
            throw new Error("Failed to fetch dashboard stats");
        }
    },

    getCharts: async (): Promise<DashboardChartDTO> => {
        try {
            const response = await axiosClient.get<ApiResponse<DashboardChartDTO>>("/dashboard/charts");
            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch Dashboard chart");
            }
            return response.data.data;
        }
        catch (error) {
            throw new Error("Failed to fetch Dashboard chart");
        }
    },

    getTrip: async (
        date?: string, page: number = 0, size: number = 10): Promise<PageResponse<DashboardTripDTO>> => {
        const params = {
            date,
            page,
            size
        };

        if (date) {
            params.date = date;
        }
        const response = await axiosClient.get<ApiResponse<PageResponse<DashboardTripDTO>>>('/dashboard/todays-trips', { params });

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch today's trips");
        }

        return response.data.data;
    }
}

