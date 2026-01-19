"use client";
import React, { useRef, useState } from "react";
import styles from "./TicketDetailModal.module.css";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface TicketDetailData {
  bookingCode: string;
  status: string;
  qrCode?: string;
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

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketDetailData | null;
}

export default function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
}: TicketDetailModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Debug logging
  console.log("🎫 [TicketDetailModal] Render - isOpen:", isOpen, "ticket:", ticket);

  if (!isOpen || !ticket) {
    console.log("❌ [TicketDetailModal] Not rendering - isOpen:", isOpen, "ticket:", !!ticket);
    return null;
  }

  console.log("✅ [TicketDetailModal] Rendering modal with ticket:", ticket.bookingCode);

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
      case "PAID":
        return "Đã xác nhận";
      case "PENDING":
        return "Chờ xác nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleDownload = async () => {
    if (!ticket || !ticketRef.current) {
      alert("Không tìm thấy thông tin vé để tải xuống");
      return;
    }

    setIsDownloading(true);

    try {
      // Find the ticket card element
      const ticketElement = ticketRef.current.querySelector(
        '[class*="ticketCard"]',
      ) as HTMLElement;

      if (!ticketElement) {
        throw new Error("Không tìm thấy thông tin vé");
      }

      // Create canvas from the ticket element
      const canvas = await html2canvas(ticketElement, {
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Calculate dimensions for PDF (A4 size in mm)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      });

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`Ve-Xe-${ticket.bookingCode}.pdf`);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Không thể tải xuống vé. Vui lòng thử lại sau.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div ref={ticketRef} className={styles.container}>
          <div className={styles.ticketCard}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerIcon}>🎫</div>
                <div>
                  <div className={styles.headerTitle}>Thông tin vé</div>
                  <div className={styles.bookingCode}>
                    Mã vé: {ticket.bookingCode}
                  </div>
                </div>
              </div>
              <div
                className={`${styles.statusBadge} ${getStatusColor(ticket.status)}`}
              >
                {getStatusText(ticket.status)}
              </div>
            </div>

            {/* QR Code */}
            <div className={styles.qrSection}>
              <QRCodeSVG
                value={ticket.qrCode || ticket.bookingCode}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Two Column Layout */}
            <div className={styles.contentGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {/* Thông tin chuyến đi */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>🚌</span>
                    <span className={styles.sectionTitle}>
                      Thông tin chuyến đi
                    </span>
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
                    <div className={styles.customerName}>
                      {ticket.customerName}
                    </div>
                  </div>

                  <div className={styles.infoGroup}>
                    <div className={styles.infoLabel}>Số điện thoại</div>
                    <div className={styles.customerName}>
                      {ticket.customerPhone}
                    </div>
                  </div>

                  <div className={styles.infoGroupInline}>
                    <div>
                      <div className={styles.infoLabel}>Email</div>
                      <div className={styles.infoValue}>
                        {ticket.customerEmail}
                      </div>
                    </div>
                    {ticket.customerIdCard && (
                      <div>
                        <div className={styles.infoLabel}>CMND/CCCD</div>
                        <div className={styles.infoValue}>
                          {ticket.customerIdCard}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin ghế */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>🎫</span>
                    <span className={styles.sectionTitle}>Thông tin ghế</span>
                  </div>

                  <div className={styles.infoGroup}>
                    <div className={styles.infoLabel}>Số ghế</div>
                    <div className={styles.seatNumber}>{ticket.seatNumber}</div>
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
                    style={{ marginBottom: "0.75rem" }}
                  >
                    {ticket.vehicleType}
                  </div>

                  <div className={styles.infoGroup}>
                    <div className={styles.infoLabel}>Biển số</div>
                    <div className={styles.infoValue}>
                      {ticket.licensePlate}
                    </div>
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
                      Thời gian: {ticket.pickupTime}
                    </div>
                  </div>

                  <div className={styles.locationBox}>
                    <div className={styles.infoLabel}>Điểm trả</div>
                    <div className={styles.locationValue}>
                      {ticket.dropoffLocation}
                    </div>
                    <div className={styles.infoTime}>
                      Thời gian dự kiến: {ticket.dropoffTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                onClick={handleDownload}
                className={styles.downloadButton}
              >
                <span>⬇</span>
                Tải xuống vé
              </button>
              <button onClick={onClose} className={styles.backButton}>
                <span>✕</span>
                Đóng
              </button>
            </div>
          </div>
        </div>

        {/* Download Progress Overlay */}
        {isDownloading && (
          <div className={styles.downloadOverlay}>
            <div className={styles.downloadDialog}>
              <div className={styles.spinner}></div>
              <p>Đang tạo file PDF...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
