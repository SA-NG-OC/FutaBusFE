"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import TicketCard from "@/feature/ticket/components/TicketCard";
import { useMyTickets } from "@/feature/ticket/hooks/useMyTickets";
import { useAuth } from "@/src/context/AuthContext";
import { ticketApi } from "@/feature/ticket/api/ticketApi";
import TicketDetailModal from "@/feature/ticket/components/TicketDetailModal";

export default function MyTicketsPage() {
  const router = useRouter();
  const {
    token,
    isAuthenticated,
    isLoading: authLoading,
    openLoginModal,
    user,
  } = useAuth();

  const [cancellationLoading, setCancellationLoading] = React.useState<
    number | null
  >(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  // Debug: Log modal state changes
  React.useEffect(() => {
    console.log("🔄 [Modal State] isModalOpen changed:", isModalOpen);
    console.log("🔄 [Modal State] selectedTicket:", selectedTicket);
  }, [isModalOpen, selectedTicket]);

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
    refetch,
  } = useMyTickets(token);

  const handleViewDetails = async (ticketCode: string) => {
    console.log("🎫 [handleViewDetails] START - Ticket code:", ticketCode);

    setLoadingTicket(true);
    try {
      console.log("📡 [handleViewDetails] Calling API with ticketCode...");
      const booking = await ticketApi.getBookingByTicketCode(ticketCode);
      console.log("✅ [handleViewDetails] API Response (unwrapped):", booking);

      // api.get() already unwraps ApiResponse and returns data directly
      if (booking && booking.bookingCode) {
        console.log("📦 [handleViewDetails] Booking data:", booking);
        console.log("🚌 [handleViewDetails] TripInfo:", booking.tripInfo);
        
        const firstTicket = booking.tickets?.[0];
        console.log("🎟️ [handleViewDetails] First ticket:", firstTicket);

        if (!firstTicket) {
          console.error("❌ [handleViewDetails] No tickets found in booking");
          alert("Không tìm thấy vé trong booking");
          return;
        }

        // Safely access tripInfo with fallbacks
        const tripInfo = booking.tripInfo || {};
        console.log("🔍 [handleViewDetails] Processing tripInfo...", tripInfo);
        
        // Parse route name - support both " - " and " → " separators
        const routeParts = tripInfo.routeName?.split(/\s*[-→]\s*/) || [];
        const fromLocation = tripInfo.pickupLocation ||
            tripInfo.pickupLocationName ||
            routeParts[0] || "N/A";
        const toLocation = tripInfo.dropoffLocation ||
            tripInfo.dropoffLocationName ||
            routeParts[1] || "N/A";

        console.log("📍 [handleViewDetails] Locations - From:", fromLocation, "To:", toLocation);

        // Map data to modal format - use tripInfo with null safety
        const departureTime = tripInfo.departureTime ? new Date(tripInfo.departureTime) : new Date();
        const arrivalTime = tripInfo.arrivalTime ? new Date(tripInfo.arrivalTime) : new Date();
        const pickupTime = tripInfo.pickupTime ? new Date(tripInfo.pickupTime) : departureTime;
        const dropoffTime = tripInfo.dropoffTime ? new Date(tripInfo.dropoffTime) : arrivalTime;
        
        console.log("⏰ [handleViewDetails] Times - Departure:", departureTime, "Arrival:", arrivalTime);

        const ticketData = {
          bookingCode: booking.bookingCode,
          status: booking.bookingStatus,
          qrCode: firstTicket.ticketCode, // ✅ Using ticketCode for QR
          fromLocation: fromLocation,
          toLocation: toLocation,
          departureDate: departureTime.toLocaleDateString("vi-VN"),
          departureTime: departureTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          duration: `${Math.max(1, Math.round((arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60)))}h`,
          vehicleType: tripInfo.vehicleTypeName || "Limousine",
          licensePlate: tripInfo.vehiclePlate || "N/A",
          driverName: tripInfo.driverName || "N/A",
          customerName: firstTicket.passenger?.fullName || booking.customerName,
          customerPhone:
            firstTicket.passenger?.phoneNumber || booking.customerPhone,
          customerEmail: firstTicket.passenger?.email || booking.customerEmail,
          customerIdCard: "",
          seatNumber: booking.tickets.map((t: any) => t.seatNumber).join(", "),
          seatFloor: firstTicket.floorNumber ? `Tầng ${firstTicket.floorNumber}` : "N/A",
          pickupLocation: tripInfo.pickupLocation || fromLocation,
          pickupTime: pickupTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          dropoffLocation: tripInfo.dropoffLocation || toLocation,
          dropoffTime: dropoffTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };

        console.log("🎫 [handleViewDetails] Mapped ticketData:", ticketData);
        console.log("🔑 [handleViewDetails] QR Code (ticketCode):", ticketData.qrCode);

        console.log("🎬 [handleViewDetails] Setting selectedTicket and opening modal...");
        setSelectedTicket(ticketData);
        setIsModalOpen(true);
        console.log("✅ [handleViewDetails] Modal state set - isModalOpen: true");
      } else {
        console.error("❌ [handleViewDetails] No booking data received:", booking);
        alert("Không thể tải thông tin vé. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("💥 [handleViewDetails] EXCEPTION:", err);
      console.error("💥 [handleViewDetails] Error stack:", err instanceof Error ? err.stack : "N/A");
      alert(
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin vé. Vui lòng thử lại.",
      );
    } finally {
      setLoadingTicket(false);
      console.log("🏁 [handleViewDetails] END");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!user || !token) {
      alert("Please login to cancel booking");
      return;
    }

    // Ask for confirmation
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellationLoading(bookingId);
    try {
      const response = await ticketApi.cancelBooking(bookingId, user.userId);
      if (response.success) {
        alert("Booking cancelled successfully!");
        // Refetch tickets to update the list
        refetch();
      } else {
        alert(response.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel booking");
    } finally {
      setCancellationLoading(null);
    }
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
          tickets.map((booking) => {
            // Parse route name - support both " - " and " → " separators
            const routeParts = booking.tripInfo.routeName?.split(/\s*[-→]\s*/) || [];
            const fromLocation = booking.tripInfo.pickupLocation || 
                                booking.tripInfo.pickupLocationName || 
                                routeParts[0] || "N/A";
            const toLocation = booking.tripInfo.dropoffLocation || 
                              booking.tripInfo.dropoffLocationName || 
                              routeParts[1] || "N/A";
            
            return (
            <TicketCard
              key={booking.bookingId}
              bookingId={booking.bookingId}
              bookingReference={booking.bookingCode}
              ticketCode={booking.tickets[0]?.ticketCode || booking.bookingCode}
              status={
                activeTab === "Upcoming"
                  ? "Upcoming"
                  : activeTab === "Completed"
                    ? "Completed"
                    : "Cancelled"
              }
              from={fromLocation}
              to={toLocation}
              date={new Date(booking.tripInfo.departureTime).toLocaleDateString(
                "vi-VN",
              )}
              departureTime={new Date(
                booking.tripInfo.departureTime,
              ).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              seats={booking.tickets.map((t) => t.seatNumber).join(", ")}
              price={booking.totalAmount}
              onViewDetails={() => handleViewDetails(booking.tickets[0]?.ticketCode || booking.bookingCode)}
              onCancel={handleCancelBooking}
            />
            );
          })
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

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("🚪 [Modal] Close button clicked");
          setIsModalOpen(false);
        }}
        ticket={selectedTicket}
      />

      {/* Loading overlay for fetching ticket */}
      {loadingTicket && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div className={styles.spinner}></div>
            <p style={{ color: "#374151", fontWeight: 500, marginTop: "1rem" }}>
              Đang tải thông tin vé...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
