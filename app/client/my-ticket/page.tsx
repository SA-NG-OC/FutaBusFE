"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import TicketCard from "@/feature/ticket/components/TicketCard";
import { useMyTickets } from "@/feature/ticket/hooks/useMyTickets";
import { useAuth } from "@/src/context/AuthContext";

export default function MyTicketsPage() {
  const router = useRouter();
  const {
    token,
    isAuthenticated,
    isLoading: authLoading,
    openLoginModal,
  } = useAuth();

  // Redirect or show login modal if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Open login modal instead of redirecting
      openLoginModal();
      // Optionally redirect to home page
      router.push("/client/home");
    }
  }, [authLoading, isAuthenticated, openLoginModal, router]);

  const {
    tickets,
    counts,
    loading,
    error,
    currentPage,
    totalPages,
    isFirst,
    isLast,
    activeTab,
    setActiveTab,
    setPage,
  } = useMyTickets(token);

  const handleViewDetails = (bookingCode: string) => {
    console.log("View details for booking:", bookingCode);
    // Navigate to ticket lookup with booking code
    router.push(`/client/ticket-lookup?code=${bookingCode}`);
  };

  const handlePreviousPage = () => {
    if (!isFirst) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLast) {
      setPage(currentPage + 1);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect will happen in useEffect
  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tickets</h1>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "Upcoming" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("Upcoming")}
        >
          Upcoming ({counts.upcomingCount})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "Completed" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed ({counts.completedCount})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "Cancelled" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("Cancelled")}
        >
          Cancelled ({counts.cancelledCount})
        </button>
      </div>

      {error && (
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      <div className={styles.ticketList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading tickets...</p>
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((booking) => (
            <TicketCard
              key={booking.bookingId}
              bookingReference={booking.bookingCode}
              status={
                activeTab === "Upcoming"
                  ? "Upcoming"
                  : activeTab === "Completed"
                  ? "Completed"
                  : "Cancelled"
              }
              from={
                booking.tripInfo.pickupLocationName ||
                booking.tripInfo.routeName.split(" - ")[0]
              }
              to={
                booking.tripInfo.dropoffLocationName ||
                booking.tripInfo.routeName.split(" - ")[1]
              }
              date={new Date(booking.tripInfo.departureTime).toLocaleDateString(
                "vi-VN"
              )}
              departureTime={new Date(
                booking.tripInfo.departureTime
              ).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              seats={booking.tickets.map((t) => t.seatNumber).join(", ")}
              price={booking.totalAmount}
              onViewDetails={() => handleViewDetails(booking.bookingCode)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className={styles.emptyText}>
              No {activeTab.toLowerCase()} tickets found
            </p>
            <p className={styles.emptySubtext}>
              Your {activeTab.toLowerCase()} tickets will appear here
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && tickets.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={handlePreviousPage}
            disabled={isFirst}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className={styles.paginationBtn}
            onClick={handleNextPage}
            disabled={isLast}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
