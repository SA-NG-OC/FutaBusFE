"use client";
import React from "react";
import styles from "./TicketDetail.module.css";
import { QRCodeSVG } from "qrcode.react";

interface TicketDetailData {
  bookingCode: string;
  status: string;
  qrCode?: string; // Ticket code for QR (e.g., TK20260119011)
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  duration: string;
  vehicleType: string;
  licensePlate: string;
  driverName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerIdCard?: string;
  seatNumber: string;
  seatFloor: string;
  pickupLocation: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffTime: string;
}

interface TicketDetailProps {
  ticket: TicketDetailData;
  onBack?: () => void;
  onDownload?: () => void;
}

export default function TicketDetail({
  ticket,
  onBack,
  onDownload,
}: TicketDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
        return styles.statusConfirmed;
      case "PENDING":
        return styles.statusPending;
      case "CANCELLED":
      case "FAILED":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ thanh toán";
      case "CANCELLED":
      case "FAILED":
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
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>🎫</div>
            <div>
              <div className={styles.headerTitle}>Thông tin vé</div>
              <div className={styles.bookingCode}>
                Mã: {ticket.bookingCode}
              </div>
            </div>
          </div>
          <div
            className={`${styles.statusBadge} ${getStatusColor(ticket.status)}`}
          >
            {getStatusText(ticket.status)}
          </div>
        </div>

        {/* QR Code Section - Using QRCodeSVG */}
        <div className={styles.qrSection}>
          <div className={styles.qrContainer}>
            {ticket.qrCode ? (
              <QRCodeSVG 
                value={ticket.qrCode} 
                size={240}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className={styles.qrError}>
                ⚠️ Không có mã QR
              </div>
            )}
          </div>
          {ticket.qrCode && (
            <div className={styles.qrCodeText}>
              Mã vé: {ticket.qrCode}
            </div>
          )}
        </div>
        {/* Two Column Layout */}
        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Thông tin chuyến đi */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🚌</span>
                <span className={styles.sectionTitle}>Thông tin chuyến đi</span>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon}>📍</div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Tuyến đường</div>
                  <div className={styles.routeValue}>
                    {ticket.fromLocation} → {ticket.toLocation}
                  </div>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon}>📅</div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Ngày khởi hành</div>
                  <div className={styles.dateTimeValue}>
                    {ticket.departureDate}
                  </div>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon}>⏰</div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Thời gian</div>
                  <div className={styles.dateTimeValue}>
                    {ticket.departureTime} ({ticket.duration})
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin hành khách */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>👤</span>
                <span className={styles.sectionTitle}>
                  Thông tin hành khách
                </span>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Họ và tên</div>
                <div className={styles.customerName}>{ticket.customerName}</div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Số điện thoại</div>
                <div className={styles.customerName}>
                  {ticket.customerPhone}
                </div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue} style={{ wordBreak: 'break-all' }}>{ticket.customerEmail}</div>
              </div>
            </div>

            {/* Thông tin ghế */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>💺</span>
                <span className={styles.sectionTitle}>Thông tin ghế</span>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Số ghế</div>
                <div className={styles.seatNumber}>{ticket.seatNumber}</div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Vị trí</div>
                <div className={styles.infoValue}>{ticket.seatFloor}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Loại xe */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>🚐</span>
                <span className={styles.sectionTitle}>Loại xe</span>
              </div>

              <div
                className={styles.infoValue}
                style={{ marginBottom: "0.75rem", fontWeight: 600 }}
              >
                {ticket.vehicleType}
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Biển số</div>
                <div className={styles.infoValue}>{ticket.licensePlate}</div>
              </div>

              <div className={styles.infoGroup}>
                <div className={styles.infoLabel}>Tài xế</div>
                <div className={styles.infoValue}>{ticket.driverName}</div>
              </div>
            </div>

            {/* Điểm đón/trả */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📍</span>
                <span className={styles.sectionTitle}>Điểm đón/trả</span>
              </div>

              <div className={styles.locationBox}>
                <div className={styles.infoLabel}>Điểm đón</div>
                <div className={styles.locationValue}>
                  {ticket.pickupLocation}
                </div>
                <div className={styles.infoTime}>
                  {ticket.pickupTime}
                </div>
              </div>

              <div className={styles.locationBox}>
                <div className={styles.infoLabel}>Điểm trả</div>
                <div className={styles.locationValue}>
                  {ticket.dropoffLocation}
                </div>
                <div className={styles.infoTime}>
                  {ticket.dropoffTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={onDownload} className={styles.downloadButton}>
            <span>⬇</span>
            Tải xuống vé
          </button>
          {onBack && (
            <button onClick={onBack} className={styles.backButton}>
              <span>↩</span>
              Quay lại
            </button>
          )}
        </div>
      </div>

      {/* CSS Animation cho Spinner nếu chưa có trong global css */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}