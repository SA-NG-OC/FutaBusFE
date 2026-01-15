// src/feature/trip/hooks/useTrips.ts
"use client";

import { useState, useCallback, useRef } from "react";
import axios, { AxiosError } from "axios";
import {
  TripData,
  RouteSelection,
  VehicleSelection,
  DriverSelection,
} from "../types";
import { tripApi } from "../api/tripApi";
import { TripFormData } from "../types";
import { ApiResponse } from "@/shared/utils";

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
  const [subDrivers, setSubDrivers] = useState<DriverSelection[]>([]); // <--- 1. Thêm State SubDrivers
  const [loadingSelection, setLoadingSelection] = useState(false);

  // --- State cho Create Trip ---
  const [isCreating, setIsCreating] = useState(false);

  const lastParamsRef = useRef<FetchTripsParams>({ page: 0 });

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
      // <--- 2. Cập nhật Promise.all để lấy dữ liệu SubDriver
      // Nếu API lấy phụ xe riêng thì dùng api riêng, nếu chung với tài xế thì gọi getDriversSelection
      const [routesData, vehiclesData, driversData] = await Promise.all([
        tripApi.getRoutesSelection(),
        tripApi.getVehiclesSelection(),
        tripApi.getDriversSelection(),
      ]);

      setRoutes(routesData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      setSubDrivers(driversData); // <--- 3. Gán dữ liệu cho SubDriver (dùng chung danh sách tài xế)
    } catch (error) {
      alert(getErrorMessage(error, "Failed to fetch selection data."));
      console.error("Fetch Selection Error", error);
    } finally {
      setLoadingSelection(false);
    }
  }, []);

  const fetchTrips = useCallback(async (params: FetchTripsParams) => {
    setLoading(true);
    try {
      lastParamsRef.current = params;
      const data = await tripApi.getTrips({
        page: params.page,
        status: params.status,
        date: params.date,
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

  // 5. Create Trip
  const createTrip = async (data: TripFormData): Promise<boolean> => {
    setIsCreating(true);
    try {
      const newTrip = await tripApi.createTrip({
        ...data,
        price: Number(data.price),
        // subDriverId đã có sẵn trong data nếu form gửi lên đúng tên
      });

      if (newTrip) {
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

  const updateTripStatus = async (tripId: number, newStatus: string) => {
    try {
      const success = await tripApi.updateStatus(tripId, newStatus);
      if (success) {
        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip.tripId === tripId ? { ...trip, status: newStatus } : trip
          )
        );
      }
    } catch (error) {
      alert(getErrorMessage(error, "Error updating status."));
    }
  };

  const deleteTrip = async (tripId: number): Promise<boolean> => {
    if (!confirm("Are you sure you want to delete this trip?")) return false;
    try {
      await tripApi.deleteTrip(tripId);
      // Cập nhật lại danh sách trips ngay lập tức (xóa khỏi mảng)
      setTrips((prev) => prev.filter((t) => t.tripId !== tripId));
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Failed to delete trip"));
      return false;
    }
  };

  const updateTripInfo = async (
    tripId: number,
    data: any
  ): Promise<boolean> => {
    try {
      const updatedTrip = await tripApi.updateTripInfo(tripId, data);
      if (updatedTrip) {
        // Cập nhật lại item trong danh sách trips
        setTrips((prev) =>
          prev.map((t) => (t.tripId === tripId ? updatedTrip : t))
        );
        return true;
      }
      return false;
    } catch (error) {
      alert(getErrorMessage(error, "Failed to update trip info"));
      return false;
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
    subDrivers,
    loadingSelection,
    fetchSelectionData,
    updateTripStatus,
    createTrip,
    isCreating,
    deleteTrip,
    updateTripInfo,
  };
};
