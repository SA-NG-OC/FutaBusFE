// 1. Dữ liệu hiển thị (Response từ Backend trả về để hiện lên bảng)
export interface RouteData {
    routeId: number;
    routeName: string;
    originName: string;
    destinationName: string;
    distance: number;

    // CẬP NHẬT: Đổi tên và kiểu dữ liệu cho khớp JSON mới
    estimatedDuration: number;

    status: string;
    stopNames: string[];
    totalStops: number;
}

// 2. Cấu trúc Response API phân trang (Giữ nguyên nếu không đổi format chung)
export interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        content: RouteData[];
        totalPages: number;
        totalElements: number;
        number: number;
        size: number;
    };
}

// 3. Dữ liệu gửi đi (Payload cho POST/PUT)
// ĐÂY LÀ PHẦN CẦN SỬA NHIỀU NHẤT
export interface RouteRequest {
    routeName: string;

    // Đổi từ ID (number) sang Name (string)
    originName: string;

    // Đổi từ ID (number) sang Name (string)
    destinationName: string;

    distance: number;

    // Java backend là Integer, nên để number. Tên field là estimatedDuration
    estimatedDuration: number;

    // Đổi từ ID (number[]) sang Name (string[])
    intermediateStopNames: string[];
}