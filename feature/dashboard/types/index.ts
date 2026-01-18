// --- UI Types ---
export type StatVariant = 'green' | 'blue' | 'orange' | 'purple';

export interface StatCardProps {
    label: string;
    value: string | number;
    trendValue: string;
    variant: StatVariant;
    icon: React.ReactNode;
    isIncrease?: boolean;
}

// --- BACKEND DTO TYPES ---

// 1. Stats DTO
export interface StatItemDTO {
    value: number;
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

// 3. Select Options DTO (MỚI THÊM)
export interface RouteSelection {
    routeId: number;
    routeName: string;
}

// 4. Trips DTO
export type TripStatus = 'Running' | 'Waiting' | 'Delayed' | 'Completed' | 'Cancelled';

export interface DashboardTripDTO {
    tripIdDisplay: string;
    routeName: string;
    status: TripStatus;
    statusClass: string;
    departure: string;
    seatsInfo: string;
}