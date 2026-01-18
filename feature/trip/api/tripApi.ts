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

  // location
  if (originId) params.originId = originId;
  if (destId) params.destId = destId;

  // date
  if (date) params.date = date;

  // price filter
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined) params.maxPrice = maxPrice;

  // Build query string manually for array parameters
  const queryParams = new URLSearchParams();
  
  // Add basic params
  Object.keys(params).forEach(key => {
    queryParams.append(key, params[key]);
  });

  // time ranges (multiple) - repeat param for each value
  if (timeRanges?.length) {
    timeRanges.forEach(range => {
      queryParams.append('timeRanges', range);
    });
  }

  // vehicle types (multiple) - repeat param for each value
  if (vehicleTypes?.length) {
    vehicleTypes.forEach(type => {
      queryParams.append('vehicleTypes', type);
    });
  }

  return api.get<PageResponse<TripData>>(`/trips?${queryParams.toString()}`);
},


  // 1. Get List Trips
  getTrips: async ({
    page = 0,
    size = 10,
    status,
    date,
  }: any): Promise<PageResponse<TripData>> => {
    const params: any = { page, size, sort: "departureTime,asc" };
    if (status && status !== "ALL") params.status = status;
    if (date) params.date = date;

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
