'use client';

import { useState, useCallback, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { tripApi } from '@/feature/trip/api/tripApi';
import {
    DashboardStatsDTO,
    DashboardChartDTO,
    DashboardTripDTO,
    RouteSelection
} from '../types/index';

export const useDashboard = () => {
    // --- STATE DATA ---
    const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const [chartData, setChartData] = useState<DashboardChartDTO | null>(null);
    const [loadingChart, setLoadingChart] = useState(true);

    const [trips, setTrips] = useState<DashboardTripDTO[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(true);

    // --- STATE CHO FILTERS & DROPDOWN ---
    const [routes, setRoutes] = useState<RouteSelection[]>([]); // Danh sách tuyến xe
    const [filters, setFilters] = useState({
        date: new Date().toISOString().split('T')[0], // Mặc định hôm nay yyyy-mm-dd
        routeId: null as number | null
    });

    // --- STATE PAGINATION ---
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Fetch Stats
    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const data = await dashboardApi.getStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // 2. Fetch Charts
    const fetchCharts = useCallback(async () => {
        setLoadingChart(true);
        try {
            const data = await dashboardApi.getCharts();
            setChartData(data);
        } catch (error) {
            console.error("Error fetching charts:", error);
        } finally {
            setLoadingChart(false);
        }
    }, []);

    // 3. Fetch Routes (Chạy 1 lần)
    const fetchRoutes = useCallback(async () => {
        try {
            const data = await tripApi.getRoutesSelection();
            setRoutes(data);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    }, []);

    // 4. Fetch Trips (Phụ thuộc vào page và filters)
    const fetchTrips = useCallback(async () => {
        setLoadingTrips(true);
        try {
            // Gọi API với date, routeId, page, size
            const data = await dashboardApi.getTrip(
                filters.date,
                filters.routeId,
                page,
                10
            );
            setTrips(data.content);
            setTotalPages(data.totalPages);
            // Không setPage ở đây để tránh loop, chỉ set data
        } catch (error) {
            console.error("Error fetching trips:", error);
            setTrips([]);
        } finally {
            setLoadingTrips(false);
        }
    }, [page, filters]); // Chạy lại khi page hoặc filters thay đổi

    // --- HANDLER CHO VIEW ---
    const handleFilterChange = (key: 'date' | 'routeId', value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0); // Reset về trang 0 khi đổi filter
    };

    // --- EFFECTS ---
    useEffect(() => {
        fetchStats();
        fetchCharts();
        fetchRoutes(); // Load danh sách tuyến xe
    }, [fetchStats, fetchCharts, fetchRoutes]);

    useEffect(() => {
        fetchTrips();
    }, [fetchTrips]); // fetchTrips đã bao gồm dependencies [page, filters]

    return {
        // Data
        stats,
        loadingStats,
        chartData,
        loadingChart,
        trips,
        loadingTrips,
        routes,    // Trả về list routes
        filters,   // Trả về state filters hiện tại

        // Pagination
        page,
        setPage,
        totalPages,

        // Actions
        handleFilterChange, // Hàm xử lý thay đổi filter
        refreshAll: () => {
            fetchStats();
            fetchCharts();
            fetchTrips();
        }
    };
};