// /features/reports/hook/useReportData.ts
import { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { DashboardSummaryRes, ChartDataRes, RouteAnalyticsRes } from '../types';

export const useReportData = (month: number, year: number) => {
    const [summary, setSummary] = useState<DashboardSummaryRes | null>(null);
    const [weeklyRevenue, setWeeklyRevenue] = useState<ChartDataRes[]>([]);
    const [shiftRevenue, setShiftRevenue] = useState<ChartDataRes[]>([]);
    const [topRoutes, setTopRoutes] = useState<RouteAnalyticsRes[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { month, year };

            // Gọi song song các API để tối ưu tốc độ
            const [summaryData, weeklyData, shiftData, routesData] = await Promise.all([
                reportApi.getSummary(params),
                reportApi.getWeeklyRevenue(params),
                reportApi.getShiftRevenue(params),
                reportApi.getTopRoutes({ ...params, page: 0, size: 5 }) // Lấy top 5
            ]);

            setSummary(summaryData);
            setWeeklyRevenue(weeklyData);
            setShiftRevenue(shiftData);
            setTopRoutes(routesData.content);
        } catch (err) {
            setError("Không thể tải dữ liệu báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [month, year]);

    return { summary, weeklyRevenue, shiftRevenue, topRoutes, loading, error, refetch: fetchData };
};