"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/src/components/PageHeader/PageHeader";
// import TripFilterBar from "@/feature/trip/components/TripFilterBar/TripFilterBar"; // <-- BỎ
// import TripTimeline from "@/feature/trip/components/TripTimeline/TripTimeline";   // <-- BỎ
import TripTable from "@/feature/trip/components/TripTable/TripTable"; // <-- THÊM MỚI
import Pagination from "@/src/components/Pagination/Pagination";
import TripModal from "@/feature/trip/components/TripModal/TripModal";
import TripDetailsModal from "@/feature/trip/components/TripDetailsModal/TripDetailsModal";
import { useTrips } from "@/feature/trip/hooks/useTrips";
import { format } from "date-fns";
import { TripFormData, TripData } from "@/feature/trip/types";

export default function TripSchedulingPage() {
    // State Filter
    const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedRouteId, setSelectedRouteId] = useState<string>(""); // <-- THÊM MỚI Route State

    // State Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Hook logic
    const {
        trips,
        loading,
        currentPage,
        totalPages,
        setPage,
        fetchTrips,
        createTrip,
        isCreating,
        routes,
        vehicles,
        drivers,
        subDrivers,
        fetchSelectionData,
        loadingSelection,
        deleteTrip,
        updateTripInfo,
        updateTripStatus,
    } = useTrips();

    // 1. Load dữ liệu Route/Xe/Tài xế ngay khi vào trang để Dropdown Route hoạt động
    useEffect(() => {
        fetchSelectionData();
    }, [fetchSelectionData]);

    // 2. Load trips khi bất kỳ filter nào thay đổi
    useEffect(() => {
        fetchTrips({
            page: currentPage,
            status: selectedStatus === "ALL" ? undefined : selectedStatus,
            date: selectedDateStr,
            routeId: selectedRouteId ? Number(selectedRouteId) : undefined, // <-- Truyền routeId
        });
    }, [selectedDateStr, currentPage, selectedStatus, selectedRouteId, fetchTrips]);

    // Xử lý tạo mới
    const handleCreateTripSubmit = async (data: TripFormData) => {
        const success = await createTrip(data);
        if (success) {
            setIsCreateModalOpen(false);
            // Refresh lại list về trang 1
            setPage(0);
            fetchTrips({
                page: 0,
                status: selectedStatus,
                date: selectedDateStr,
                routeId: selectedRouteId ? Number(selectedRouteId) : undefined
            });
        }
    };

    // Xử lý khi click "Chi tiết" trong Table
    const handleDetailClick = (trip: TripData) => {
        fetchSelectionData();
        setSelectedTrip(trip);
        setIsDetailsModalOpen(true);
    };

    return (
        <div
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                minHeight: "100vh",
                transition: "background-color 0.2s ease, color 0.2s ease",
            }}
        >
            <PageHeader
                title="Trip Scheduling"
                subtitle="Schedule and manage bus trips"
                actionLabel="Schedule Trip"
                onAction={() => {
                    fetchSelectionData();
                    setIsCreateModalOpen(true);
                }}
            />

            {/* Thay thế TripFilterBar và TripTimeline bằng TripTable */}
            <div>
                <TripTable
                    // Data
                    trips={trips}
                    loading={loading}
                    routes={routes}

                    // Filters Binding
                    dateFilter={selectedDateStr}
                    setDateFilter={(d) => { setSelectedDateStr(d); setPage(0); }}

                    statusFilter={selectedStatus}
                    setStatusFilter={(s) => { setSelectedStatus(s); setPage(0); }}

                    routeFilter={selectedRouteId}
                    setRouteFilter={(r) => { setSelectedRouteId(r); setPage(0); }}

                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}

                    // Action Binding
                    onDetailClick={handleDetailClick}
                    onStatusUpdate={updateTripStatus}
                />

                {/* Pagination giữ nguyên ở ngoài */}
                {totalPages > 1 && (
                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal Tạo Chuyến Mới */}
            <TripModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTripSubmit}
                routes={routes}
                vehicles={vehicles}
                drivers={drivers}
                subDrivers={subDrivers}
                isLoading={isCreating || loadingSelection}
            />

            {/* Modal Chi Tiết Trip (Edit/Delete) */}
            <TripDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                trip={selectedTrip}
                vehicles={vehicles}
                drivers={drivers}
                subDrivers={subDrivers}
                onDelete={deleteTrip}
                onUpdate={updateTripInfo}
            />
        </div>
    );
}