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
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  bookedSeats: number;
  totalSeats: number;
  price: number;
  vehicleTypeName: string;
  licensePlate: string;
  status: string;
}
