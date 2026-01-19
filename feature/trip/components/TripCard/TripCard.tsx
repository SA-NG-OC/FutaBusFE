import React, { useState, useRef, useEffect } from "react";
import styles from "./TripCard.module.css";
import { TripData } from "../../types";
import { FaBus, FaUser, FaRegClock, FaChevronDown } from "react-icons/fa";

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
    const s = status ? status.toLowerCase() : "";
    if (s === "running") return styles.running;
    if (s === "completed") return styles.completed;
    if (s === "cancelled") return styles.cancelled;
    return styles.waiting;
  };

  const total = trip.totalSeats && trip.totalSeats > 0 ? trip.totalSeats : 40;
  const booked = trip.bookedSeats || 0;
  const checkedIn = trip.checkedInSeats || 0;

  // --- LOGIC CUSTOM STATUS DROPDOWN ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "Waiting", label: "Waiting", dotClass: styles.dotWaiting },
    { value: "Running", label: "Running", dotClass: styles.dotRunning },
    { value: "Completed", label: "Completed", dotClass: styles.dotCompleted },
    { value: "Cancelled", label: "Cancelled", dotClass: styles.dotCancelled },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStatusClick = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    if (newStatus !== trip.status) {
      onStatusUpdate(trip.tripId, newStatus);
    }
    setIsDropdownOpen(false);
  };

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
          <span className={styles.label}>Xuất phát</span>
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
          <span className={styles.label}>Đến nơi</span>
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

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.checkInColor}`}></span>
            <b>{checkedIn}</b> lên xe
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.bookedColor}`}></span>
            <b>{booked}</b> đã đặt
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.dot} ${styles.totalColor}`}></span>
            <b>{total}</b> ghế
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.price}>
          Giá vé: <span>{formatCurrency(trip.price)}</span>
        </div>

        {/* --- CUSTOM STATUS DROPDOWN --- */}
        <div className={styles.statusContainer} ref={dropdownRef}>
          <div className={styles.statusTrigger} onClick={toggleDropdown}>
            <span className={styles.statusText}>{trip.status}</span>
            <FaChevronDown className={styles.statusIcon} />
          </div>

          {isDropdownOpen && (
            <div className={styles.statusMenu}>
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.statusItem} ${
                    trip.status === option.value ? styles.active : ""
                  }`}
                  onClick={(e) => handleStatusClick(e, option.value)}
                >
                  <span
                    className={`${styles.statusDot} ${option.dotClass}`}
                  ></span>
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
