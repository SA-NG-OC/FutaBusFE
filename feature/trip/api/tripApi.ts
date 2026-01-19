import { api } from '@/shared/utils/apiClient';
import { PageResponse } from '@/shared/utils';
import {
  TripData,
  RouteSelection,
  VehicleSelection,
  DriverSelection,
  TripFormData,
} from "../types";

export interface GetTripsParams {
  page?: number;
  size?: number;

  sortBy?: "price" | "departureTime" | "rating";
  sortDir?: "asc" | "desc";

  search?: string;
  originId?: number;
  destId?: number;
  routeId?: number;
  date?: string; // yyyy-MM-dd

  minPrice?: number;
  maxPrice?: number;

  timeRanges?: Array<"Morning" | "Afternoon" | "Evening" | "Night">;
  vehicleTypes?: string[];
}


export const tripApi = {

  getTripsForBooking: async ({
    page = 0,
    size = 10,

    sortBy = "departureTime",
    sortDir = "asc",

    search,
    originId,
    destId,
    routeId, // <--- 1. Thêm routeId vào destructuring
    date,

    minPrice,
    maxPrice,

    timeRanges,
    vehicleTypes,
  }: GetTripsParams): Promise<PageResponse<TripData>> => {
    const params: any = {
      page,
      size,
      sortBy,
      sortDir,
    };

    // search
    if (search?.trim()) params.search = search;

    // location & route
    if (originId) params.originId = originId;
    if (destId) params.destId = destId;
    if (routeId) params.routeId = routeId; // <--- 2. Gán routeId vào params

    // date
    if (date) params.date = date;

    // price filter
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    // Build query string manually for array parameters
    const queryParams = new URLSearchParams();

    // Add basic params
    Object.keys(params).forEach(key => {
      // Đảm bảo không append null/undefined
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    // time ranges (multiple)
    if (timeRanges?.length) {
      timeRanges.forEach(range => {
        queryParams.append('timeRanges', range);
      });
    }

    // vehicle types (multiple)
    if (vehicleTypes?.length) {
      vehicleTypes.forEach(type => {
        queryParams.append('vehicleTypes', type);
      });
    }

    return api.get<PageResponse<TripData>>(`/trips?${queryParams.toString()}`);
  },


  // 1. Get List Trips (Admin/Employee - with status filter)
  getTrips: async ({
    page = 0,
    size = 10,
    status,
    date,
    routeId,
  }: any): Promise<PageResponse<TripData>> => {
    const params: any = { page, size, sort: "departureTime,asc" };

    // If status is provided and not empty, send as array
    // If empty string or null, backend will default to ["Waiting", "Running"]
    if (status && status !== "") {
      params.statuses = status; // Single status, backend expects List<String>
    }

    if (date) params.date = date;
    if (routeId) params.routeId = routeId;

    return api.get<PageResponse<TripData>>("/trips", { params });
  },

  // 2. Get Calendar Dates (Backend: TripController @GetMapping("/calendar-dates"))
  getTripDates: async (start: string, end: string): Promise<string[]> => {
    try {
      return await api.get<string[]>("/trips/calendar-dates", {
        params: { start, end },
      });
    } catch (error) {
      console.error("Failed to fetch calendar", error);
      return [];
    }
  },

  // 3. Update Status
  updateStatus: async (tripId: number, newStatus: string) => {
    await api.patch(`/trips/${tripId}/status`, { status: newStatus });
    return true;
  },

  // 4. Create Trip
  createTrip: async (data: TripFormData): Promise<TripData> => {
    return api.post<TripData>("/trips", data);
  },

  // --- SELECTION APIs (Call directly to Backend endpoints) ---

  getRoutesSelection: async (): Promise<RouteSelection[]> => {
    return api.get<RouteSelection[]>("/routes/selection");
  },

  getVehiclesSelection: async (): Promise<VehicleSelection[]> => {
    return api.get<VehicleSelection[]>("/vehicles/selection");
  },

  getDriversSelection: async (): Promise<DriverSelection[]> => {
    try {
      return await api.get<DriverSelection[]>("/drivers/selection");
    } catch (e) {
      console.warn("Driver selection API not found, mocking empty list");
      return [];
    }
  },

  deleteTrip: async (tripId: number) => {
    await api.delete(`/trips/${tripId}`);
    return true;
  },

  updateTripInfo: async (tripId: number, data: any): Promise<TripData> => {
    return api.put<TripData>(`/trips/${tripId}`, data);
  },
};
