"use client";
import React from "react";
import styles from "./TripDetailsSummary.module.css";

interface TripDetailsSummaryProps {
  selectedSeats: string[];
  pricePerSeat?: number;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  busType?: string;
}

export default function TripDetailsSummary({
  selectedSeats,
  pricePerSeat = 250000,
  from = "Ho Chi Minh City",
  to = "Da Lat",
  date = "2025-11-20",
  time = "06:00",
  busType = "Sleeper",
}: TripDetailsSummaryProps) {
  const total = selectedSeats.length * pricePerSeat;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Trip Details</h3>

      <div className={styles.busInfo}>
        <div className={styles.busIcon}>🚌</div>
        <div>
          <div className={styles.busName}>Premium Express</div>
          <div className={styles.busType}>{busType}</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>From</span>
          <span className={styles.value}>{from}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>To</span>
          <span className={styles.value}>{to}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Departure</span>
          <span className={styles.value}>{time}</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Selected Seats</span>
          <span className={styles.value}>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Price per seat</span>
          <span className={styles.value}>{formatCurrency(pricePerSeat)}₫</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Quantity</span>
          <span className={styles.value}>{selectedSeats.length}</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatCurrency(total)}₫</span>
      </div>
    </div>
  );
}
