"use client";
import React, { useMemo, useCallback } from "react";
import styles from "./SeatMap.module.css";
import {
  SeatMapResponse,
  TripSeatDto,
  SelectedSeat,
} from "@/feature/booking/types";

type SeatStatus = "available" | "selected" | "booked" | "held" | "held-by-me";

interface Seat {
  id: string;
  seatId: number;
  status: SeatStatus;
  seatType: string;
  lockExpiry: string | null;
  lockedBy: string | null;
}

interface Floor {
  floorNumber: number;
  floorLabel: string;
  seats: Seat[];
}

interface LockedSeatInfo {
  seatId: number;
  seatNumber: string;
  userId: string;
  lockedAt: string;
  expiresAt: string;
}

interface SeatMapProps {
  seatMapData?: SeatMapResponse | null;
  loading?: boolean;
  selectedSeats: SelectedSeat[];
  currentUserId: string;
  wsConnected?: boolean;
  wsLockedSeats?: LockedSeatInfo[];
  onSeatClick?: (
    seatId: number,
    seatNumber: string,
    isSelected: boolean,
  ) => void;
  maxSeats?: number;
  lockTimers?: Record<number, string>;
}

// Convert API status to local status
function mapApiStatus(
  apiStatus: string,
  lockedBy: string | null,
  currentUserId: string,
): SeatStatus {
  switch (apiStatus) {
    case "Available":
      return "available";
    case "Booked":
      return "booked";
    case "Held":
      if (lockedBy === currentUserId) {
        return "held-by-me";
      }
      return "held";
    default:
      return "available";
  }
}

// Convert API seats to local seat format
function convertApiSeats(
  apiSeats: TripSeatDto[],
  currentUserId: string,
  selectedSeats: SelectedSeat[],
  wsLockedSeats: LockedSeatInfo[] = [],
): Seat[] {
  const selectedSeatIds = new Set(selectedSeats.map((s) => s.seatId));
  const wsLockedMap = new Map(wsLockedSeats.map((s) => [s.seatId, s]));

  return apiSeats.map((seat) => {
    const wsLock = wsLockedMap.get(seat.seatId);
    let lockedBy = seat.lockedBy;
    let lockExpiry = seat.holdExpiry;

    if (wsLock) {
      lockedBy = wsLock.userId;
      lockExpiry = wsLock.expiresAt;
    }

    let status = mapApiStatus(seat.status, lockedBy, currentUserId);

    if (wsLock) {
      if (wsLock.userId === currentUserId) {
        status = "held-by-me";
      } else {
        status = "held";
      }
    }

    if (selectedSeatIds.has(seat.seatId)) {
      status = "selected";
    }

    return {
      id: seat.seatNumber,
      seatId: seat.seatId,
      status,
      seatType: seat.seatType,
      lockExpiry,
      lockedBy,
    };
  });
}

function convertSeatMapData(
  seatMapData: SeatMapResponse | null | undefined,
  currentUserId: string,
  selectedSeats: SelectedSeat[],
  wsLockedSeats: LockedSeatInfo[] = [],
): Floor[] {
  if (!seatMapData?.floors) return [];
  return seatMapData.floors.map((floor) => ({
    floorNumber: floor.floorNumber,
    floorLabel: floor.floorLabel,
    seats: convertApiSeats(
      floor.seats,
      currentUserId,
      selectedSeats,
      wsLockedSeats,
    ),
  }));
}

export default function SeatMap({
  seatMapData,
  loading = false,
  selectedSeats,
  currentUserId,
  wsConnected = false,
  wsLockedSeats = [],
  onSeatClick,
  maxSeats = 5,
  lockTimers = {},
}: SeatMapProps) {
  const floors = useMemo(
    () =>
      convertSeatMapData(
        seatMapData,
        currentUserId,
        selectedSeats,
        wsLockedSeats,
      ),
    [seatMapData, currentUserId, selectedSeats, wsLockedSeats],
  );

  const handleSeatClick = useCallback(
    (seat: Seat) => {
      if (seat.status === "booked" || seat.status === "held") {
        return;
      }

      const isCurrentlySelected =
        seat.status === "selected" || seat.status === "held-by-me";

      if (!isCurrentlySelected && selectedSeats.length >= maxSeats) {
        alert(`Bạn chỉ có thể chọn tối đa ${maxSeats} ghế`);
        return;
      }

      onSeatClick?.(seat.seatId, seat.id, isCurrentlySelected);
    },
    [selectedSeats.length, maxSeats, onSeatClick],
  );

  const renderSeat = useCallback(
    (seat: Seat) => {
      const isDisabled = seat.status === "booked" || seat.status === "held";
      const isSelected =
        seat.status === "selected" || seat.status === "held-by-me";
      const timer = lockTimers[seat.seatId];

      const statusClass =
        seat.status === "held-by-me" ? styles.selected : styles[seat.status];

      return (
        <button
          key={seat.seatId}
          className={`${styles.seat} ${statusClass}`}
          onClick={() => handleSeatClick(seat)}
          disabled={isDisabled}
          title={
            isDisabled
              ? "Ghế đang được người khác chọn"
              : isSelected
                ? `Ghế ${seat.id} - Đang chọn`
                : `Ghế ${seat.id} - Còn trống`
          }
        >
          {/* Wrapper giúp căn chỉnh số ghế và thời gian */}
          <div className={styles.seatContent}>
            <span className={styles.seatNumber}>{seat.id}</span>
            {isSelected && timer && (
              <span className={styles.seatTimer}>{timer}</span>
            )}
          </div>
        </button>
      );
    },
    [handleSeatClick, lockTimers],
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  if (!seatMapData || floors.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Không thể tải sơ đồ ghế. Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Chọn ghế</h2>
        <div className={styles.vehicleInfo}>
          <span className={styles.vehicleType}>
            {seatMapData.vehicleTypeName}
          </span>
          {wsConnected && (
            <span className={styles.wsStatus} title="Real-time connected">
              🟢 Live
            </span>
          )}
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.available}`}></div>
            <span>Còn trống</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.selected}`}></div>
            <span>Đang chọn</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.held}`}></div>
            <span>Đang giữ</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.booked}`}></div>
            <span>Đã đặt</span>
          </div>
        </div>
      </div>

      <div className={styles.busLayout}>
        <div className={styles.driverArea}>Tài xế</div>

        <div className={styles.floorsContainer}>
          {floors.map((floor, index) => (
            <React.Fragment key={floor.floorNumber}>
              {index > 0 && <div className={styles.floorDivider}></div>}
              <div className={styles.floorSection}>
                <div className={styles.floorLabel}>{floor.floorLabel}</div>
                <div className={styles.seatsGrid}>
                  {floor.seats.map((seat) => renderSeat(seat))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
