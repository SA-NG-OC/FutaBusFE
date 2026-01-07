import React from "react";
import styles from "./TripCard.module.css";

type TripCardProps = {
  company?: string;
  service?: string;
  departTime?: string;
  departCity?: string;
  arrivalTime?: string;
  arrivalCity?: string;
  duration?: string;
  seats?: number;
  price?: number;
};

export default function TripCard({
  company = "Comfort Lines",
  service = "Seated",
  departTime = "08:30",
  departCity = "Ho Chi Minh City",
  arrivalTime = "14:30",
  arrivalCity = "Da Lat",
  duration = "6h",
  seats = 8,
  price = 220000,
}: TripCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.header}>
          <div className={styles.logo}>🚌</div>
          <div>
            <div>
              <span className={styles.company}>{company}</span>
              <span className={styles.badge}>{service}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>Departure</div>
          <div className={styles.time}>{departTime}</div>
          <div className={styles.city}>{departCity}</div>
          <div className={styles.seats}>👥 {seats} seats available</div>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.durationLabel}>Duration</div>
        <div className={styles.duration}>{duration}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.price}>{price?.toLocaleString()}đ</div>
        <button className={styles.selectBtn}>Select Seats</button>
        <div className={styles.arrivalLabel}>Arrival</div>
        <div className={styles.time}>{arrivalTime}</div>
        <div className={styles.city}>{arrivalCity}</div>
      </div>
    </div>
  );
}
