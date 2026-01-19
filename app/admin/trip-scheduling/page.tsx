"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import TripFilterBar from "@/feature/trip/components/TripFilterBar/TripFilterBar";
import TripTimeline from "@/feature/trip/components/TripTimeline/TripTimeline";
import Pagination from "@/src/components/Pagination/Pagination";
import TripModal from "@/feature/trip/components/TripModal/TripModal";
import TripDetailsModal from "@/feature/trip/components/TripDetailsModal/TripDetailsModal"; // Import Modal chi tiết
import { useTrips } from "@/feature/trip/hooks/useTrips";
import { format } from "date-fns";
import { TripFormData, TripData } from "@/feature/trip/types";

export default function TripSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // "" = All statuses (default: Waiting + Running)

  // State quản lý Modal Tạo Mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State quản lý Modal Chi Tiết
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Hook logic
  const {
    trips,
    loading,
    currentPage,
    totalPages,
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
    // Lấy thêm 2 hàm mới từ hook
    deleteTrip,
    updateTripInfo,
  } = useTrips();

  // Load trips khi đổi ngày hoặc đổi trang hoặc đổi status
  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetchTrips({
      page: currentPage,
      status: selectedStatus,
      date: dateStr,
    });
  }, [selectedDate, currentPage, selectedStatus, fetchTrips]);

  // Client-side search
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

  // Xử lý khi click vào Card trên Timeline
  const handleCardClick = (trip: TripData) => {
    fetchSelectionData(); // Load data cho dropdown trong modal chi tiết
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
          setPage(0); // Reset to first page when changing status
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
          Loading timeline...
        </div>
      ) : (
        <>
          <TripTimeline
            trips={filteredTrips}
            onStatusUpdate={updateTripStatus}
            onCardClick={handleCardClick} // Truyền sự kiện click xuống
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
