import React from "react";
import { TripData } from "@/feature/trip/types";
import styles from "./TripCard.module.css";

type TripCardProps = {
  tripDetail?: TripData;
  handleSelectSeat: (tripId: number) => void;
};

export default function TripCard({
  tripDetail,
  handleSelectSeat,
}: TripCardProps) {
  if (!tripDetail) {
    return <div className={styles.loading}>Loading trip...</div>;
  }

  // Split routeName into departure and arrival cities
  const [departureCity, arrivalCity] = tripDetail.routeName.split(" -> ");

  // Calculate duration from departure and arrival times
  const calculateDuration = (departure: string, arrival: string): string => {
    try {
      // Parse times in format "HH:mm"
      const [depHour, depMin] = departure.split(":").map(Number);
      const [arrHour, arrMin] = arrival.split(":").map(Number);

      let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin);

      // Handle case where arrival is next day
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (minutes === 0) {
        return `${hours} giờ`;
      }
      return `${hours} giờ ${minutes} phút`;
    } catch {
      return "0h";
    }
  };

  const duration = calculateDuration(
    tripDetail.departureTime,
    tripDetail.arrivalTime,
  );

  return (
    <div className={styles.card}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.busIcon}>🚌</div>
          <div className={styles.headerInfo}>
            <p className={styles.routeName}>{tripDetail.routeName}</p>
            <div className={styles.badges}>
              <span className={styles.vehicleBadge}>
                {tripDetail.vehicleInfo}
              </span>
              <span className={styles.dateBadge}>
                📅 {new Date(tripDetail.date).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          {/* Departure */}
          <div className={styles.locationInfo}>
            <p className={styles.locationLabel}>Departure</p>
            <p className={styles.timeInfo}>
              <span className={styles.timeIcon}>🕒</span>{" "}
              {tripDetail.departureTime}
            </p>
            <p className={styles.cityName}>{departureCity}</p>
          </div>

          {/* Duration */}
          <div className={styles.duration}>
            <p className={styles.durationLabel}>Duration</p>
            <div className={styles.durationLine}>
              <div className={styles.durationBorder}></div>
              <p className={styles.durationText}>{duration}</p>
              <div className={styles.durationBorder}></div>
            </div>
          </div>

          {/* Arrival */}
          <div className={styles.locationInfo}>
            <p className={styles.locationLabel}>Arrival</p>
            <p className={styles.timeInfo}>
              {tripDetail.arrivalTime}{" "}
              <span className={styles.timeIcon}>📍</span>
            </p>
            <p className={styles.cityName}>{arrivalCity}</p>
          </div>
        </div>

        <div className={styles.seatsInfo}>
          <span>👥</span>
          {tripDetail.totalSeats} seats available
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.price}>
          {tripDetail.price.toLocaleString("vi-VN")}đ
        </div>
        <button
          onClick={() => handleSelectSeat(tripDetail.tripId)}
          className={styles.selectButton}
        >
          Select Seats
        </button>
      </div>
    </div>
  );
}
