"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import TripFilterBar from "@/feature/trip/components/TripFilterBar/TripFilterBar";
import TripTimeline from "@/feature/trip/components/TripTimeline/TripTimeline";
import Pagination from "@/src/components/Pagination/Pagination";
import TripModal from "@/feature/trip/components/TripModal/TripModal";
import TripDetailsModal from "@/feature/trip/components/TripDetailsModal/TripDetailsModal";
import { useTrips } from "@/feature/trip/hooks/useTrips";
import { format } from "date-fns";
import { TripFormData, TripData } from "@/feature/trip/types";

export default function TripSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    trips,
    loading,
    currentPage,
    totalPages,
    totalElements,
    setPage,
    updateTripStatus,
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
  } = useTrips();

  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetchTrips({
      page: currentPage,
      status: selectedStatus,
      date: dateStr,
    });
  }, [selectedDate, currentPage, selectedStatus, fetchTrips]);

  const filteredTrips = trips.filter((t) =>
    t.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTripSubmit = async (data: TripFormData) => {
    const success = await createTrip(data);
    if (success) {
      setIsCreateModalOpen(false);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      fetchTrips({ page: 0, status: "", date: dateStr });
    }
  };

  const handleCardClick = (trip: TripData) => {
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
        title="Lịch trình chuyến xe"
        subtitle="Lập lịch và quản lý các chuyến xe"
        actionLabel="Tạo chuyến"
        onAction={() => {
          fetchSelectionData();
          setIsCreateModalOpen(true);
        }}
      />

      <TripFilterBar
        currentDate={selectedDate}
        onDateChange={(date) => {
          setSelectedDate(date);
          setPage(0);
        }}
        onSearch={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setPage(0);
        }}
      />

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            color: "var(--text-gray)",
          }}
        >
          Đang tải lịch trình...
        </div>
      ) : (
        <>
          {/* Total trips count */}
          {!loading && filteredTrips.length > 0 && (
            <div style={{ 
              padding: '12px 16px', 
              marginBottom: '16px', 
              backgroundColor: 'var(--background)', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              Tổng số: <strong>{totalElements}</strong> chuyến xe
            </div>
          )}

          <TripTimeline
            trips={filteredTrips}
            onStatusUpdate={updateTripStatus}
            onCardClick={handleCardClick}
          />

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
        </>
      )}

      {/* Modal tạo chuyến mới */}
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

      {/* Modal chi tiết chuyến (sửa / xóa) */}
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
