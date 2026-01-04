// src/feature/trip/hooks/useTrips.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import {
    TripData, RouteSelection, VehicleSelection, DriverSelection
} from '../types';
import { tripApi } from '../api/tripApi';
import { TripFormData } from '@/feature/trip/components/TripModal/TripModal';

interface FetchTripsParams {
    page: number;
    status?: string;
    date?: string | null;
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

    // --- State cho Create Trip (MỚI) ---
    const [isCreating, setIsCreating] = useState(false);

    // Lưu params lần cuối để refresh data sau khi update/create
    const lastParamsRef = useRef<FetchTripsParams>({ page: 0 });

    // 1. Fetch Selection Data
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
            alert("Failed to fetch selection data, please try again.");
            console.error("Failed to fetch selection data", error);
        } finally {
            setLoadingSelection(false);
        }
    }, []);

    // 2. Fetch Trips
    const fetchTrips = useCallback(async (params: FetchTripsParams) => {
        setLoading(true);
        try {
            lastParamsRef.current = params; // Lưu lại params hiện tại
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
            alert("Failed to fetch trips, please try again.");
            console.error("Failed to fetch trips", error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Create Trip (ĐÃ CẬP NHẬT)
    const createTrip = async (data: TripFormData): Promise<boolean> => {
        setIsCreating(true);
        try {
            // Gọi API và nhận về Object Trip mới
            const newTrip = await tripApi.createTrip({
                ...data,
                price: Number(data.price)
            });

            if (newTrip) {
                // UX TRICK: Thêm ngay vào đầu danh sách hiện tại
                setTrips((prevTrips) => [newTrip, ...prevTrips]);

                // (Optional) Nếu muốn chuẩn chỉ logic pagination (Vd: danh sách đang full 10 item),
                // bạn có thể cắt bớt item cuối:
                // setTrips(prev => [newTrip, ...prev].slice(0, 10));

                return true;
            }
            return false;
        } catch (error) {
            alert("Failed to create trip.");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // 4. Update Status
    const updateTripStatus = async (tripId: number, newStatus: string) => {
        try {
            const success = await tripApi.updateStatus(tripId, newStatus);

            if (success) {
                // UX TRICK: Tìm tripId và update status mà không fetch lại
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.tripId === tripId
                            ? { ...trip, status: newStatus } // Copy trip cũ, đè status mới
                            : trip
                    )
                );
            }
        } catch (error) {
            alert("Error updating status.");
        }
    };

    return {
        // List Data
        trips,
        loading,
        currentPage,
        totalPages,
        setPage: setCurrentPage,
        fetchTrips,

        // Selection Data
        routes,
        vehicles,
        drivers,
        loadingSelection,
        fetchSelectionData,

        // Actions
        updateTripStatus,
        createTrip,
        isCreating, // Export state này ra để Modal dùng hiển thị loading
    };
};