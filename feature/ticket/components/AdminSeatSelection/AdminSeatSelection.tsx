import React, { useState, useEffect, useCallback } from "react";
import styles from "./AdminSeatSelection.module.css";

// [UPDATE] Import bookingApi thay vì tripApi
import { bookingApi } from "@/feature/booking/api/bookingApi";
import {
  SeatMapResponse,
  SelectedSeat,
  TripInfoForBooking,
} from "@/feature/booking/types";
import { TripData } from "@/feature/trip/types"; // Import đúng types bạn gửi

// Hooks & Context
import { useWebSocket } from "@/src/context/WebSocketContext";
import { useAuth } from "@/src/context/AuthContext";

// Components
import SeatMap from "@/feature/booking/components/SeatMap/SeatMap";
import TripDetailsSummary from "@/feature/booking/components/TripDetailsSummary/TripDetailsSummary";

interface AdminSeatSelectionProps {
  trip: TripData; // Data chuyến xe từ màn hình danh sách (Admin)
  onBack: () => void;
  onNext: (selectedSeats: SelectedSeat[], totalAmount: number) => void;
}

export default function AdminSeatSelection({
  trip,
  onBack,
  onNext,
}: AdminSeatSelectionProps) {
  // --- STATE ---
  const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);

  // [NEW] State lưu thông tin chi tiết chuyến đi từ bookingApi (để lấy Date/Time chuẩn)
  const [tripInfo, setTripInfo] = useState<TripInfoForBooking | null>(null);

  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [lockTimers, setLockTimers] = useState<Record<number, string>>({});

  // --- AUTH ---
  const { user } = useAuth();
  const currentUserId = user ? String(user.userId) : "admin_temp";

  // --- WEBSOCKET ---
  const {
    isConnected,
    subscribeToTrip,
    unsubscribeFromTrip,
    lockSeat,
    unlockSeat,
    lockedSeats,
  } = useWebSocket();

  // --- 1. FETCH DATA (Dùng bookingApi) ---
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!trip?.tripId) return;
      setLoading(true);
      try {
        // [UPDATE] Gọi song song cả 2 API để lấy Map và Info chuẩn
        const [mapData, infoData] = await Promise.all([
          bookingApi.getSeatMap(trip.tripId),
          bookingApi.getTripInfo(trip.tripId),
        ]);

        setSeatMap(mapData);
        setTripInfo(infoData);
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [trip.tripId]);

  // --- 2. WEBSOCKET SUBSCRIPTION ---
  useEffect(() => {
    if (trip.tripId && isConnected) {
      subscribeToTrip(trip.tripId);
    }
    return () => unsubscribeFromTrip();
  }, [trip.tripId, isConnected, subscribeToTrip, unsubscribeFromTrip]);

  // --- 3. SYNC SELECTED SEATS ---
  useEffect(() => {
    const myLockedSeats = lockedSeats
      .filter((s) => String(s.userId) === String(currentUserId))
      .map((s) => ({
        seatId: s.seatId,
        seatNumber: s.seatNumber,
        lockExpiry: s.expiresAt,
      }));
    setSelectedSeats(myLockedSeats);
  }, [lockedSeats, currentUserId]);

  // --- HANDLERS ---
  const handleSeatClick = useCallback(
    (seatId: number, seatNumber: string, isSelected: boolean) => {
      if (!isConnected) {
        alert("Đang kết nối Real-time. Vui lòng đợi...");
        return;
      }
      if (isSelected) {
        unlockSeat(trip.tripId, seatId, currentUserId);
      } else {
        lockSeat(trip.tripId, seatId, currentUserId);
      }
    },
    [isConnected, trip.tripId, currentUserId, unlockSeat, lockSeat],
  );

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế.");
      return;
    }
    const price = tripInfo?.price || trip.price || 0;
    const total = selectedSeats.length * price;

    onNext(selectedSeats, total);
  };

  // --- DATA PREPARATION FOR SUMMARY ---

  // [FIX INVALID DATE]
  // tripInfo từ bookingApi trả về date string "YYYY-MM-DD" và time string "HH:mm"
  // nên ta dùng trực tiếp, không cần new Date() phức tạp.
  const displayDate = tripInfo?.date || "Đang tải...";
  const displayTime = tripInfo?.departureTime || "Đang tải...";

  // Format tiền
  const priceDisplay = tripInfo?.price || trip.price || 0;

  // Tên xe: Lấy từ seatMap (ưu tiên) -> tripInfo -> trip prop
  const vehicleName =
    seatMap?.vehicleTypeName || tripInfo?.vehicleInfo || "Xe khách";

  // Địa điểm:
  // Admin TripData thường có sẵn originName/destinationName.
  // TripInfoForBooking chỉ có routeName ("Sài Gòn -> Đà Lạt").
  // Ta ưu tiên lấy từ prop trip cho chính xác, nếu không có thì parse routeName
  const fromLoc =
    trip.originName || tripInfo?.routeName?.split(" -> ")[0] || "Điểm đi";
  const toLoc =
    trip.destinationName || tripInfo?.routeName?.split(" -> ")[1] || "Điểm đến";

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Quay lại danh sách chuyến xe
        </button>
      </div>

      <div className={styles.mainContent}>
        {/* CỘT TRÁI: SƠ ĐỒ GHẾ */}
        <div className={styles.seatMapWrapper}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <span>Đang tải dữ liệu...</span>
            </div>
          )}

          <SeatMap
            seatMapData={seatMap}
            loading={loading}
            selectedSeats={selectedSeats}
            currentUserId={currentUserId}
            wsConnected={isConnected}
            onSeatClick={handleSeatClick}
            maxSeats={10}
            lockTimers={lockTimers}
          />
        </div>

        {/* CỘT PHẢI: TÓM TẮT THÔNG TIN */}
        <div>
          <TripDetailsSummary
            selectedSeats={selectedSeats.map((s) => s.seatNumber)}
            pricePerSeat={priceDisplay}
            from={fromLoc}
            to={toLoc}
            // [DONE] Hiển thị đúng Date/Time từ API booking
            date={displayDate}
            time={displayTime}
            busType={vehicleName}
          />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.bottomBar}>
        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>
            Tổng cộng ({selectedSeats.length} vé):
          </span>
          <span className={styles.totalAmount}>
            {(selectedSeats.length * priceDisplay).toLocaleString("vi-VN")}₫
          </span>
        </div>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          Tiếp tục: Thông tin khách hàng →
        </button>
      </div>
    </div>
  );
}
