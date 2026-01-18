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

const DashboardView = () => {
    const {
        stats,
        chartData,
        trips,
        routes,
        filters,
        loadingStats,
        loadingChart,
        loadingTrips,
        page,
        setPage,
        totalPages,
        handleFilterChange
    } = useDashboard();

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const formatNumber = (num: number) =>
        new Intl.NumberFormat('vi-VN').format(num);

    const formatTrend = (growth: number | undefined) => {
        if (growth === undefined) return "...";
        return growth > 0 ? `+${growth}%` : `${growth}%`;
    };

    return (
        <div className="w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
            <PageHeader title="Overview Dashboard" subtitle='Overview of your bus ticket management system' />

            {/* STATS GRID */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
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

            {/* CHARTS GRID */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <ChartCard
                    title="Revenue Trends"
                    isLoading={loadingChart}
                >
                    <RevenueChart data={chartData?.revenueTrends || []} />
                </ChartCard>

                <ChartCard
                    title="Weekly Ticket Sales"
                    isLoading={loadingChart}
                >
                    <TicketSalesChart data={chartData?.weeklySales || []} />
                </ChartCard>
            </div>

            {/* TRIP TABLE SECTION - Đã cập nhật props */}
            <div className="mt-6">
                <TripTable
                    // Data & Loading
                    data={trips}
                    isLoading={loadingTrips}

                    // Filter Logic
                    routes={routes}                 // Truyền list dropdown
                    filters={filters}               // Truyền giá trị đang chọn
                    onFilterChange={handleFilterChange} // Truyền hàm xử lý

                    // Pagination
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