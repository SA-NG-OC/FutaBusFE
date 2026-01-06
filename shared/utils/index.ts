export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode?: string;
    timestamp?: string;
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