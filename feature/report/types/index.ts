// /features/reports/types/index.ts

export interface MetricData {
    value: number;
    growthPercent: number;
}

export interface DashboardSummaryRes {
    revenue: MetricData;
    costs: MetricData;
    netProfit: MetricData;
    occupancyRate: MetricData;
}

export interface ChartDataRes {
    label: string;
    value: number;
}

export interface RouteAnalyticsRes {
    routeId: number;
    routeName: string;
    totalRevenue: number;
    vehicleCount: number;
    driverCount: number;
}

// Params cho API
export interface ReportFilterParams {
    month?: number;
    year?: number;
}