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

export interface PageResponse<T> {
    content: T[];          // Danh sách data chính
    totalPages: number;    // Tổng số trang
    totalElements: number; // Tổng số bản ghi
    number: number;        // Trang hiện tại (index bắt đầu từ 0)
    size: number;          // Kích thước trang
    first: boolean;
    last: boolean;
    empty: boolean;
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode?: string;
    timestamp?: string;
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