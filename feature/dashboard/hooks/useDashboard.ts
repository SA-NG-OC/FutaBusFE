'use client';

import { useState, useCallback, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import {
    DashboardStatsDTO,
    DashboardChartDTO,
    DashboardTripDTO
} from '../types/index';

export const useDashboard = () => {
    const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);

    const [chartData, setChartData] = useState<DashboardChartDTO | null>(null);
    const [loadingChart, setLoadingChart] = useState(true);

    const [trips, setTrips] = useState<DashboardTripDTO[]>([]);
    const [loadingTrips, setLoadingTrips] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const data = await dashboardApi.getStats();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    const fetchCharts = useCallback(async () => {
        setLoadingChart(true);
        try {
            const data = await dashboardApi.getCharts();
            setChartData(data);
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
            setTrips([]);
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