'use client';

import React from 'react';
import PageHeader from '@/src/components/PageHeader/PageHeader';
import StatCard from '@/feature/dashboard/components/StatCard';
import { IconRevenue, IconTicket, IconBus, IconUser } from '@/feature/dashboard/components/DashboardIcons';
import ChartCard from '@/feature/dashboard/components/ChartCard';
import RevenueChart from '@/feature/dashboard/components/RevenueChart';
import TicketSalesChart from '@/feature/dashboard/components/TicketSalesChart';
import TripTable from '@/feature/dashboard/components/TripTable';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboard2 } from '../hooks/useDashboard2';

const DashboardView = () => {
    const {
        stats,
        chartData,
        trips,
        loadingStats,
        loadingChart,
        loadingTrips,
        page,
        setPage,
        totalPages
    } = useDashboard();

    const today = new Date().toLocaleDateString('vi-VN');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const formatTrend = (growth: number | undefined) => {
        if (growth === undefined) return "...";
        return growth > 0 ? `+${growth}%` : `${growth}%`;
    };

    return (
        <div className="w-full pb-10 bg-background text-foreground transition-colors duration-200">
            <PageHeader title="Overview Dashboard" />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    variant="green"
                    icon={<IconRevenue />}
                    label="Total Revenue"
                    value={loadingStats ? "..." : formatCurrency(stats?.revenue.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.revenue.growth)}
                    isIncrease={stats?.revenue.isIncrease}
                />
                <StatCard
                    variant="blue"
                    icon={<IconTicket />}
                    label="Tickets Sold"
                    value={loadingStats ? "..." : formatNumber(stats?.ticketsSold.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.ticketsSold.growth)}
                    isIncrease={stats?.ticketsSold.isIncrease}
                />
                <StatCard
                    variant="orange"
                    icon={<IconBus />}
                    label="Active Vehicles"
                    value={loadingStats ? "..." : formatNumber(stats?.activeVehicles.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.activeVehicles.growth)}
                    isIncrease={stats?.activeVehicles.isIncrease}
                />
                <StatCard
                    variant="purple"
                    icon={<IconUser />}
                    label="Active Drivers"
                    value={loadingStats ? "..." : formatNumber(stats?.activeDrivers.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.activeDrivers.growth)}
                    isIncrease={stats?.activeDrivers.isIncrease}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title={`Revenue Trends`}
                    isLoading={loadingChart}
                >
                    <RevenueChart data={chartData?.revenueTrends || []} />
                </ChartCard>

                <ChartCard
                    title={`Weekly Ticket Sales`}
                    isLoading={loadingChart}
                >
                    <TicketSalesChart data={chartData?.weeklySales || []} />
                </ChartCard>
            </div>

            <div className="mt-6 bg-background-paper rounded-lg shadow-sm p-6 transition-colors duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-foreground">
                        Trips Today ({today})
                    </h3>
                </div>

                <TripTable
                    data={trips}
                    isLoading={loadingTrips}
                    pagination={{
                        currentPage: page,
                        totalPages: totalPages,
                        onPageChange: (newPage: number) => setPage(newPage)
                    }}
                />
            </div>
        </div>
    );
};

export default DashboardView;