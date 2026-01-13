"use client";
import React from "react";
import styles from "./BookingSummary.module.css";

interface BookingSummaryProps {
  seats?: string[];
  route?: string;
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  pricePerSeat?: number;
}

export default function BookingSummary({
  seats = [],
  route = "Ho Chi Minh City → Da Lat",
  from = "Ho Chi Minh City",
  to = "Da Lat",
  date = "2025-11-20",
  time = "06:00",
  pricePerSeat = 250000,
}: BookingSummaryProps) {
  const ticketPrice = seats.length * pricePerSeat;
  const total = ticketPrice;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Booking Summary</h3>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Route</span>
          <span className={styles.value}>{route}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date</span>
          <span className={styles.value}>{date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Time</span>
          <span className={styles.value}>{time}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Seats</span>
          <span className={styles.value}>{seats.join(", ")}</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Ticket</span>
          <span className={styles.value}>{formatCurrency(ticketPrice)}₫</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatCurrency(total)}₫</span>
      </div>

      <div className={styles.disclaimer}>
        By clicking "Confirm Payment", you agree to our Terms of Service and
        Privacy Policy
      </div>
    </div>
  );
}
