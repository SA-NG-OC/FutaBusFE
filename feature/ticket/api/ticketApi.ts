import { api } from '@/shared/utils/apiClient';
import {
  BookingPageResponse,
  BookingData,
  BookingListItem,
} from "../types";

export const ticketApi = {
  // ================================
  // GET ALL BOOKINGS (Admin table)
  // ================================
  getAllTickets: async (
    page: number = 0,
    size: number = 20,
    status: string | null = null,
    search: string = ""
  ): Promise<BookingPageResponse> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
      sortBy: "createdAt",
      sortDirection: "DESC",
    };

    if (status) params.status = status;
    if (search) params.search = search;

    return api.get<BookingPageResponse>("/bookings", { params });
  },

  // ================================
  // LOOKUP BY BOOKING CODE (Customer)
  // ================================
  getBookingByCode: async (bookingCode: string) => {
    return api.get(`/bookings/code/${bookingCode}`);
  },

  // ================================
  // SEARCH BY PHONE
  // ================================
  getBookingsByPhone: async (phone: string): Promise<BookingListItem[]> => {
    return api.get<BookingListItem[]>(`/bookings/phone/${phone}`);
  },

  // ================================
  // SEARCH BY EMAIL
  // ================================
  getBookingsByEmail: async (email: string): Promise<BookingListItem[]> => {
    return api.get<BookingListItem[]>(`/bookings/email/${encodeURIComponent(email)}`);
  },

  // ================================
  // GET BY CUSTOMER ID
  // ================================
  getBookingsByCustomer: async (customerId: number) => {
    return api.get(`/bookings/customer/${customerId}`);
  },

  // ================================
  // 🔥 ADMIN CONFIRM BOOKING
  // Backend: POST /bookings/{bookingId}/confirm
  // ================================
  confirmBooking: async (bookingId: number): Promise<BookingData> => {
    return api.post<BookingData>(`/bookings/${bookingId}/confirm`);
  },

  // ================================
  // 🔥 CANCEL BOOKING
  // Backend: POST /bookings/{bookingId}/cancel?userId=
  // ================================
  cancelBooking: async (bookingId: number, userId: number = 1): Promise<void> => {
    return api.post<void>(`/bookings/${bookingId}/cancel?userId=${userId}`);
  },

  // ================================
  // 🎫 MY TICKETS - Get user's bookings with filter
  // Backend: GET /bookings/my-tickets?status=&page=&size=
  // ================================
  getMyTickets: async (
    status?: "Upcoming" | "Completed" | "Cancelled",
    page: number = 0,
    size: number = 20
  ): Promise<BookingPageResponse> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (status) {
      params.status = status;
    }

    return api.get<BookingPageResponse>("/bookings/my-tickets", { params });
  },

  // ================================
  // 📊 MY TICKETS COUNT - Get ticket counts by status
  // Backend: GET /bookings/my-tickets/count
  // ================================
  getMyTicketsCount: async (): Promise<{
    upcomingCount: number;
    completedCount: number;
    cancelledCount: number;
    totalCount: number;
  }> => {
    return api.get<{
      upcomingCount: number;
      completedCount: number;
      cancelledCount: number;
      totalCount: number;
    }>("/bookings/my-tickets/count");
  },

  // ================================
  // GET TICKET DETAIL BY CODE
  // ================================
  getTicketDetailByCode: async (ticketCode: string): Promise<BookingListItem> => {
    return api.get<BookingListItem>(`/bookings/ticket/${ticketCode}`);
  },
};
