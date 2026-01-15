import { useState, useEffect } from "react";
import { ticketApi } from "../api/ticketApi";
import { BookingData } from "../types";

type TicketStatus = "Upcoming" | "Completed" | "Cancelled";

interface TicketCounts {
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
  totalCount: number;
}

interface UseMyTicketsReturn {
  tickets: BookingData[];
  counts: TicketCounts;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  activeTab: TicketStatus;
  setActiveTab: (tab: TicketStatus) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

export const useMyTickets = (
  token: string | null,
  pageSize: number = 20
): UseMyTicketsReturn => {
  const [activeTab, setActiveTab] = useState<TicketStatus>("Upcoming");
  const [tickets, setTickets] = useState<BookingData[]>([]);
  const [counts, setCounts] = useState<TicketCounts>({
    upcomingCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    totalCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ticket counts
  const fetchCounts = async () => {
    if (!token) return;

    try {
      const response = await ticketApi.getMyTicketsCount(token);
      if (response.success) {
        setCounts(response.data);
      }
    } catch (err) {
      console.error("Error fetching ticket counts:", err);
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        setError("Session expired. Please login again.");
      }
    }
  };

  // Fetch tickets based on active tab
  const fetchTickets = async () => {
    if (!token) {
      setError("Please login to view your tickets");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ticketApi.getMyTickets(
        token,
        activeTab,
        currentPage,
        pageSize
      );

      if (response.success) {
        setTickets(response.data.bookings);
        setTotalPages(response.data.totalPages);
        setIsFirst(response.data.isFirst);
        setIsLast(response.data.isLast);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      if (err instanceof Error) {
        if (err.message.includes("Unauthorized")) {
          setError("Session expired. Please login again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to fetch tickets");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts on mount
  useEffect(() => {
    if (token) {
      fetchCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Fetch tickets when tab or page changes
  useEffect(() => {
    if (token) {
      fetchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, token]);

  const handleSetActiveTab = (tab: TicketStatus) => {
    setActiveTab(tab);
    setCurrentPage(0); // Reset to first page when changing tabs
  };

  const refetch = () => {
    fetchCounts();
    fetchTickets();
  };

  return {
    tickets,
    counts,
    loading,
    error,
    currentPage,
    totalPages,
    isFirst,
    isLast,
    activeTab,
    setActiveTab: handleSetActiveTab,
    setPage: setCurrentPage,
    refetch,
  };
};
