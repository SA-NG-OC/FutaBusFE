// src/feature/trip/components/TripTable/TripTable.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    FaBus,
    FaUser,
    FaCalendarAlt,
    FaFilter,
    FaMapMarkerAlt,
    FaClock,
    FaChevronDown,
} from "react-icons/fa";
import { TripData, RouteSelection } from "../../types";

// --- Sub-component: Status Dropdown ---
interface StatusDropdownProps {
    currentStatus: string;
    tripId: number;
    onUpdate: (id: number, newStatus: string) => void;
    index: number;      // Thêm vị trí dòng
    totalItems: number; // Thêm tổng số dòng để tính toán hướng mở
}

const StatusDropdown = ({
    currentStatus,
    tripId,
    onUpdate,
    index,
    totalItems
}: StatusDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const statusOptions = ["Waiting", "Running", "Completed", "Cancelled"];

    // Logic: Nếu là 2 dòng cuối cùng thì mở menu lên trên, còn lại mở xuống dưới
    const openUpwards = index >= totalItems - 2 && totalItems > 2;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusBadgeStyle = (status: string) => {
        const s = status?.toUpperCase();
        switch (s) {
            case "RUNNING":
                return "bg-[var(--badge-running-bg)] text-[var(--badge-running-text)] border-[var(--badge-running-border)]";
            case "COMPLETED":
                return "bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] border-[var(--badge-completed-border)]";
            case "CANCELLED":
                return "bg-[var(--badge-cancelled-bg)] text-[var(--badge-cancelled-text)] border-[var(--badge-cancelled-border)]";
            default:
                return "bg-[var(--badge-waiting-bg)] text-[var(--badge-waiting-text)] border-[var(--badge-waiting-border)]";
        }
    };

    const handleOptionClick = (e: React.MouseEvent, status: string) => {
        e.stopPropagation();
        if (status !== currentStatus) {
            onUpdate(tripId, status);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${getStatusBadgeStyle(
                    currentStatus
                )}`}
            >
                {currentStatus}
                <FaChevronDown size={10} />
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 w-32 z-50 rounded-md bg-[var(--background-paper)] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border-gray)]
            ${openUpwards ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"} 
          `}
                >
                    <div className="py-1">
                        {statusOptions.map((option) => (
                            <div
                                key={option}
                                onClick={(e) => handleOptionClick(e, option)}
                                className={`block px-4 py-2 text-sm cursor-pointer hover:bg-[var(--bg-hover)] transition-colors ${option === currentStatus
                                        ? "font-bold text-[var(--primary)]"
                                        : "text-[var(--text-primary)]"
                                    }`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
interface TripTableProps {
    trips: TripData[];
    loading: boolean;
    routes: RouteSelection[];
    dateFilter: string;
    setDateFilter: (date: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    routeFilter: string;
    setRouteFilter: (routeId: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onDetailClick: (trip: TripData) => void;
    onStatusUpdate: (id: number, newStatus: string) => void;
}

const TripTable = ({
    trips,
    loading,
    routes,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    routeFilter,
    setRouteFilter,
    searchQuery,
    setSearchQuery,
    onDetailClick,
    onStatusUpdate,
}: TripTableProps) => {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(val);

    const formatTime = (timeStr: string) => timeStr?.substring(0, 5) || "--:--";

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB");
    };

    return (
        <div className="w-full space-y-6">
            {/* === Filter Bar === */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-[var(--border-gray)] bg-[var(--background-paper)] shadow-sm">
                {/* Date Picker */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                        <FaCalendarAlt />
                    </div>
                    <input
                        type="date"
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                {/* Route Selector */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                        <FaMapMarkerAlt />
                    </div>
                    <select
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none"
                        value={routeFilter}
                        onChange={(e) => setRouteFilter(e.target.value)}
                    >
                        <option value="">All Routes</option>
                        {routes.map((route) => (
                            <option key={route.routeId} value={route.routeId}>
                                {route.routeName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Selector */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-secondary)]">
                        <FaFilter />
                    </div>
                    <select
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] appearance-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* === Table Section === */}
            {/* QUAN TRỌNG: Dùng overflow-visible để Dropdown không bị cắt */}
            {/* Bỏ min-h-[400px] để không bị khoảng trắng thừa */}
            <div className="rounded-xl border border-[var(--border-gray)] bg-[var(--background-paper)] shadow-sm overflow-visible">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-gray)]">
                        <tr>
                            {/* Thêm rounded cho góc trên trái và phải của header vì thẻ cha không còn overflow-hidden */}
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)] rounded-tl-xl">
                                ID
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Route Info
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Time
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Vehicle / Driver
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Seats
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Price
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                                Status
                            </th>
                            <th className="px-6 py-4 font-semibold text-[var(--text-primary)] text-right rounded-tr-xl">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-gray)]">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-8 text-center text-[var(--text-secondary)]"
                                >
                                    Loading trips data...
                                </td>
                            </tr>
                        ) : trips.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-8 text-center text-[var(--text-secondary)]"
                                >
                                    No trips found for the selected filters.
                                </td>
                            </tr>
                        ) : (
                            trips.map((trip, index) => (
                                <tr
                                    key={trip.tripId}
                                    className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                                    onClick={() => onDetailClick(trip)}
                                >
                                    <td className="px-6 py-4 font-medium text-[var(--text-primary)]">
                                        #{trip.tripId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[var(--text-primary)]">
                                            {trip.routeName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1 text-[var(--text-primary)] font-medium">
                                                <FaClock className="text-[var(--text-secondary)] text-xs" />
                                                {formatTime(trip.departureTime)} -{" "}
                                                {formatTime(trip.arrivalTime)}
                                            </div>
                                            <span className="text-xs text-[var(--text-secondary)] mt-1">
                                                {formatDate(trip.date || dateFilter)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                                                <FaBus className="text-[var(--text-secondary)]" />
                                                {trip.vehicleInfo}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                                <FaUser />
                                                {trip.driverName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[var(--text-primary)]">
                                            <span className="font-bold text-[var(--primary)]">
                                                {trip.bookedSeats || 0}
                                            </span>
                                            <span className="text-[var(--text-secondary)]">
                                                /{trip.totalSeats || 40}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[var(--primary)]">
                                        {formatCurrency(trip.price)}
                                    </td>

                                    {/* Status Dropdown */}
                                    <td className="px-6 py-4">
                                        <StatusDropdown
                                            currentStatus={trip.status}
                                            tripId={trip.tripId}
                                            onUpdate={onStatusUpdate}
                                            index={index}
                                            totalItems={trips.length}
                                        />
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDetailClick(trip);
                                            }}
                                            className="px-3 py-1.5 rounded text-xs font-medium bg-[var(--btn-cancel-bg)] text-[var(--text-primary)] hover:bg-[var(--btn-cancel-hover)] transition-colors"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TripTable;