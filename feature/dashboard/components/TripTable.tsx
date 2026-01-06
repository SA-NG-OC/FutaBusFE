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

const getStatusBadgeClasses = (status: string) => {
    switch (status) {
        case 'Running': return 'bg-badge-running-bg text-badge-running-text';
        case 'Waiting': return 'bg-badge-waiting-bg text-badge-waiting-text';
        case 'Delayed': return 'bg-badge-delayed-bg text-badge-delayed-text';
        case 'Completed': return 'bg-badge-completed-bg text-badge-completed-text';
        case 'Cancelled': return 'bg-badge-cancelled-bg text-badge-cancelled-text';
        default: return 'bg-bg-hover text-text-gray';
    }
};

const TripTable = ({ data, isLoading, pagination }: TripTableProps) => {

    if (isLoading) {
        return (
            <div className="bg-background-paper border border-border-gray rounded-[14px] w-full p-6 shadow-sm min-h-[300px] flex items-center justify-center">
                <p className="text-text-gray">Loading trips data...</p>
            </div>
        );
    }

    return (
        <div className="bg-background-paper border border-border-gray rounded-[14px] w-full p-6 shadow-sm overflow-hidden">
            <h2 className="text-foreground text-base font-normal mb-6">Today's Trips</h2>
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                        <tr className="border-b border-border-gray h-12">
                            {/* ĐỔI: font-bold -> font-medium (Tiêu đề bảng nhạt lại) */}
                            <th className="text-left font-medium text-foreground pl-4 pb-2 w-[15%]">Trip ID</th>
                            <th className="text-left font-medium text-foreground pl-4 pb-2 w-[30%]">Route</th>
                            <th className="text-left font-medium text-foreground pl-4 pb-2 w-[20%]">Status</th>
                            <th className="text-left font-medium text-foreground pl-4 pb-2 w-[20%]">Departure</th>
                            <th className="text-left font-medium text-foreground pl-4 pb-2 w-[15%]">Seats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((trip, index) => (
                                <tr key={index} className="border-b border-border-gray h-12 last:border-b-0 hover:bg-bg-hover transition-colors">
                                    {/* ĐỔI: Xóa class font-mono để dùng font Arimo cho ID luôn */}
                                    <td className="text-foreground pl-4 py-3">{trip.tripIdDisplay}</td>
                                    <td className="text-foreground pl-4 py-3">{trip.routeName}</td>
                                    <td className="pl-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-[4px] text-sm font-normal leading-5 whitespace-nowrap ${getStatusBadgeClasses(trip.status)}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="text-foreground pl-4 py-3">
                                        {trip.departure ? trip.departure.substring(0, 5) : '--:--'}
                                    </td>
                                    <td className="text-foreground pl-4 py-3">{trip.seatsInfo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-text-gray">No trips found for today</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border-gray">
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                        className="px-3 py-1 text-sm border border-border-gray text-text-gray rounded hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-text-gray">
                        Page {pagination.currentPage + 1} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages - 1}
                        className="px-3 py-1 text-sm border border-border-gray text-text-gray rounded hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripTable;