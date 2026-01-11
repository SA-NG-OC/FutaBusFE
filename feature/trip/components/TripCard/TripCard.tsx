import React from "react";
import styles from "./TripCard.module.css";
import { TripData } from "../../types";
import { FaBus, FaUser, FaRegClock } from "react-icons/fa";

interface TripCardProps {
  trip: TripData;
  onStatusUpdate: (id: number, newStatus: string) => void;
}

const TripCard = ({ trip, onStatusUpdate }: TripCardProps) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const formatTime = (timeStr: string) => timeStr?.substring(0, 5) || "--:--";

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "running") return styles.running;
    if (s === "completed") return styles.completed;
    if (s === "cancelled") return styles.cancelled;
    return styles.waiting;
  };

  const total = trip.totalSeats || 40;
  const booked = trip.bookedSeats || 0;
  const checkedIn = trip.checkedInSeats || 0;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.routeInfo}>
          <div className={styles.routeIcon}>
            <FaBus />
          </div>
          <div>
            <h3 className={styles.routeName}>{trip.routeName}</h3>
            <span className={styles.tripCode}>#{trip.tripId}</span>
          </div>
        </div>
        <span className={`${styles.badge} ${getStatusClass(trip.status)}`}>
          {trip.status}
        </span>
      </div>

      {/* Time Section */}
      <div className={styles.timeSection}>
        <div className={styles.timePoint}>
          <span className={styles.label}>Departure</span>
          <strong className={styles.timeVal}>
            {formatTime(trip.departureTime)}
          </strong>
        </div>
        <div className={styles.durationLine}>
          <span className={styles.line}></span>
          <FaRegClock className={styles.clockIcon} />
          <span className={styles.line}></span>
        </div>
        <div className={styles.timePoint} style={{ textAlign: "right" }}>
          <span className={styles.label}>Arrival</span>
          <strong className={styles.timeVal}>
            {formatTime(trip.arrivalTime)}
          </strong>
        </div>
      </div>

      {/* Info Grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <FaBus className={styles.icon} /> <span>{trip.vehicleInfo}</span>
        </div>
        <div className={styles.infoItem}>
          <FaUser className={styles.icon} /> <span>{trip.driverName}</span>
        </div>

        {/* Stats Row: Sử dụng CSS Dot thay vì Text */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.checkInColor}`}></span>
            <b>{checkedIn}</b> checked in
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.bookedColor}`}></span>
            <b>{booked}</b> booked
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.totalColor}`}></span>
            <b>{total}</b> total
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.price}>
          Price: <span>{formatCurrency(trip.price)}</span>
        </div>
        <select
          className={styles.statusSelect}
          value={trip.status}
          onChange={(e) => onStatusUpdate(trip.tripId, e.target.value)}
        >
          <option value="Waiting">Waiting</option>
          <option value="Running">Running</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default TripCard;
