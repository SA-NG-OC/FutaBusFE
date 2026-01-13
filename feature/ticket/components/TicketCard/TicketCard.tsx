"use client";
import React from "react";
import styles from "./TicketCard.module.css";
import { QRCodeCanvas } from "qrcode.react";

export interface TicketCardProps {
  bookingReference: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  from: string;
  to: string;
  date: string;
  departureTime: string;
  seats: string;
  price: number;
  onViewDetails: () => void;
}

export default function TicketCard({
  bookingReference,
  status,
  from,
  to,
  date,
  departureTime,
  seats,
  price,
  onViewDetails,
}: TicketCardProps) {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const getStatusClass = () => {
    switch (status) {
      case "Upcoming":
        return styles.statusUpcoming;
      case "Completed":
        return styles.statusCompleted;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.bookingInfo}>
          <div className={styles.label}>Booking Reference</div>
          <div className={styles.bookingRef}>{bookingReference}</div>
        </div>
        <div className={`${styles.statusBadge} ${getStatusClass()}`}>
          {status}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftSection}>
          <div className={styles.routeInfo}>
            <div className={styles.location}>
              <svg
                className={styles.icon}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className={styles.locationLabel}>From</div>
                <div className={styles.locationValue}>{from}</div>
              </div>
            </div>

            <div className={styles.location}>
              <svg
                className={styles.icon}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className={styles.locationLabel}>To</div>
                <div className={styles.locationValue}>{to}</div>
              </div>
            </div>
          </div>

          <div className={styles.timeInfo}>
            <div className={styles.timeItem}>
              <svg
                className={styles.icon}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className={styles.timeLabel}>Date</div>
                <div className={styles.timeValue}>{date}</div>
              </div>
            </div>

            <div className={styles.timeItem}>
              <svg
                className={styles.icon}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className={styles.timeLabel}>Departure</div>
                <div className={styles.timeValue}>{departureTime}</div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.priceInfo}>
              <div className={styles.seats}>Seats: {seats}</div>
              <div className={styles.price}>{formatCurrency(price)}₫</div>
            </div>
            <button className={styles.detailsButton} onClick={onViewDetails}>
              View Details
            </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.qrCode}>
            <QRCodeCanvas value={bookingReference} size={120} level="H" />
          </div>
          <button
            className={styles.detailsButtonMobile}
            onClick={onViewDetails}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
