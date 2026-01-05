// src/types.ts

// 1. Interface cho đối tượng Trip
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

// 2. Interface cho cấu trúc Page trả về từ Spring Boot (JSON bạn cung cấp)
export interface PageResponse<T> {
    content: T[];          // Danh sách data chính
    totalPages: number;    // Tổng số trang
    totalElements: number; // Tổng số bản ghi
    number: number;        // Trang hiện tại (index bắt đầu từ 0)
    size: number;          // Kích thước trang
    first: boolean;
    last: boolean;
    empty: boolean;
    // Các trường khác như pageable, sort có thể thêm nếu cần, nhưng thường FE ít dùng
}

// 3. Giữ lại ApiResponse cho các API khác (như updateStatus, getTripDates...)
// NẾU các API đó vẫn trả về { success: true, ... }
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
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