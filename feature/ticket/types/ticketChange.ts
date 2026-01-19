export interface TicketChangeRequest {
  ticketId: number;
  newTripId: number;
  newSeatId: number;
  reason?: string;
}

export interface TicketChangeResponse {
  ticketId: number;
  ticketCode: string;
  status: string;
  oldTripId: number;
  oldRouteName: string;
  oldDepartureTime: string;
  oldSeatNumber: string;
  newTripId: number;
  newRouteName: string;
  newDepartureTime: string;
  newSeatNumber: string;
  priceDifference: number;
  oldPrice: number;
  newPrice: number;
  changeReason?: string;
  changedAt: string;
}

export interface AlternativeTrip {
  tripId: number;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  vehicleInfo: string;
  vehicleTypeName: string;
  driverName: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  status: string;
}
