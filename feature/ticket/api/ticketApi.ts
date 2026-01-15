import {
  ApiResponse,
  BookingPageResponse,
  BookingData,
  TicketDetailResponse,
  BookingListItem,
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5230";

export const ticketApi = {
  // ================================
  // GET ALL BOOKINGS (Admin table)
  // ================================
  getAllTickets: async (
    page: number = 0,
    size: number = 20,
    status: string | null = null,
    search: string = ""
  ): Promise<ApiResponse<BookingPageResponse>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: "createdAt",
      sortDirection: "DESC",
    });

    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const res = await fetch(`${API_BASE_URL}/bookings?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  // ================================
  // LOOKUP BY BOOKING CODE (Customer)
  // ================================
  getBookingByCode: async (bookingCode: string) => {
    const res = await fetch(`${API_BASE_URL}/bookings/code/${bookingCode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch booking");
    return res.json();
  },

  // ================================
  // SEARCH BY PHONE
  // ================================
  getBookingsByPhone: async (
    phone: string
  ): Promise<ApiResponse<BookingListItem[]>> => {
    const res = await fetch(`${API_BASE_URL}/bookings/phone/${phone}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch bookings by phone");
    return res.json();
  },

  // ================================
  // SEARCH BY EMAIL
  // ================================
  getBookingsByEmail: async (
    email: string
  ): Promise<ApiResponse<BookingListItem[]>> => {
    const res = await fetch(
      `${API_BASE_URL}/bookings/email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch bookings by email");
    return res.json();
  },

  // ================================
  // GET BY CUSTOMER ID
  // ================================
  getBookingsByCustomer: async (customerId: number) => {
    const res = await fetch(`${API_BASE_URL}/bookings/customer/${customerId}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  // ================================
  // 🔥 ADMIN CONFIRM BOOKING
  // Backend: POST /bookings/{bookingId}/confirm
  // ================================
  confirmBooking: async (
    bookingId: number
  ): Promise<ApiResponse<BookingData>> => {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to confirm booking");
    return res.json();
  },

  // ================================
  // 🔥 CANCEL BOOKING
  // Backend: POST /bookings/{bookingId}/cancel?userId=
  // ================================
  cancelBooking: async (
    bookingId: number,
    userId: number = 1
  ): Promise<ApiResponse<void>> => {
    const res = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/cancel?userId=${userId}`,
      { method: "POST" }
    );

    if (!res.ok) throw new Error("Failed to cancel booking");
    return res.json();
  },

  // ================================
  // 🎫 MY TICKETS - Get user's bookings with filter
  // Backend: GET /bookings/my-tickets?status=&page=&size=
  // ================================
  getMyTickets: async (
    token: string,
    status?: "Upcoming" | "Completed" | "Cancelled",
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<BookingPageResponse>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    const res = await fetch(`${API_BASE_URL}/bookings/my-tickets?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized - Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Failed to fetch my tickets");
    }
    return res.json();
  },

  // ================================
  // 📊 MY TICKETS COUNT - Get ticket counts by status
  // Backend: GET /bookings/my-tickets/count
  // ================================
  getMyTicketsCount: async (
    token: string
  ): Promise<
    ApiResponse<{
      upcomingCount: number;
      completedCount: number;
      cancelledCount: number;
      totalCount: number;
    }>
  > => {
    const res = await fetch(`${API_BASE_URL}/bookings/my-tickets/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized - Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Failed to fetch ticket counts");
    }
    return res.json();
  },

  // ================================
  // GET TICKET DETAIL BY CODE
  // ================================
  getTicketDetailByCode: async (
    ticketCode: string
  ): Promise<ApiResponse<BookingListItem>> => {
    const res = await fetch(`${API_BASE_URL}/bookings/ticket/${ticketCode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Không tìm thấy vé");
      }
      throw new Error("Failed to fetch ticket detail");
    }
    return res.json();
  },
};
