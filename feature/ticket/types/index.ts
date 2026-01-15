// Types for Ticket Management

export interface TicketInfo {
  ticketId: number;
  ticketCode: string;
  seatId: number;
  seatNumber: string;
  floorNumber: number;
  price: number;
  ticketStatus: string;
  passenger?: PassengerInfo;
}

export interface PassengerInfo {
  passengerId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  pickupAddress?: string | null;
  dropoffAddress?: string | null;
}

export interface TripInfo {
  tripId: number;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  vehicleInfo?: string;
  driverName: string;
  pickupLocationName?: string;
  dropoffLocationName?: string;
  pickupLocation?: string;
  pickupTime?: string;
  dropoffLocation?: string;
  dropoffTime?: string;
  vehiclePlate?: string;
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

// Ticket Detail Types
export interface TicketDetailResponse {
  ticketInfo: {
    ticketCode: string;
    bookingCode: string;
    status: string;
    price: number;
  };
  tripInfo: {
    routeName: string;
    departureDate: string;
    timeRange: string;
    duration: string;
    vehicleType: string;
    licensePlate: string;
    driverName: string;
  };
  passengerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    cccd?: string;
  };
  seatInfo: {
    seatNumber: string;
    floor: string;
    position: string;
  };
  pickupInfo: {
    locationName: string;
    address: string;
    time: string;
  };
  dropoffInfo: {
    locationName: string;
    address: string;
    time: string;
  };
}

// Booking List Response Types (for email/phone search)
export interface BookingListItem {
  bookingId: number;
  bookingCode: string;
  tripId: number;
  tripInfo: TripInfo;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  bookingStatus: string;
  bookingType: string;
  tickets: TicketInfo[];
  createdAt: string;
}

export interface BookingListResponse {
  bookings: BookingListItem[];
}
