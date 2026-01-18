// React hooks for Ticket Management

import { useState, useEffect, useCallback } from "react";
import { ticketApi } from "../api/ticketApi";
import { BookingData } from "../types";

export const useTickets = (
  page: number = 0,
  size: number = 20,
  status: string | null = null,
  search: string = ""
) => {
  const [tickets, setTickets] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketApi.getAllTickets(
        page,
        size,
        status,
        search
      );
      setTickets(response.bookings);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setIsFirst(response.isFirst);
      setIsLast(response.isLast);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, [page, size, status, search]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const confirmBooking = async (bookingId: number) => {
    try {
      await ticketApi.confirmBooking(bookingId);
      await fetchTickets();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm booking"
      );
      return false;
    }
  };

  const cancelBooking = async (bookingId: number, userId: number = 1) => {
    try {
      await ticketApi.cancelBooking(bookingId, userId);
      await fetchTickets(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
      return false;
    }
  };

  return {
    tickets,
    loading,
    error,
    totalPages,
    totalElements,
    isFirst,
    isLast,
    refreshTickets: fetchTickets,
    confirmBooking,
    cancelBooking,
  };
};
