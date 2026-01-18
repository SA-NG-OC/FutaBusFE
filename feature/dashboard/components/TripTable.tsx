import React from 'react';
import { DashboardTripDTO, RouteSelection } from '../types'; // Đảm bảo đường dẫn import đúng

// Định nghĩa Props cho Table
interface TripTableProps {
    data: DashboardTripDTO[];
    isLoading?: boolean;

    // Props mới cho bộ lọc
    routes?: RouteSelection[]; // Danh sách các tuyến xe để fill vào dropdown
    filters?: {
        date: string;          // yyyy-mm-dd
        routeId: number | null;
    };
    onFilterChange?: (key: 'date' | 'routeId', value: any) => void;

    // Props phân trang cũ
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

// Helper: Map màu sắc status (giữ nguyên logic cũ của bạn)
const getStatusBadgeClasses = (status: string) => {
    switch (status) {
        case 'Running': return 'bg-[var(--badge-running-bg)] text-[var(--badge-running-text)]';
        case 'Waiting': return 'bg-[var(--badge-waiting-bg)] text-[var(--badge-waiting-text)]';
        case 'Delayed': return 'bg-[var(--badge-delayed-bg)] text-[var(--badge-delayed-text)]';
        case 'Completed': return 'bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)]';
        case 'Cancelled': return 'bg-[var(--badge-cancelled-bg)] text-[var(--badge-cancelled-text)]';
        default: return 'bg-[var(--bg-hover)] text-[var(--text-gray)]';
    }
};

const TripTable = ({
    data,
    isLoading,
    pagination,
    routes = [],
    filters = { date: new Date().toISOString().split('T')[0], routeId: null },
    onFilterChange
}: TripTableProps) => {

    // Xử lý khi chọn ngày
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onFilterChange) {
            onFilterChange('date', e.target.value);
        }
    };

    // Xử lý khi chọn Route (cần chuyển từ string value của option sang number)
    const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (onFilterChange) {
            // Nếu value rỗng (All Routes) thì gửi null, ngược lại gửi number
            onFilterChange('routeId', value ? Number(value) : null);
        }
    };

    // UI Loading
    if (isLoading) {
        return (
            <div className="bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-[14px] w-full p-6 shadow-sm min-h-[300px] flex items-center justify-center">
                <p className="text-[var(--text-gray)] animate-pulse">Loading trips data...</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-[14px] w-full p-4 md:p-6 shadow-sm overflow-hidden">

            {/* === PHẦN HEADER & FILTER === */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-[var(--foreground)] text-base font-normal">
                        Trips Schedule
                    </h2>
                    <p className="text-[var(--text-gray)] text-sm mt-1">
                        Viewing trips for {filters.date}
                    </p>
                </div>

                {/* Khu vực điều khiển Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* 1. Date Picker */}
                    <input
                        type="date"
                        value={filters.date}
                        onChange={handleDateChange}
                        className="h-10 px-3 bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-md text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500 cursor-pointer"
                    />

                    {/* 2. Route Select Dropdown */}
                    <select
                        value={filters.routeId || ''}
                        onChange={handleRouteChange}
                        className="h-10 px-3 bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-md text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500 min-w-[200px] cursor-pointer"
                    >
                        <option value="">All Routes</option>
                        {routes.map((route) => (
                            <option key={route.routeId} value={route.routeId}>
                                {route.routeName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* === PHẦN BẢNG DỮ LIỆU === */}
            <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-gray)] h-10 md:h-12">
                            <th className="text-left font-medium text-[var(--foreground)] pl-4 pb-2 w-[15%] text-sm">Trip ID</th>
                            <th className="text-left font-medium text-[var(--foreground)] pl-4 pb-2 w-[30%] text-sm">Route</th>
                            <th className="text-left font-medium text-[var(--foreground)] pl-4 pb-2 w-[20%] text-sm">Status</th>
                            <th className="text-left font-medium text-[var(--foreground)] pl-4 pb-2 w-[20%] text-sm">Departure</th>
                            <th className="text-left font-medium text-[var(--foreground)] pl-4 pb-2 w-[15%] text-sm">Seats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((trip, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[var(--border-gray)] h-12 last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors"
                                >
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap font-medium">
                                        {trip.tripIdDisplay}
                                    </td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm min-w-[150px]">
                                        {trip.routeName}
                                    </td>
                                    <td className="pl-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-[4px] text-xs font-normal leading-4 whitespace-nowrap ${getStatusBadgeClasses(trip.status)}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap">
                                        {/* Cắt chuỗi HH:mm:ss thành HH:mm cho gọn */}
                                        {trip.departure ? trip.departure.substring(0, 5) : '--:--'}
                                    </td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap">
                                        {trip.seatsInfo}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-[var(--text-gray)] text-sm">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <span>No trips found</span>
                                        <span className="text-xs opacity-70">Try selecting a different date or route</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* === PHÂN TRANG (PAGINATION) === */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-gray)]">
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                        className="px-3 py-1 text-sm border border-[var(--border-gray)] text-[var(--text-gray)] rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-[var(--text-gray)] font-medium">
                        Page {pagination.currentPage + 1} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages - 1}
                        className="px-3 py-1 text-sm border border-[var(--border-gray)] text-[var(--text-gray)] rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripTable;