"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/src/components/ClientContainer/ClientContainer";
import Pagination from "@/src/components/Pagination/Pagination";

import TripCard from "@/feature/booking/components/TripCard/TripCard";
import TripFilter from "@/feature/booking/components/TripFilter/TripFilter";
import TripSearch from "@/feature/booking/components/TripSearch/TripSearch";
import TripSort from "@/feature/booking/components/TripSort/TripSort";

import { useTrips } from "@/feature/trip/hooks/useTrips";
import styles from "./page.module.css";

export default function ClientBookingPage() {
  const router = useRouter();
  const [sort, setSort] = useState("recommended");

  // 👉 DÙNG HOOK useTrips
  const { trips, loading, currentPage, totalPages, fetchTrips, setPage } =
    useTrips();

  // ===== LOAD TRIPS LẦN ĐẦU =====
  useEffect(() => {
    fetchTrips({ page: 0 });
  }, [fetchTrips]);

  // ===== SORT =====
  const handleSortChange = (value: string) => {
    setSort(value);
    console.log("Sort:", value);
    // TODO: sort client-side hoặc gọi lại API nếu cần
  };

  // ===== SELECT SEAT =====
  const handleSelectSeat = (tripId: number) => {
    console.log("Select seats for trip:", tripId);
    sessionStorage.setItem("selectedTripId", tripId.toString());
    router.push("/client/booking-4");
  };

  // ===== PAGINATION =====
  const handlePageChange = (page: number) => {
    fetchTrips({ page });
  };

  return (
    <Container className="flex flex-col space-y-5 mx-auto">
      {/* SEARCH BAR */}
      <TripSearch />

      <div className={styles.content}>
        {/* FILTER */}
        <div className={styles.filter}>
          <TripFilter />
        </div>

        {/* MAIN CONTENT */}
        <div>
          <div className={styles.mainHeader}>
            <div>{trips.length} Trips Found</div>
            <TripSort value={sort} onSortChange={handleSortChange} />
          </div>

          {/* LIST */}
          {loading ? (
            <div>Loading trips...</div>
          ) : trips.length === 0 ? (
            <div>No trips found</div>
          ) : (
            <div className="flex flex-col space-y-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  tripDetail={trip}
                  handleSelectSeat={handleSelectSeat}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
