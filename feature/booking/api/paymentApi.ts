import { api } from '@/shared/utils/apiClient';

// ===== TYPES =====
export interface BookingData {
  bookingId: number;
  bookingCode: string;
  tripName: string;
  totalAmount: number;
  bookingStatus: string;
}

export interface MomoPaymentResponse {
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  orderId: string;
  requestId: string;
  booking: BookingData;
  message: string;
}

export interface MomoStatusResponse {
  resultCode: number;
  message: string;
  orderId: string;
  requestId: string;
  amount: number;
  transId: number;
  payType: string;
  signature: string;
}

export interface CreateBookingRequest {
  tripId: number;
  seatIds: number[];
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  isGuestBooking?: boolean;
  guestSessionId?: string;
  notes?: string;
}

export interface BookingResponse {
  bookingId: number;
  bookingCode: string;
  tripId: number;
  tripName: string;
  seatNumbers: string[];
  totalAmount: number;
  bookingStatus: string;
  lockedUntil: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

// ===== PAYMENT API =====
export const paymentApi = {
  // =====================================================
  // 📝 CREATE BOOKING - Tạo booking mới (status = "Held")
  // URL: POST /bookings/confirm
  // =====================================================
  createBooking: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    return api.post<BookingResponse>("/bookings/confirm", data);
  },

  // =====================================================
  // 💳 CREATE MOMO PAYMENT - Tạo thanh toán MoMo
  // URL: POST /payments/momo/create/{bookingId}
  // =====================================================
  createMomoPayment: async (bookingId: number): Promise<MomoPaymentResponse> => {
    return api.post<MomoPaymentResponse>(`/payments/momo/create/${bookingId}`);
  },

  // =====================================================
  // 🔍 CHECK PAYMENT STATUS - Kiểm tra trạng thái thanh toán
  // URL: GET /payments/momo/status
  // =====================================================
  checkPaymentStatus: async (
    orderId: string,
    requestId: string
  ): Promise<MomoStatusResponse> => {
    return api.get<MomoStatusResponse>("/payments/momo/status", {
      params: { orderId, requestId },
    });
  },

  // =====================================================
  // 📋 GET BOOKING BY ID - Lấy thông tin booking
  // URL: GET /bookings/{bookingId}
  // =====================================================
  getBooking: async (bookingId: number): Promise<BookingResponse> => {
    return api.get<BookingResponse>(`/bookings/${bookingId}`);
  },

  // =====================================================
  // 📋 GET BOOKING BY CODE - Lấy booking theo mã
  // URL: GET /bookings/code/{bookingCode}
  // =====================================================
  getBookingByCode: async (bookingCode: string): Promise<BookingResponse> => {
    return api.get<BookingResponse>(`/bookings/code/${bookingCode}`);
  },
};
