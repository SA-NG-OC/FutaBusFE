"use client";
import React from "react";
import styles from "./BookingList.module.css";
import { BookingListItem } from "../../types";

interface BookingListProps {
  bookings: BookingListItem[];
  onSelectTicket: (ticketCode: string) => void;
  onBack: () => void;
}

export default function BookingList({
  bookings,
  onSelectTicket,
  onBack,
}: BookingListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Paid: { label: "Đã thanh toán", className: styles.statusPaid },
      Pending: { label: "Chờ thanh toán", className: styles.statusPending },
      Cancelled: { label: "Đã hủy", className: styles.statusCancelled },
      Expired: { label: "Hết hạn", className: styles.statusExpired },
      Completed: { label: "Hoàn thành", className: styles.statusCompleted },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <span className={`${styles.statusBadge} ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTicketStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Confirmed: { label: "Đã xác nhận", className: styles.ticketConfirmed },
      Unconfirmed: {
        label: "Chưa xác nhận",
        className: styles.ticketUnconfirmed,
      },
      Cancelled: { label: "Đã hủy", className: styles.ticketCancelled },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <span className={`${styles.ticketStatusBadge} ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Tìm kiếm lại
        </button>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Kết quả tra cứu</h2>
          <p className={styles.subtitle}>
            Tìm thấy {bookings.length} booking • Click "Xem vé" để xem chi tiết
          </p>
        </div>
      </div>

      <div className={styles.bookingList}>
        {bookings.map((booking) => (
          <div key={booking.bookingId} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <div className={styles.bookingInfo}>
                <h3 className={styles.bookingCode}>{booking.bookingCode}</h3>
                {getStatusBadge(booking.bookingStatus)}
              </div>
              <div className={styles.bookingMeta}>
                <span className={styles.bookingDate}>
                  Đặt lúc: {formatDate(booking.createdAt)}
                </span>
              </div>
            </div>

            <div className={styles.tripInfo}>
              <div className={styles.routeInfo}>
                <span className={styles.routeName}>
                  🚌 {booking.tripInfo.routeName}
                </span>
                <span className={styles.tripTime}>
                  🕐 {formatDate(booking.tripInfo.departureTime)}
                </span>
              </div>
              <div className={styles.vehicleInfo}>
                <span>🚗 {booking.tripInfo.vehiclePlate || "N/A"}</span>
                <span>👨‍✈️ {booking.tripInfo.driverName}</span>
              </div>
            </div>

            <div className={styles.customerInfo}>
              <span>👤 {booking.customerName}</span>
              <span>📞 {booking.customerPhone}</span>
              {booking.customerEmail && <span>📧 {booking.customerEmail}</span>}
            </div>

            <div className={styles.ticketsSection}>
              <div className={styles.ticketsHeader}>
                <span className={styles.ticketsTitle}>
                  Vé ({booking.tickets.length})
                </span>
                <span className={styles.totalAmount}>
                  Tổng: {booking.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className={styles.ticketsList}>
                {booking.tickets.map((ticket) => (
                  <div key={ticket.ticketId} className={styles.ticketItem}>
                    <div className={styles.ticketInfo}>
                      <span className={styles.ticketCode}>
                        {ticket.ticketCode || "Chưa có mã vé"}
                      </span>
                      <span className={styles.seatInfo}>
                        💺 Ghế {ticket.seatNumber} (Tầng {ticket.floorNumber})
                      </span>
                      {getTicketStatusBadge(ticket.ticketStatus)}
                    </div>
                    {ticket.ticketCode && ticket.ticketCode.trim() !== "" ? (
                      <button
                        onClick={() => onSelectTicket(ticket.ticketCode)}
                        className={styles.viewTicketButton}
                      >
                        🎫 Xem chi tiết vé
                      </button>
                    ) : (
                      <span className={styles.noTicketText}>Chưa có vé</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
