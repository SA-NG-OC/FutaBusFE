import { create } from "domain";
import {
    PageResponse, ApiResponse, TripData,
    RouteSelection, VehicleSelection, DriverSelection
} from "../types";
import BackendResponse from "@/shared/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';

interface GetTripsParams {
    page?: number;
    size?: number;
    status?: string;
    date?: string | null;
}

export const tripApi = {
    /**
     * 1. GET /trips
     * Backend trả về trực tiếp Page Object (content, totalPages, number...)
     */
    getTrips: async ({
        page = 0,
        size = 10,
        status,
        date
    }: GetTripsParams): Promise<PageResponse<TripData>> => { // <--- SỬA RETURN TYPE
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        params.append('sort', 'updatedAt,desc');

        if (status && status !== 'ALL' && status !== '') {
            params.append('status', status);
        }

        if (date) {
            params.append('date', date);
        }

        const res = await fetch(`${API_URL}/trips?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            throw new Error(`Error fetching trips: ${res.statusText}`);
        }

        // Trả về thẳng JSON (khớp với PageResponse)
        return res.json();
    },

    // ... Giữ nguyên getTripDates và updateStatus như cũ ...
    // ... (Giả sử các API này vẫn trả về ApiResponse có success/message) ...

    getTripDates: async (start: string, end: string): Promise<ApiResponse<string[]>> => {
        const params = new URLSearchParams({ start, end });
        const res = await fetch(`${API_URL}/trips/calendar-dates?${params.toString()}`);
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    },

    updateStatus: async (tripId: number, newStatus: string): Promise<boolean> => {
        const res = await fetch(`${API_URL}/trips/${tripId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        return res.ok;
    },

    getRoutesSelection: async (): Promise<RouteSelection[]> => {
        const res = await fetch(`${API_URL}/routes/selection`);
        if (!res.ok) throw new Error("Failed to fetch routes");
        return res.json();
    },

    getVehiclesSelection: async (): Promise<VehicleSelection[]> => {
        const res = await fetch(`${API_URL}/vehicles/selection`);
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        return res.json();
    },

    getDriversSelection: async (): Promise<DriverSelection[]> => {
        const res = await fetch(`${API_URL}/drivers/selection`);
        if (!res.ok) throw new Error("Failed to fetch drivers");
        return res.json();
    },

    createTrip: async (tripData: any): Promise<TripData | null> => {
        try {
            const res = await fetch(`${API_URL}/trips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tripData),
            });

            if (res.ok) {
                const newTrip: TripData = await res.json();
                return newTrip; // Trả về object trip đầy đủ từ BE
            }
            return null;
        } catch (error) {
            console.error("API create error", error);
            return null;
        }
    },
};