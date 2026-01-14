import React from 'react';
import { DashboardTripDTO } from '../types';

interface TripTableProps {
    data: DashboardTripDTO[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

// Helper function: Chuyển class badge sang dạng [var(--...)]
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

const TripTable = ({ data, isLoading, pagination }: TripTableProps) => {
    const today = new Date().toLocaleDateString('vi-VN');

    if (isLoading) {
        return (
            // SỬA: bg-[var(--background-paper)], border-[var(--border-gray)]
            <div className="bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-[14px] w-full p-6 shadow-sm min-h-[300px] flex items-center justify-center">
                <p className="text-[var(--text-gray)] animate-pulse">Loading trips data...</p>
            </div>
        );
    }

    return (
        // SỬA: Container chính
        <div className="bg-[var(--background-paper)] border border-[var(--border-gray)] rounded-[14px] w-full p-4 md:p-6 shadow-sm overflow-hidden">
            <h2 className="text-[var(--foreground)] text-base font-normal mb-4 md:mb-6">
                Trips Today <span className="text-[var(--text-gray)] text-sm ml-2">({today})</span>
            </h2>

            {/* Wrapper cho Scroll ngang */}
            <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        {/* SỬA: Border bottom */}
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
                                    // SỬA: Hover bg và border bottom
                                    className="border-b border-[var(--border-gray)] h-12 last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors"
                                >
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap">{trip.tripIdDisplay}</td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm min-w-[150px]">{trip.routeName}</td>
                                    <td className="pl-4 py-3">
                                        {/* Badge classes đã được xử lý ở hàm getStatusBadgeClasses */}
                                        <span className={`inline-block px-2 py-1 rounded-[4px] text-xs font-normal leading-4 whitespace-nowrap ${getStatusBadgeClasses(trip.status)}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap">
                                        {trip.departure ? trip.departure.substring(0, 5) : '--:--'}
                                    </td>
                                    <td className="text-[var(--foreground)] pl-4 py-3 text-sm whitespace-nowrap">{trip.seatsInfo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-[var(--text-gray)] text-sm">No trips found for today</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-gray)]">
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                        // SỬA: Button styles
                        className="px-3 py-1 text-sm border border-[var(--border-gray)] text-[var(--text-gray)] rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-[var(--text-gray)]">
                        Page {pagination.currentPage + 1} / {pagination.totalPages}
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