// src/feature/trip/hooks/useTrips.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import {
    TripData, RouteSelection, VehicleSelection, DriverSelection
} from '../types';
import { tripApi } from '../api/tripApi';
import { TripFormData } from '../types';
import { ApiResponse } from '@/shared/utils';

interface FetchTripsParams {
    page: number;
    status?: string;
    date?: string | null;
}

// Định nghĩa kiểu lỗi trả về từ Backend (khớp với BE của bạn)
interface ErrorResponse {
    success: boolean;
    message: string;
    data: any;
}

export const useTrips = () => {
    // --- State cho Danh sách ---
    const [trips, setTrips] = useState<TripData[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // --- State cho Dropdown ---
    const [routes, setRoutes] = useState<RouteSelection[]>([]);
    const [vehicles, setVehicles] = useState<VehicleSelection[]>([]);
    const [drivers, setDrivers] = useState<DriverSelection[]>([]);
    const [loadingSelection, setLoadingSelection] = useState(false);

    // --- State cho Create Trip ---
    const [isCreating, setIsCreating] = useState(false);

    const lastParamsRef = useRef<FetchTripsParams>({ page: 0 });

    // --- 2. HELPER: Hàm lấy message lỗi từ Axios ---
    const getErrorMessage = (error: unknown, defaultMessage: string): string => {
        if (axios.isAxiosError(error)) {
            const serverError = error as AxiosError<ApiResponse<any>>;
            if (serverError.response?.data?.message) {
                return serverError.response.data.message;
            }
        }
        if (error instanceof Error) {
            return error.message;
        }
        return defaultMessage;
    };

    // 3. Fetch Selection Data
    const fetchSelectionData = useCallback(async () => {
        setLoadingSelection(true);
        try {
            const [routesData, vehiclesData, driversData] = await Promise.all([
                tripApi.getRoutesSelection(),
                tripApi.getVehiclesSelection(),
                tripApi.getDriversSelection()
            ]);
            setRoutes(routesData);
            setVehicles(vehiclesData);
            setDrivers(driversData);
        } catch (error) {
            // Dùng helper để hiển thị lỗi
            alert(getErrorMessage(error, "Failed to fetch selection data."));
            console.error("Fetch Selection Error", error);
        } finally {
            setLoadingSelection(false);
        }
    }, []);

    // 4. Fetch Trips
    const fetchTrips = useCallback(async (params: FetchTripsParams) => {
        setLoading(true);
        try {
            lastParamsRef.current = params;
            const data = await tripApi.getTrips({
                page: params.page,
                status: params.status,
                date: params.date
            });

            if (data && Array.isArray(data.content)) {
                setTrips(data.content);
                setTotalPages(data.totalPages);
                setCurrentPage(data.number);
            } else {
                setTrips([]);
            }
        } catch (error) {
            alert(getErrorMessage(error, "Failed to fetch trips."));
            console.error("Fetch Trips Error", error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 5. Create Trip (ĐÃ SỬA LOGIC BẮT LỖI)
    const createTrip = async (data: TripFormData): Promise<boolean> => {
        setIsCreating(true);
        try {
            // Gọi API (Axios sẽ throw Error nếu status code là 4xx, 5xx)
            const newTrip = await tripApi.createTrip({
                ...data,
                price: Number(data.price)
            });

            if (newTrip) {
                // UX: Thêm vào đầu danh sách
                setTrips((prevTrips) => [newTrip, ...prevTrips]);
                return true;
            }
            return false;
        } catch (error) {
            const msg = getErrorMessage(error, "Failed to create trip.");
            alert(msg);
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // 6. Update Status
    const updateTripStatus = async (tripId: number, newStatus: string) => {
        try {
            const success = await tripApi.updateStatus(tripId, newStatus);

            if (success) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.tripId === tripId
                            ? { ...trip, status: newStatus }
                            : trip
                    )
                );
            }
        } catch (error) {
            alert(getErrorMessage(error, "Error updating status."));
        }
    };

    return {
        trips,
        loading,
        currentPage,
        totalPages,
        setPage: setCurrentPage,
        fetchTrips,
        routes,
        vehicles,
        drivers,
        loadingSelection,
        fetchSelectionData,
        updateTripStatus,
        createTrip,
        isCreating,
    };
};