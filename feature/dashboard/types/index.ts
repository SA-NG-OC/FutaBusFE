// --- UI Types (Giữ nguyên để dùng cho Component) ---
export type StatVariant = 'green' | 'blue' | 'orange' | 'purple';

export interface StatCardProps {
    label: string;
    value: string | number;
    trendValue: string;
    variant: StatVariant;
    icon: React.ReactNode;
    isIncrease?: boolean; // Thêm cái này để biết mũi tên lên hay xuống
}

// --- BACKEND DTO TYPES (Mới) ---

// 1. Stats DTO
export interface StatItemDTO {
    value: number;      // BigDecimal trả về number trong JSON
    growth: number;
    label: string;
    isIncrease: boolean;
}

export interface DashboardStatsDTO {
    revenue: StatItemDTO;
    ticketsSold: StatItemDTO;
    activeVehicles: StatItemDTO;
    activeDrivers: StatItemDTO;
}

// 2. Charts DTO
export interface ChartDataDTO {
    label: string;
    value: number;
}

export interface DashboardChartDTO {
    revenueTrends: ChartDataDTO[];
    weeklySales: ChartDataDTO[];
}

// 3. Trips DTO
// Map chính xác các field status trả về từ BE
export type TripStatus = 'Running' | 'Waiting' | 'Delayed' | 'Completed' | 'Cancelled';

export interface DashboardTripDTO {
    tripIdDisplay: string;
    routeName: string;
    status: TripStatus; // Hoặc string nếu BE trả về status lạ
    statusClass: string;
    departure: string; // LocalTime sẽ trả về string dạng "HH:mm:ss"
    seatsInfo: string;
}