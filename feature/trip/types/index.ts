// src/types.ts

export interface TripData {
    tripId: number;
    routeName: string;
    vehicleInfo: string;
    driverName: string;
    date: string;
    departureTime: string;
    price: number;
    status: string;
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
    date: string;
    departureTime: string;
    price: number;
}