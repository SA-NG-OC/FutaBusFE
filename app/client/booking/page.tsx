"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  // 🎫 DÙNG fetchTripsForBooking CHO CLIENT
  const {
    trips,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchTripsForBooking,
  } = useTrips();

  // ===== PARSE URL PARAMS =====
  const getParamsFromURL = useCallback(() => {
    return {
      page: parseInt(searchParams?.get("page") || "0"),
      originId: searchParams?.get("originId")
        ? parseInt(searchParams.get("originId")!)
        : undefined,
      destId: searchParams?.get("destId")
        ? parseInt(searchParams.get("destId")!)
        : undefined,
      date: searchParams?.get("date") || undefined,
      sortBy:
        (searchParams?.get("sortBy") as "price" | "departureTime" | "rating") ||
        "departureTime",
      sortDir: (searchParams?.get("sortDir") as "asc" | "desc") || "asc",
      minPrice: searchParams?.get("minPrice")
        ? parseInt(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams?.get("maxPrice")
        ? parseInt(searchParams.get("maxPrice")!)
        : undefined,
      timeRanges: searchParams?.get("timeRanges")
        ? (searchParams.get("timeRanges")!.split(",") as any)
        : undefined,
      vehicleTypes: searchParams?.get("vehicleTypes")
        ? searchParams.get("vehicleTypes")!.split(",")
        : undefined,
    };
  }, [searchParams]);

  // ===== FETCH TRIPS DỰA TRÊN URL =====
  useEffect(() => {
    const params = getParamsFromURL();
    fetchTripsForBooking(params);
  }, [searchParams, fetchTripsForBooking, getParamsFromURL]);

  // ===== UPDATE URL =====
  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`/client/booking?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // ===== HANDLERS =====
  const handleSearch = useCallback(
    (searchParams: { originId?: number; destId?: number; date?: string }) => {
      updateURL({
        originId: searchParams.originId?.toString(),
        destId: searchParams.destId?.toString(),
        date: searchParams.date,
        page: "0", // Reset to first page
      });
    },
    [updateURL]
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortDir: string) => {
      updateURL({ sortBy, sortDir, page: "0" });
    },
    [updateURL]
  );

  const handleFilterChange = useCallback(
    (filters: {
      minPrice?: number;
      maxPrice?: number;
      timeRanges?: string[];
      vehicleTypes?: string[];
    }) => {
      updateURL({
        minPrice: filters.minPrice?.toString(),
        maxPrice: filters.maxPrice?.toString(),
        timeRanges: filters.timeRanges?.join(","),
        vehicleTypes: filters.vehicleTypes?.join(","),
        page: "0",
      });
    },
    [updateURL]
  );

  const handleSelectSeat = (tripId: number) => {
    sessionStorage.setItem("selectedTripId", tripId.toString());
    router.push("/client/booking-4");
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  return (
    <Container className="flex flex-col space-y-5 mx-auto">
      {/* SEARCH BAR */}
      <TripSearch onSearch={handleSearch} />

      <div className={styles.content}>
        {/* FILTER */}
        <div className={styles.filterbar}>
          <TripFilter onFilterChange={handleFilterChange} />
        </div>

        {/* MAIN CONTENT */}
        <div>
          <div className={styles.mainHeader}>
            <div>
              {totalElements > 0
                ? `${totalElements} trips found`
                : "No trips found"}
            </div>
            <TripSort onSortChange={handleSortChange} />
          </div>

          {/* LIST */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-[#D83E3E]"></div>
              <p className="mt-3 text-gray-600">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No trips match your search criteria.
              </p>
              <button
                onClick={() => router.push("/client/booking")}
                className="text-[#D83E3E] hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
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
