import { api } from '@/shared/utils/apiClient';
import {
  BookingPageResponse,
  BookingData,
  BookingListItem,
} from "../types";
import { TicketChangeRequest, TicketChangeResponse } from "../types/ticketChange";

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
  // GET /bookings/code/{bookingCode}
  // ================================
  getBookingByCode: async (bookingCode: string): Promise<BookingData> => {
    return api.get<BookingData>(`/bookings/code/${bookingCode}`);
  },

  // ================================
  // LOOKUP BY TICKET CODE (Customer) ✨ NEW
  // GET /bookings/ticket/{ticketCode}
  // ================================
  getBookingByTicketCode: async (ticketCode: string): Promise<BookingData> => {
    return api.get<BookingData>(`/bookings/ticket/${ticketCode}`);
  },

  // ================================
  // SEARCH BY PHONE
  // GET /bookings/phone/{phone}
  // ================================
  getBookingsByPhone: async (phone: string): Promise<BookingListItem[]> => {
    return api.get<BookingListItem[]>(`/bookings/phone/${phone}`);
  },

  // ================================
  // SEARCH BY EMAIL
  // GET /bookings/email/{email}
  // ================================
  getBookingsByEmail: async (email: string): Promise<BookingListItem[]> => {
    return api.get<BookingListItem[]>(`/bookings/email/${encodeURIComponent(email)}`);
  },

  // ================================
  // GET BY CUSTOMER ID
  // GET /bookings/customer/{customerId}
  // ================================
  getBookingsByCustomer: async (customerId: number): Promise<BookingListItem[]> => {
    return api.get<BookingListItem[]>(`/bookings/customer/${customerId}`);
  },

  // ================================
  // ADMIN CONFIRM BOOKING
  // POST /bookings/{bookingId}/confirm
  // ================================
  confirmBooking: async (bookingId: number): Promise<BookingData> => {
    return api.post<BookingData>(`/bookings/${bookingId}/confirm`);
  },

  // ================================
  // CANCEL BOOKING
  // POST /bookings/{bookingId}/cancel?userId=
  // ================================
  cancelBooking: async (bookingId: number, userId: number): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>(`/bookings/${bookingId}/cancel?userId=${userId}`);
  },

  // ================================
  // MY TICKETS - Get user's bookings with filter
  // GET /bookings/my-tickets?status=&page=&size=
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
  // MY TICKETS COUNT - Get ticket counts by status
  // GET /bookings/my-tickets/count
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
  // CHANGE TICKET - Admin/Staff change ticket to different trip
  // PUT /tickets/{ticketId}/change
  // ================================
  changeTicket: async (ticketId: number, request: TicketChangeRequest): Promise<TicketChangeResponse> => {
    return api.put<TicketChangeResponse>(`/tickets/${ticketId}/change`, request);
  },
};
