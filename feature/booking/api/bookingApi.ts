import { api } from '@/shared/utils/apiClient';
import { SeatMapResponse, TripInfoForBooking } from "../types";

export const bookingApi = {
  // =====================================================
  // 🎫 GET SEAT MAP - Lấy sơ đồ ghế cho chuyến đi
  // URL: GET /trips/seats/{tripId}
  // =====================================================
  getSeatMap: async (tripId: number): Promise<SeatMapResponse> => {
    return api.get<SeatMapResponse>(`/trips/seats/${tripId}`);
  },

  // =====================================================
  // 📋 GET TRIP INFO - Lấy thông tin chuyến đi
  // URL: GET /trips/{tripId}
  // =====================================================
  getTripInfo: async (tripId: number): Promise<TripInfoForBooking> => {
    return api.get<TripInfoForBooking>(`/trips/${tripId}`);
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
    return api.post<any>(`/api/seats/confirm-booking`, params);
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
    return api.delete<any>(`/api/seats/${seatId}/lock`, {
      params: { tripId, userId },
    });
  },
};
