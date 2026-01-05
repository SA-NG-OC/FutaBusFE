// src/services/tripApi.ts (hoặc file tương ứng của bạn)
import axios from "axios";
import {
    PageResponse,
    ApiResponse,
    TripData,
    RouteSelection,
    VehicleSelection,
    DriverSelection,
    TripFormData
} from "../types";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';


const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

interface GetTripsParams {
    page?: number;
    size?: number;
    status?: string;
    date?: string | null;
}

export const tripApi = {

    getTrips: async ({
        page = 0,
        size = 10,
        status,
        date
    }: GetTripsParams): Promise<PageResponse<TripData>> => {
        const params: Record<string, any> = {
            page,
            size
        };

        if (status && status !== 'ALL' && status !== '') {
            params.status = status;
        }

        if (date) {
            params.date = date;
        }

        // Gọi API với kiểu bọc ApiResponse
        const response = await axiosClient.get<ApiResponse<PageResponse<TripData>>>('/trips', { params });

        // Kiểm tra logic success từ Backend
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch trips");
        }

        return response.data.data;
    },

    getTripDates: async (start: string, end: string): Promise<string[]> => {
        const response = await axiosClient.get<ApiResponse<string[]>>('/trips/calendar-dates', {
            params: { start, end }
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return response.data.data;
    },


    updateStatus: async (tripId: number, newStatus: string): Promise<boolean> => {
        const response = await axiosClient.patch<ApiResponse<any>>(`/trips/${tripId}/status`, { status: newStatus });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        return true;
    },


    getRoutesSelection: async (): Promise<RouteSelection[]> => {
        const response = await axiosClient.get<ApiResponse<RouteSelection[]>>('/routes/selection');
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    },

    getVehiclesSelection: async (): Promise<VehicleSelection[]> => {
        const response = await axiosClient.get<ApiResponse<VehicleSelection[]>>('/vehicles/selection');
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    },

    getDriversSelection: async (): Promise<DriverSelection[]> => {
        const response = await axiosClient.get<ApiResponse<DriverSelection[]>>('/drivers/selection');
        if (!response.data.success) throw new Error(response.data.message);
        return response.data.data;
    },

    createTrip: async (tripData: TripFormData): Promise<TripData> => {
        const response = await axiosClient.post<ApiResponse<TripData>>('/trips', tripData);

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to create trip");
        }

        return response.data.data;
    },
};