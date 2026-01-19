// Ticket Table Component

import React, { useState } from "react";
import { BookingData } from "../../types";
import styles from "./TicketTable.module.css";

interface TicketTableProps {
  tickets: BookingData[];
  onConfirm: (bookingId: number) => Promise<boolean>; // 🔥
  onCancel: (bookingId: number) => Promise<boolean>;
  onView: (ticket: BookingData) => void;
  onChangeTicket?: (ticket: BookingData) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onConfirm,
  onCancel,
  onView,
  onChangeTicket,
}) => {
  const [processing, setProcessing] = useState<number | null>(null);

  const handleConfirm = async (bookingId: number) => {
    setProcessing(bookingId);
    try {
      await onConfirm(bookingId); // 🔥
    } finally {
      setProcessing(null);
    }
  };

  const handleCancel = async (bookingId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy vé này?")) {
      setProcessing(bookingId);
      try {
        await onCancel(bookingId);
      } finally {
        setProcessing(null);
      }
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getPaymentStatusClass = (status: string) => {
    if (status === "Paid" || status === "Completed") return styles.statusPaid;
    if (status === "Pending" || status === "Held") return styles.statusCash;
    return styles.statusPending;
  };

  const getPaymentStatusLabel = (status: string) => {
    if (status === "Paid" || status === "Completed") return "Paid";
    return "Cash";
  };

  const getTicketStatusClass = (status: string) => {
    switch (status) {
      case "Paid":
      case "Completed":
        return styles.statusConfirmed;
      case "Pending":
      case "Held":
        return styles.statusPending;
      case "Cancelled":
        return styles.statusCancelled;
      case "Expired":
        return styles.statusUsed;
      default:
        return "";
    }
  };

  const getTicketStatusLabel = (status: string) => {
    switch (status) {
      case "Paid":
      case "Completed":
        return "Confirmed";
      case "Pending":
      case "Held":
        return "Pending";
      case "Cancelled":
        return "Cancelled";
      case "Expired":
        return "Expired";
      default:
        return status;
    }
  };

  const isPending = (status: string) =>
    status === "Pending" || status === "Held";
  const isCancellable = (status: string) =>
    status !== "Cancelled" && status !== "Expired";
  const isChangeable = (status: string) =>
    (status === "Paid" || status === "Completed" || status === "Held") && status !== "Cancelled" && status !== "Expired";

  return (
    <div className={styles.tableContainer}>
      <table className={styles.ticketTable}>
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>Customer</th>
            <th>Route</th>
            <th>Date</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const seatsDisplay = ticket.tickets
              .map((t) => t.seatNumber)
              .join(", ");

            return (
              <tr key={ticket.bookingId}>
                <td>{ticket.bookingCode}</td>
                <td>{ticket.customerName}</td>
                <td>{ticket.tripInfo.routeName}</td>
                <td>{formatDate(ticket.tripInfo.departureTime)}</td>
                <td>{seatsDisplay}</td>
                <td>{formatPrice(ticket.totalAmount)}</td>
                <td>
                  <span
                    className={`${styles.badge} ${getPaymentStatusClass(
                      ticket.bookingStatus
                    )}`}
                  >
                    {getPaymentStatusLabel(ticket.bookingStatus)}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${getTicketStatusClass(
                      ticket.bookingStatus
                    )}`}
                  >
                    {getTicketStatusLabel(ticket.bookingStatus)}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.viewButton}
                      onClick={() => onView(ticket)}
                      title="Xem chi tiết"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {isPending(ticket.bookingStatus) && (
                      <button
                        className={styles.confirmButton}
                        onClick={() => handleConfirm(ticket.bookingId)} // 🔥
                        disabled={processing === ticket.bookingId}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polyline
                            points="20 6 9 17 4 12"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}

                    {isChangeable(ticket.bookingStatus) && onChangeTicket && (
                      <button
                        className={styles.changeButton}
                        onClick={() => onChangeTicket(ticket)}
                        title="Change ticket"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polyline
                            points="23 4 23 10 17 10"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}

                    {isCancellable(ticket.bookingStatus) && (
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancel(ticket.bookingId)}
                        disabled={processing === ticket.bookingId}
                        title="Hủy vé"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
