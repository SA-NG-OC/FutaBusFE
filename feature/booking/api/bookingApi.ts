import axios from "axios";
import { SeatMapResponse, TripInfoForBooking } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const bookingApi = {
  // =====================================================
  // 🎫 GET SEAT MAP - Lấy sơ đồ ghế cho chuyến đi
  // URL: GET /trips/seats/{tripId}
  // =====================================================
  getSeatMap: async (tripId: number): Promise<SeatMapResponse> => {
    const response = await axiosClient.get<ApiResponse<SeatMapResponse>>(
      `/trips/seats/${tripId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch seat map");
    }

    return response.data.data;
  },

  // =====================================================
  // 📋 GET TRIP INFO - Lấy thông tin chuyến đi
  // URL: GET /trips/{tripId}
  // =====================================================
  getTripInfo: async (tripId: number): Promise<TripInfoForBooking> => {
    const response = await axiosClient.get<ApiResponse<TripInfoForBooking>>(
      `/trips/${tripId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch trip info");
    }

    return response.data.data;
  },

  // =====================================================
  // ✅ CONFIRM BOOKING - Xác nhận đặt vé sau thanh toán
  // URL: POST /api/seats/confirm-booking
  // =====================================================
  confirmBooking: async (params: {
    seatId: number;
    tripId: number;
    userId: string;
    paymentId?: string;
  }): Promise<any> => {
    const response = await axiosClient.post<ApiResponse<any>>(
      `/api/seats/confirm-booking`,
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to confirm booking");
    }

    return response.data.data;
  },

  // =====================================================
  // 🔓 UNLOCK SEAT (REST API backup)
  // URL: DELETE /api/seats/{seatId}/lock
  // =====================================================
  unlockSeatREST: async (
    seatId: number,
    tripId: number,
    userId: string
  ): Promise<any> => {
    const response = await axiosClient.delete<ApiResponse<any>>(
      `/api/seats/${seatId}/lock`,
      {
        params: { tripId, userId },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to unlock seat");
    }

    return response.data.data;
  },
};
