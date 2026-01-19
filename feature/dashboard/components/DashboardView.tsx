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

    // Định dạng tiền tệ VND
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    // Định dạng số (ví dụ: 1.000 thay vì 1,000)
    const formatNumber = (num: number) =>
        new Intl.NumberFormat('vi-VN').format(num);

    const formatTrend = (growth: number | undefined) => {
        if (growth === undefined) return "...";
        return growth > 0 ? `+${growth}%` : `${growth}%`;
    };

    return (
        <div className="w-full text-[var(--foreground)] transition-colors duration-200">
            {/* Header: Tiêu đề trang */}
            <PageHeader
                title="Tổng quan hệ thống"
                subtitle='Báo cáo tổng quan về hệ thống quản lý vé xe của bạn'
            />

            {/* STATS GRID: Các thẻ thống kê */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    variant="green"
                    icon={<IconRevenue />}
                    label="Tổng doanh thu"
                    value={loadingStats ? "..." : formatCurrency(stats?.revenue.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.revenue.growth)}
                    isIncrease={stats?.revenue.isIncrease}
                />
                <StatCard
                    variant="blue"
                    icon={<IconTicket />}
                    label="Vé đã bán"
                    value={loadingStats ? "..." : formatNumber(stats?.ticketsSold.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.ticketsSold.growth)}
                    isIncrease={stats?.ticketsSold.isIncrease}
                />
                <StatCard
                    variant="orange"
                    icon={<IconBus />}
                    label="Xe đang hoạt động"
                    value={loadingStats ? "..." : formatNumber(stats?.activeVehicles.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.activeVehicles.growth)}
                    isIncrease={stats?.activeVehicles.isIncrease}
                />
                <StatCard
                    variant="purple"
                    icon={<IconUser />}
                    label="Tài xế đang chạy"
                    value={loadingStats ? "..." : formatNumber(stats?.activeDrivers.value || 0)}
                    trendValue={loadingStats ? "..." : formatTrend(stats?.activeDrivers.growth)}
                    isIncrease={stats?.activeDrivers.isIncrease}
                />
            </div>

            {/* CHARTS GRID: Biểu đồ */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <ChartCard
                    title="Xu hướng doanh thu"
                    isLoading={loadingChart}
                >
                    <RevenueChart data={chartData?.revenueTrends || []} />
                </ChartCard>

                <ChartCard
                    title="Doanh số bán vé tuần"
                    isLoading={loadingChart}
                >
                    <TicketSalesChart data={chartData?.weeklySales || []} />
                </ChartCard>
            </div>

            {/* TRIP TABLE SECTION: Bảng chuyến đi */}
            <div className="mt-6">
                <TripTable
                    // Data & Loading
                    data={trips}
                    isLoading={loadingTrips}

                    // Filter Logic
                    routes={routes}
                    filters={filters}
                    onFilterChange={handleFilterChange}

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