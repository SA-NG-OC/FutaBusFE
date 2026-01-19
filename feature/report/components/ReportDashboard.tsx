// /features/reports/components/ReportDashboard.tsx
'use client';
import React, { useState } from 'react';
import { useReportData } from '../hooks/useReportData';
import ReportHeader from './ReportHeader';
import SummaryCards from './SummaryCards';
import RevenueChart from './RevenueChart';
import ShiftChart from './ShiftChart';
import TopRoutesTable from './TopRoutesTable';
import { reportApi } from '../api/reportApi';

const ReportDashboard = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [filter, setFilter] = useState({ month: currentMonth, year: currentYear });
    const [isExporting, setIsExporting] = useState(false);

    const { summary, weeklyRevenue, shiftRevenue, topRoutes, loading } =
        useReportData(filter.month, filter.year);

    const handleFilterChange = (key: 'month' | 'year', value: number) => {
        setFilter(prev => ({ ...prev, [key]: value }));
    };

    const handleExport = async () => {
        try {
            setIsExporting(true); // Bắt đầu loading

            // Gọi API export (hàm này sẽ mất vài giây để tải file)
            await reportApi.exportReport({ month: filter.month, year: filter.year });

        } catch (error) {
            alert("Lỗi khi xuất báo cáo. Vui lòng thử lại.");
        } finally {
            setIsExporting(false); // Kết thúc loading
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <ReportHeader
                    month={filter.month}
                    year={filter.year}
                    onFilterChange={handleFilterChange}
                    onExport={handleExport}
                    isExporting={isExporting}
                />

                {/* Loading Overlay */}
                {loading && !summary && (
                    <div className="text-center py-20 text-[var(--text-gray)]">
                        Đang tải dữ liệu bảng điều khiển...
                    </div>
                )}

                {/* Main Content */}
                <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
                    {/* KPI Cards */}
                    <SummaryCards data={summary} />

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <RevenueChart data={weeklyRevenue} />
                        <ShiftChart data={shiftRevenue} />
                    </div>

                    {/* Bottom Section: Top Routes & (Optional) Payment Method */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Routes chiếm toàn bộ chiều ngang */}
                        <div className="lg:col-span-2">
                            <TopRoutesTable routes={topRoutes} />
                        </div>

                        {/* Placeholder phương thức thanh toán (API chưa có)
                        <div className="bg-[var(--background-paper)] p-6 rounded-xl border border-[var(--border-gray)] shadow-sm flex flex-col items-center justify-center">
                            <h3 className="w-full text-lg font-semibold text-[var(--foreground)] mb-4 text-left">
                                Phương thức thanh toán
                            </h3>
                            <div className="w-48 h-48 rounded-full border-8 border-[var(--bg-beige)] flex items-center justify-center text-[var(--text-gray)]">
                                Biểu đồ đang cập nhật
                            </div>
                            <p className="text-sm text-[var(--text-gray)] mt-4 text-center">
                                (Dữ liệu sẽ được bổ sung sau)
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDashboard;
