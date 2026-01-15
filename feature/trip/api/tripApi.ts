import axios from "axios";
import {
  PageResponse,
  ApiResponse,
  TripData,
  RouteSelection,
  VehicleSelection,
  DriverSelection,
  TripFormData,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

  const response = await axiosClient.get<
    ApiResponse<PageResponse<TripData>>
  >(`/trips?${queryParams.toString()}`);

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data.data;
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

    const response = await axiosClient.get<ApiResponse<PageResponse<TripData>>>(
      "/trips",
      { params }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  // 2. Get Calendar Dates (Backend: TripController @GetMapping("/calendar-dates"))
  getTripDates: async (start: string, end: string): Promise<string[]> => {
    const response = await axiosClient.get<ApiResponse<string[]>>(
      "/trips/calendar-dates",
      {
        params: { start, end },
      }
    );

    if (!response.data.success) {
      console.error("Failed to fetch calendar", response.data.message);
      return [];
    }
    return response.data.data;
  },

  // 3. Update Status
  updateStatus: async (tripId: number, newStatus: string) => {
    const response = await axiosClient.patch<ApiResponse<any>>(
      `/trips/${tripId}/status`,
      { status: newStatus }
    );
    if (!response.data.success) throw new Error(response.data.message);
    return true;
  },

  // 4. Create Trip
  createTrip: async (data: TripFormData) => {
    const response = await axiosClient.post<ApiResponse<TripData>>(
      "/trips",
      data
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  // --- SELECTION APIs (Call directly to Backend endpoints) ---

  getRoutesSelection: async (): Promise<RouteSelection[]> => {
    // Backend: RouteController @GetMapping("/selection")
    const response = await axiosClient.get<ApiResponse<RouteSelection[]>>(
      "/routes/selection"
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  getVehiclesSelection: async (): Promise<VehicleSelection[]> => {
    // Backend: VehicleController @GetMapping("/selection")
    const response = await axiosClient.get<ApiResponse<VehicleSelection[]>>(
      "/vehicles/selection"
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },

  getDriversSelection: async (): Promise<DriverSelection[]> => {
    // Backend: Chưa thấy DriverController trong file bạn gửi,
    // nhưng giả định nó có cấu trúc tương tự VehicleController
    // Nếu chưa có, bạn có thể dùng tạm API mock hoặc bảo bạn của bạn thêm endpoint này.
    try {
      const response = await axiosClient.get<ApiResponse<DriverSelection[]>>(
        "/drivers/selection"
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (e) {
      console.warn("Driver selection API not found, mocking empty list");
      return [];
    }
  },

  deleteTrip: async (tripId: number) => {
    const response = await axiosClient.delete<ApiResponse<any>>(
      `/trips/${tripId}`
    );
    if (!response.data.success) throw new Error(response.data.message);
    return true;
  },

  updateTripInfo: async (tripId: number, data: any) => {
    const response = await axiosClient.put<ApiResponse<TripData>>(
      `/trips/${tripId}`,
      data
    );
    if (!response.data.success) throw new Error(response.data.message);
    return response.data.data;
  },
};
