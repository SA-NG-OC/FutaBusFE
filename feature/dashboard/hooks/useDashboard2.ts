'use client';

import { useState, useCallback, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import {
    DashboardStatsDTO,
    DashboardChartDTO,
    DashboardTripDTO
} from '../types/index';

// --- DỮ LIỆU MẪU CHO CHART (MOCK DATA) ---
const MOCK_CHART_DATA: DashboardChartDTO = {
    // Biểu đồ doanh thu (Revenue Trends) - Đơn vị: VNĐ
    revenueTrends: [
        { label: 'T1', value: 150000000 },
        { label: 'T2', value: 220000000 },
        { label: 'T3', value: 180000000 },
        { label: 'T4', value: 280000000 },
        { label: 'T5', value: 250000000 },
        { label: 'T6', value: 310000000 },
        { label: 'T7', value: 380000000 }, // Tháng hiện tại cao nhất
    ],
    // Biểu đồ vé bán ra theo tuần (Weekly Sales) - Đơn vị: Vé
    weeklySales: [
        { label: 'T2', value: 45 },
        { label: 'T3', value: 52 },
        { label: 'T4', value: 38 },
        { label: 'T5', value: 65 },
        { label: 'T6', value: 98 }, // Cuối tuần tăng cao
        { label: 'T7', value: 112 },
        { label: 'CN', value: 105 },
    ]
};

export const useDashboard2 = () => {
    // ... (Các state giữ nguyên)
    const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const [chartData, setChartData] = useState<DashboardChartDTO | null>(null);
    const [loadingChart, setLoadingChart] = useState(true);

    const [trips, setTrips] = useState<DashboardTripDTO[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // ... (fetchStats giữ nguyên hoặc mock tương tự nếu muốn)
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            // Tạm thời comment API thật để test (hoặc để nguyên nếu API stats đã chạy)
            const data = await dashboardApi.getStats();
            setStats(data);
        } catch (error) {
            console.error("Lỗi fetch stats:", error);
            // Mock fallback nếu API lỗi
            setStats({
                revenue: { value: 1250000000, growth: 12.5, label: "Revenue", isIncrease: true },
                ticketsSold: { value: 3400, growth: 5.2, label: "Tickets", isIncrease: true },
                activeVehicles: { value: 42, growth: -2.1, label: "Vehicles", isIncrease: false },
                activeDrivers: { value: 56, growth: 0, label: "Drivers", isIncrease: true }
            });
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // --- CẬP NHẬT HÀM NÀY ĐỂ DÙNG MOCK DATA CHO CHART ---
    const fetchCharts = useCallback(async () => {
        setLoadingChart(true);
        try {
            // == CÁCH 1: Dùng API thật ==
            // const data = await dashboardApi.getCharts();
            // setChartData(data);

            // == CÁCH 2: Dùng Mock Data (Giả lập độ trễ mạng 1s) ==
            await new Promise(resolve => setTimeout(resolve, 1000));
            setChartData(MOCK_CHART_DATA);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingChart(false);
        }
    }, []);

    const fetchTrips = useCallback(async (pageNum: number) => {
        setLoadingTrips(true);
        try {
            const data = await dashboardApi.getTrip(undefined, pageNum, 10);
            setTrips(data.content);
            setTotalPages(data.totalPages);
            setPage(data.number);
        } catch (error) {
            console.error(error);
            // Mock fallback cho bảng chuyến đi để không bị trống
            setTrips([
                { tripIdDisplay: "TRIP-001", routeName: "Sài Gòn - Đà Lạt", status: "Running", statusClass: "bg-green-100 text-green-800", departure: "08:00:00", seatsInfo: "20/40" },
                { tripIdDisplay: "TRIP-002", routeName: "Hà Nội - Sapa", status: "Waiting", statusClass: "bg-blue-100 text-blue-800", departure: "10:30:00", seatsInfo: "0/34" },
                { tripIdDisplay: "TRIP-003", routeName: "Đà Nẵng - Huế", status: "Completed", statusClass: "bg-gray-100 text-gray-800", departure: "06:00:00", seatsInfo: "40/40" },
            ]);
        } finally {
            setLoadingTrips(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        fetchCharts();
    }, [fetchStats, fetchCharts]);

    useEffect(() => {
        fetchTrips(page);
    }, [fetchTrips, page]);

    return {
        stats,
        loadingStats,
        chartData,
        loadingChart,
        trips,
        loadingTrips,
        page,
        setPage,
        totalPages,
        refreshAll: () => {
            fetchStats();
            fetchCharts();
            fetchTrips(page);
        }
    };
};