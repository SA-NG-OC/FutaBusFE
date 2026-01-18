"use client";
import React, { useEffect, useState } from "react";
import styles from "./TicketDetail.module.css";
import { ticketApi } from "@/feature/ticket/api/ticketApi";

interface TicketDetailData {
  bookingCode: string;
  status: string;
  qrCode?: string; // Đây là mã vé (VD: TK-001) dùng để gọi API
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
  // State quản lý ảnh QR
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState<boolean>(false);

  // Effect: Gọi API lấy ảnh QR từ Backend (Ảnh này chứa link web)
  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchQr = async () => {
      // Ưu tiên dùng ticketCode (qrCode), nếu không có thì dùng bookingCode
      const codeToFetch = ticket.qrCode || ticket.bookingCode;

      if (!codeToFetch) return;

      setLoadingQr(true);
      try {
        // Gọi API getTicketQrImage (nhớ đảm bảo API này trả về Blob)
        const blob = await ticketApi.getTicketQrImage(codeToFetch);

        // Tạo URL ảo từ Blob
        objectUrl = URL.createObjectURL(blob);
        setQrImageUrl(objectUrl);
      } catch (error) {
        console.error("Lỗi khi tải mã QR:", error);
        setQrImageUrl(null);
      } finally {
        setLoadingQr(false);
      }
    };

    fetchQr();

    // Cleanup: Xóa URL ảo khi component unmount để tránh leak memory
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [ticket.qrCode, ticket.bookingCode]);

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

        {/* QR Code Section */}
        <div className={styles.qrSection} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: "280px",  // Tăng kích thước khung chứa (Cũ là 220px)
              height: "280px", // Tăng kích thước khung chứa
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff", // Nên để nền trắng cho QR dễ đọc
              borderRadius: "16px",
              border: "2px solid #eee", // Viền nhẹ cho đẹp
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // Đổ bóng nhẹ
              padding: "10px"
            }}
          >
            {loadingQr ? (
              // Loading Skeleton
              <div style={{ color: "#999", fontSize: "0.9rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "30px", height: "30px", border: "3px solid #ccc", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                <span>Đang tạo QR...</span>
              </div>
            ) : qrImageUrl ? (
              // Success Image
              <img
                src={qrImageUrl}
                alt="Mã QR Vé"
                style={{
                  width: "100%",      // Ăn theo khung cha (280px)
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                  display: "block"    // Loại bỏ khoảng trắng thừa của thẻ img
                }}
              />
            ) : (
              // Error State
              <div style={{ color: "#ff4d4f", fontSize: "0.85rem", padding: "0 20px", textAlign: "center" }}>
                ⚠️ Lỗi tải QR
              </div>
            )}
          </div>
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