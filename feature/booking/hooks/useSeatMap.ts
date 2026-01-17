"use client";

import { useState, useCallback } from "react";
import { SeatMapResponse, TripInfoForBooking } from "../types";
import { bookingApi } from "../api/bookingApi";

export const useSeatMap = () => {
  const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);
  const [tripInfo, setTripInfo] = useState<TripInfoForBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch seat map
  const fetchSeatMap = useCallback(async (tripId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingApi.getSeatMap(tripId);
      setSeatMap(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch seat map";
      setError(message);
      console.error("Fetch Seat Map Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch trip info
  const fetchTripInfo = useCallback(async (tripId: number) => {
    try {
      const data = await bookingApi.getTripInfo(tripId);
      setTripInfo(data);
      return data;
    } catch (err) {
      console.error("Fetch Trip Info Error:", err);
      return null;
    }
  }, []);

  // Fetch both seat map and trip info
  const fetchBookingData = useCallback(async (tripId: number) => {
    setLoading(true);
    setError(null);
    try {
      const [seatMapData, tripInfoData] = await Promise.all([
        bookingApi.getSeatMap(tripId),
        bookingApi.getTripInfo(tripId).catch(() => null), // Trip info is optional
      ]);

      setSeatMap(seatMapData);
      if (tripInfoData) {
        setTripInfo(tripInfoData);
      }

      return { seatMap: seatMapData, tripInfo: tripInfoData };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch booking data";
      setError(message);
      console.error("Fetch Booking Data Error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    seatMap,
    tripInfo,
    loading,
    error,
    fetchSeatMap,
    fetchTripInfo,
    fetchBookingData,
  };
};
