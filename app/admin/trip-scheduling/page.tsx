"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import TripFilterBar from "@/feature/trip/components/TripFilterBar/TripFilterBar";
import TripTimeline from "@/feature/trip/components/TripTimeline/TripTimeline";
import Pagination from "@/src/components/Pagination/Pagination";
import TripModal from "@/feature/trip/components/TripModal/TripModal";
import { useTrips } from "@/feature/trip/hooks/useTrips";
import { format } from "date-fns";
import { TripFormData } from "@/feature/trip/types";

export default function TripSchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    fetchSelectionData,
    loadingSelection,
  } = useTrips();

  // Load trips khi đổi ngày hoặc đổi trang
  useEffect(() => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    fetchTrips({
      page: currentPage,
      status: "",
      date: dateStr,
    });
  }, [selectedDate, currentPage, fetchTrips]);

  // Client-side search (hoặc truyền vào API nếu BE hỗ trợ)
  const filteredTrips = trips.filter((t) =>
    t.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTripSubmit = async (data: TripFormData) => {
    const success = await createTrip(data);
    if (success) {
      setIsModalOpen(false);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      fetchTrips({ page: 0, status: "", date: dateStr });
    }
  };

  return (
    <div
      style={{
        padding: "8px 12px",
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
          setIsModalOpen(true);
        }}
      />

      {/* Filter Bar Mới có Calendar Popup */}
      <TripFilterBar
        currentDate={selectedDate}
        onDateChange={(date) => {
          setSelectedDate(date);
          setPage(0);
        }}
        onSearch={setSearchTerm}
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

      {/* Modal Tạo Chuyến */}
      <TripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTripSubmit}
        routes={routes}
        vehicles={vehicles}
        drivers={drivers}
        isLoading={isCreating || loadingSelection}
      />
    </div>
  );
}
