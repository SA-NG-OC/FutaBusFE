import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// ===== PAYMENT API =====
export const paymentApi = {
  // =====================================================
  // 📝 CREATE BOOKING - Tạo booking mới (status = "Held")
  // URL: POST /bookings/confirm
  // =====================================================
  createBooking: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    const response = await axiosClient.post<ApiResponse<BookingResponse>>(
      "/bookings/confirm",
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create booking");
    }

    return response.data.data;
  },

  // =====================================================
  // 💳 CREATE MOMO PAYMENT - Tạo thanh toán MoMo
  // URL: POST /payments/momo/create/{bookingId}
  // =====================================================
  createMomoPayment: async (bookingId: number): Promise<MomoPaymentResponse> => {
    const response = await axiosClient.post<ApiResponse<MomoPaymentResponse>>(
      `/payments/momo/create/${bookingId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create MoMo payment");
    }

    return response.data.data;
  },

  // =====================================================
  // 🔍 CHECK PAYMENT STATUS - Kiểm tra trạng thái thanh toán
  // URL: GET /payments/momo/status
  // =====================================================
  checkPaymentStatus: async (
    orderId: string,
    requestId: string
  ): Promise<MomoStatusResponse> => {
    const response = await axiosClient.get<ApiResponse<MomoStatusResponse>>(
      "/payments/momo/status",
      {
        params: { orderId, requestId },
      }
    );

    return response.data.data;
  },

  // =====================================================
  // 📋 GET BOOKING BY ID - Lấy thông tin booking
  // URL: GET /bookings/{bookingId}
  // =====================================================
  getBooking: async (bookingId: number): Promise<BookingResponse> => {
    const response = await axiosClient.get<ApiResponse<BookingResponse>>(
      `/bookings/${bookingId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch booking");
    }

    return response.data.data;
  },

  // =====================================================
  // 📋 GET BOOKING BY CODE - Lấy booking theo mã
  // URL: GET /bookings/code/{bookingCode}
  // =====================================================
  getBookingByCode: async (bookingCode: string): Promise<BookingResponse> => {
    const response = await axiosClient.get<ApiResponse<BookingResponse>>(
      `/bookings/code/${bookingCode}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch booking");
    }

    return response.data.data;
  },
};
