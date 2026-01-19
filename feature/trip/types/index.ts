// src/types.ts

export interface TripData {
  tripId: number;
  routeName: string;
  vehicleInfo: string;
  driverName: string;
  subDriverName?: string | null;
  date: string; // yyyy-MM-dd
  departureTime: string; // HH:mm:ss
  arrivalTime: string; // HH:mm:ss
  price: number;
  status: string;
  totalSeats?: number;
  bookedSeats?: number;
  checkedInSeats?: number;
  originName: string;
  destinationName: string;
}

export interface RouteSelection {
  routeId: number;
  routeName: string;
}

export interface VehicleSelection {
  vehicleId: number;
  licensePlate: string;
  vehicleTypeName: string;
}

export interface DriverSelection {
  driverId: number;
  driverName: string;
  driverLicense: string;
}

export interface TripFormData {
  routeId: string;
  vehicleId: string;
  driverId: string;
  subDriverId: string | null;
  date: string;
  departureTime: string;
  price: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TripFormData) => void;
  routes: RouteSelection[];
  vehicles: VehicleSelection[];
  drivers: DriverSelection[];
  subDrivers: DriverSelection[];
  isLoading?: boolean;
}
