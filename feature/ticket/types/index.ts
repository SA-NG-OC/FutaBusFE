// Types for Ticket Management

export interface TicketInfo {
  ticketId: number;
  ticketCode: string;
  seatId: number;
  seatNumber: string;
  floorNumber: number;
  price: number;
  ticketStatus: string;
}

export interface TripInfo {
  tripId: number;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  vehicleInfo: string;
  driverName: string;
}

export interface BookingData {
  bookingId: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tripInfo: TripInfo;
  tickets: TicketInfo[];
  totalAmount: number;
  bookingStatus:
    | "Paid"
    | "Pending"
    | "Held"
    | "Cancelled"
    | "Expired"
    | "Completed";
  bookingType: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface BookingPageResponse {
  bookings: BookingData[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
