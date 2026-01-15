"use client";
import React from "react";
import styles from "./TicketResult.module.css";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

interface TicketData {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  seats: string[];
  totalPrice: number;
  status: string;
  vehicleNumber?: string;
  driverName?: string;
}

interface TicketResultProps {
  ticket: TicketData | null;
  loading?: boolean;
  error?: string | null;
  onSearchAgain?: () => void;
}

export default function TicketResult({
  ticket,
  loading = false,
  error = null,
  onSearchAgain,
}: TicketResultProps) {
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tra cứu thông tin vé...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>✕</div>
          <h3>Không tìm thấy vé</h3>
          <p>{error}</p>
          {onSearchAgain && (
            <button onClick={onSearchAgain} className={styles.retryButton}>
              Tra cứu lại
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " VNĐ";
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
        return styles.statusConfirmed;
      case "PENDING":
        return styles.statusPending;
      case "CANCELLED":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.ticketCard}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Thông Tin Vé</h2>
            <p className={styles.bookingCode}>Mã vé: {ticket.bookingCode}</p>
          </div>
          <div className={`${styles.status} ${getStatusColor(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
        </div>

        {/* Route Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin chuyến đi</h3>
          <div className={styles.routeInfo}>
            <div className={styles.location}>
              <MapPin className={styles.icon} size={20} />
              <div>
                <div className={styles.locationLabel}>Điểm đi</div>
                <div className={styles.locationValue}>
                  {ticket.fromLocation}
                </div>
              </div>
            </div>
            <div className={styles.routeArrow}>→</div>
            <div className={styles.location}>
              <MapPin className={styles.icon} size={20} />
              <div>
                <div className={styles.locationLabel}>Điểm đến</div>
                <div className={styles.locationValue}>{ticket.toLocation}</div>
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.infoItem}>
              <Calendar className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Ngày khởi hành</div>
                <div className={styles.infoValue}>{ticket.departureDate}</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Clock className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Giờ khởi hành</div>
                <div className={styles.infoValue}>{ticket.departureTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Thông tin hành khách</h3>
          <div className={styles.grid}>
            <div className={styles.infoItem}>
              <User className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Họ và tên</div>
                <div className={styles.infoValue}>{ticket.customerName}</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Phone className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Số điện thoại</div>
                <div className={styles.infoValue}>{ticket.customerPhone}</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Mail className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue}>{ticket.customerEmail}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat and Payment Info */}
        <div className={styles.section}>
          <div className={styles.grid}>
            <div className={styles.infoItem}>
              <div className={styles.icon}>🎫</div>
              <div>
                <div className={styles.infoLabel}>Ghế đã đặt</div>
                <div className={styles.infoValue}>
                  {ticket.seats.join(", ")}
                </div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <CreditCard className={styles.icon} size={18} />
              <div>
                <div className={styles.infoLabel}>Tổng tiền</div>
                <div className={`${styles.infoValue} ${styles.price}`}>
                  {formatCurrency(ticket.totalPrice)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(ticket.vehicleNumber || ticket.driverName) && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin xe</h3>
            <div className={styles.grid}>
              {ticket.vehicleNumber && (
                <div className={styles.infoItem}>
                  <div className={styles.icon}>🚌</div>
                  <div>
                    <div className={styles.infoLabel}>Biển số xe</div>
                    <div className={styles.infoValue}>
                      {ticket.vehicleNumber}
                    </div>
                  </div>
                </div>
              )}
              {ticket.driverName && (
                <div className={styles.infoItem}>
                  <User className={styles.icon} size={18} />
                  <div>
                    <div className={styles.infoLabel}>Tài xế</div>
                    <div className={styles.infoValue}>{ticket.driverName}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {onSearchAgain && (
            <button onClick={onSearchAgain} className={styles.secondaryButton}>
              Tra cứu vé khác
            </button>
          )}
          <button className={styles.primaryButton}>In vé</button>
        </div>
      </div>
    </div>
  );
}
