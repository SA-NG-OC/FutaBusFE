// ===== SEAT MAP TYPES =====
export interface TripSeatDto {
  seatId: number;
  seatNumber: string; // A01, A02, ... B01...
  floorNumber: number; // 1=Lower, 2=Upper
  seatType: string; // "Standard" | "VIP" | "Sleeper"
  status: "Available" | "Held" | "Booked";
  holdExpiry: string | null;
  lockedBy: string | null;
}

export interface FloorSeats {
  floorNumber: number;
  floorLabel: string; // "Lower Floor" / "Upper Floor"
  seats: TripSeatDto[];
}

export interface SeatMapResponse {
  tripId: number;
  vehicleId: number;
  vehicleTypeName: string;
  numberOfFloors: number;
  floors: FloorSeats[];
}

// ===== TRIP INFO FOR BOOKING =====
export interface TripInfoForBooking {
  tripId: number;
  routeName: string;
  vehicleInfo: string;
  driverName: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  totalSeats: number;
  bookedSeats: number;
}

// ===== WEBSOCKET MESSAGE TYPES =====
export type MessageType =
  | "SEAT_LOCKED"
  | "SEAT_UNLOCKED"
  | "SEAT_BOOKED"
  | "SEAT_LOCK_FAILED"
  | "SEAT_UNLOCK_FAILED"
  | "SEAT_EXPIRED"
  | "SEAT_STATUS_UPDATE";

export interface SeatStatusMessage {
  type: MessageType;
  seatId: number;
  seatNumber: string;
  tripId: number;
  status: "Available" | "Held" | "Booked";
  lockedBy: string | null;
  lockExpiry: string | null;
  floorNumber: number;
  success: boolean;
  message: string;
  timestamp: string;
}

// ===== SELECTED SEAT =====
export interface SelectedSeat {
  seatId: number;
  seatNumber: string;
  lockExpiry: string | null;
}

// ===== BOOKING STATE =====
export interface BookingState {
  tripId: number | null;
  selectedSeats: SelectedSeat[];
  tripInfo: TripInfoForBooking | null;
  seatMap: SeatMapResponse | null;
}
