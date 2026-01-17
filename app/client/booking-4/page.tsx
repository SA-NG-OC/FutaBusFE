"use client";
import Container from "@/src/components/ClientContainer/ClientContainer";
import SeatMap from "@/feature/booking/components/SeatMap/SeatMap";
import TripDetailsSummary from "@/feature/booking/components/TripDetailsSummary/TripDetailsSummary";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSeatMap } from "@/feature/booking/hooks/useSeatMap";
import { useWebSocket } from "@/src/context/WebSocketContext";
import { useAuth } from "@/src/context/AuthContext";
import { SelectedSeat, SeatMapResponse } from "@/feature/booking/types";
import styles from "./page.module.css";

// Generate a unique guest user ID for non-authenticated users
function getGuestUserId(): string {
  if (typeof window === "undefined") return "";
  let userId = sessionStorage.getItem("booking_guest_id");
  if (!userId) {
    userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("booking_guest_id", userId);
  }
  return userId;
}

export default function ClientBookingDetailPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  
  // Use real userId if authenticated, otherwise use guest ID
  const userId = isAuthenticated && user ? String(user.userId) : getGuestUserId();
  const isGuestBooking = !isAuthenticated || !user;
  
  const [lockTimers, setLockTimers] = useState<Record<number, string>>({});
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const router = useRouter();
  const timerIntervalsRef = useRef<Record<number, NodeJS.Timeout>>({});
  const seatMapRef = useRef<SeatMapResponse | null>(null);

  const { seatMap, tripInfo, loading, error, fetchBookingData} = useSeatMap();
  const wsContext = useWebSocket();

  // Keep seatMapRef in sync
  useEffect(() => {
    seatMapRef.current = seatMap;
  }, [seatMap]);

  // Notification helper
  const showNotification = useCallback(
    (type: "success" | "error" | "warning", message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  // Timer management
  const startLockTimer = useCallback((seatId: number, lockExpiry: string) => {
    // Clear existing timer
    if (timerIntervalsRef.current[seatId]) {
      clearInterval(timerIntervalsRef.current[seatId]);
    }

    const expiryTime = new Date(lockExpiry).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        clearInterval(timerIntervalsRef.current[seatId]);
        delete timerIntervalsRef.current[seatId];
        setLockTimers((prev) => {
          const newTimers = { ...prev };
          delete newTimers[seatId];
          return newTimers;
        });
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      const displayTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      setLockTimers((prev) => ({
        ...prev,
        [seatId]: displayTime,
      }));

      // Warning when 1 minute left
      if (remaining <= 60000 && remaining > 59000) {
        showNotification("warning", "Còn 1 phút để hoàn tất đặt vé!");
      }
    };

    // Update immediately
    updateTimer();

    // Then update every second
    timerIntervalsRef.current[seatId] = setInterval(updateTimer, 1000);
  }, [showNotification]);

  const stopLockTimer = useCallback((seatId: number) => {
    if (timerIntervalsRef.current[seatId]) {
      clearInterval(timerIntervalsRef.current[seatId]);
      delete timerIntervalsRef.current[seatId];
    }
    setLockTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[seatId];
      return newTimers;
    });
  }, []);

  // Clear all timers on unmount
  useEffect(() => {
    const intervals = timerIntervalsRef.current;
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  // Sync selected seats from WebSocket context
  useEffect(() => {
    const myLockedSeats = wsContext.lockedSeats
      .filter((seat) => seat.userId === userId)
      .map((seat) => ({
        seatId: seat.seatId,
        seatNumber: seat.seatNumber,
        lockExpiry: seat.expiresAt,
      }));

    setSelectedSeats(myLockedSeats);

    // Update timers
    myLockedSeats.forEach((seat) => {
      if (seat.lockExpiry) {
        startLockTimer(seat.seatId, seat.lockExpiry);
      }
    });
  }, [wsContext.lockedSeats, userId, startLockTimer]);

  // Use WebSocket context
  const connected = wsContext.isConnected;

  // Get tripId from sessionStorage
  useEffect(() => {
    const storedTripId = sessionStorage.getItem("selectedTripId");
    if (storedTripId) {
      const id = parseInt(storedTripId, 10);
      setTripId(id);
    } else {
      router.push("/client/booking");
    }
  }, [router]);

  // Fetch seat map and trip info when tripId is available
  useEffect(() => {
    if (tripId) {
      fetchBookingData(tripId);
    }
  }, [tripId, fetchBookingData]);

  // Subscribe to trip updates when tripId is ready
  useEffect(() => {
    if (tripId && connected) {
      console.log("Attempting to subscribe to trip:", tripId, "Connected:", connected);
      wsContext.subscribeToTrip(tripId);
    }

    return () => {
      // Don't unsubscribe here - keep connection alive for checkout page
    };
  }, [tripId, connected, wsContext]);

  // Handle seat click
  const handleSeatClick = useCallback(
    (seatId: number, seatNumber: string, isSelected: boolean) => {
      if (!connected || !tripId) {
        showNotification("warning", "Đang kết nối, vui lòng đợi...");
        return;
      }

      if (isSelected) {
        // Unlock seat
        wsContext.unlockSeat(tripId, seatId, userId);
      } else {
        // Lock seat
        wsContext.lockSeat(tripId, seatId, userId);
      }
    },
    [connected, tripId, userId, wsContext, showNotification]
  );

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      showNotification("warning", "Vui lòng chọn ít nhất một ghế");
      return;
    }
    // Save selected seats to sessionStorage
    sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    
    // Save booking info for checkout page
    const bookingInfo = {
      pricePerSeat,
      tripInfo: tripInfo ? {
        routeName: tripInfo.routeName,
        date: tripInfo.date,
        departureTime: tripInfo.departureTime,
        arrivalTime: tripInfo.arrivalTime,
      } : null,
    };
    sessionStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));
    
    // Navigate to checkout page
    router.push(
      `/client/booking-6?seats=${selectedSeats
        .map((s) => s.seatNumber)
        .join(",")}`
    );
  };

  // Get price from tripInfo or use default
  const pricePerSeat = tripInfo?.price ? Number(tripInfo.price) : 250000;
  const total = selectedSeats.length * pricePerSeat;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  // Parse route name to get from/to
  const parseRouteName = (routeName?: string) => {
    if (!routeName) return { from: "N/A", to: "N/A" };
    const parts = routeName.split(" → ");
    return {
      from: parts[0] || "N/A",
      to: parts[1] || "N/A",
    };
  };

  const { from, to } = parseRouteName(tripInfo?.routeName);

  return (
    <Container>
      <div className={styles.backButton}>
        <button onClick={() => router.back()}>← Quay lại</button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => tripId && fetchBookingData(tripId)}>
            Thử lại
          </button>
        </div>
      )}

      {/* Global Timer Display */}
      {selectedSeats.length > 0 && Object.keys(lockTimers).length > 0 && (
        <div className={styles.globalTimer}>
          <span className={styles.timerIcon}>⏱️</span>
          <span>
            Thời gian giữ ghế:{" "}
            <strong>{Object.values(lockTimers)[0] || "15:00"}</strong>
          </span>
        </div>
      )}

      <div className={styles.mainContent}>
        <SeatMap
          seatMapData={seatMap}
          loading={loading}
          selectedSeats={selectedSeats}
          currentUserId={userId}
          wsConnected={connected}
          onSeatClick={handleSeatClick}
          maxSeats={5}
          lockTimers={lockTimers}
        />
        <TripDetailsSummary
          selectedSeats={selectedSeats.map((s) => s.seatNumber)}
          pricePerSeat={pricePerSeat}
          from={from}
          to={to}
          date={tripInfo?.date || "N/A"}
          time={tripInfo?.departureTime || "N/A"}
          busType={seatMap?.vehicleTypeName || "N/A"}
        />
      </div>

      <button
        className={styles.continueButton}
        onClick={handleContinue}
        disabled={selectedSeats.length === 0 || loading}
      >
        {loading ? "Đang tải..." : "Tiếp tục thanh toán"}
      </button>

      {selectedSeats.length > 0 && (
        <div className={styles.totalFloating}>
          <div className={styles.totalContent}>
            <span className={styles.totalLabel}>Tổng tiền:</span>
            <span className={styles.totalAmount}>{formatCurrency(total)}₫</span>
          </div>
        </div>
      )}
    </Container>
  );
}
