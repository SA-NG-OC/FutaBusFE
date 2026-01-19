"use client";

import React, { useState } from "react";
import { useTickets } from "@/feature/ticket/hooks/useTickets";
import { TicketTable } from "@/feature/ticket/components/TicketTable/TicketTable";
import { BookingData } from "@/feature/ticket/types";
import styles from "./tickets.module.css";
// [NEW] Import component đặt vé
import AdminBookingView from "@/feature/ticket/components/AdminBookingView/AdminBookingView";
import { TicketChangeModal } from "@/feature/ticket/components/TicketChangeModal/TicketChangeModal";

export default function AdminTickets() {
  // [NEW] State để chuyển đổi chế độ hiển thị
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [ticketToChange, setTicketToChange] = useState<BookingData | null>(null);

  // Các state cũ giữ nguyên
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<BookingData | null>(
    null
  );

  const {
    tickets,
    loading,
    error,
    totalPages,
    totalElements,
    isFirst,
    isLast,
    confirmBooking,
    cancelBooking,
    refreshTickets, // Hàm này dùng để load lại danh sách vé sau khi đặt xong
  } = useTickets(page, 20, statusFilter, searchTerm);

  // [NEW] Logic chuyển màn hình: Nếu đang ở chế độ Booking thì hiện AdminBookingView
  if (isBookingMode) {
    return (
      <AdminBookingView
        onBack={() => {
          setIsBookingMode(false); // Quay lại màn hình danh sách
          refreshTickets(); // Load lại dữ liệu vé mới nhất
        }}
      />
    );
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CŨ (GIỮ NGUYÊN) ---

  const handleFilterAll = () => {
    setStatusFilter(null);
    setPage(0);
  };

  const handleFilterConfirmed = () => {
    setStatusFilter("Paid");
    setPage(0);
  };

  const handleFilterPending = () => {
    setStatusFilter("Pending");
    setPage(0);
  };

  const handleFilterCancelled = () => {
    setStatusFilter("Cancelled");
    setPage(0);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setPage(0);
  };

  const handleView = (ticket: BookingData) => {
    setSelectedTicket(ticket);
  };

  const handleChangeTicket = (ticket: BookingData) => {
    setTicketToChange(ticket);
    setChangeModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleCloseChangeModal = () => {
    setChangeModalOpen(false);
    setTicketToChange(null);
  };

  const handleChangeSuccess = () => {
    refreshTickets();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.ticketsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>All Tickets</h1>
          <p>Quản lý tất cả vé đặt xe</p>
        </div>

        {/* [NEW] Nút "Đặt vé tại quầy" */}
        <button
          onClick={() => setIsBookingMode(true)}
          style={{
            backgroundColor: "#D83E3E",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#b93535")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#D83E3E")
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="12" y1="14" x2="12" y2="18"></line>
            <line x1="10" y1="16" x2="14" y2="16"></line>
          </svg>
          Đặt vé tại quầy
        </button>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã booking, tên khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m21 21-4.35-4.35"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${
              statusFilter === null ? styles.active : ""
            }`}
            onClick={handleFilterAll}
          >
            Tất cả
          </button>
          <button
            className={`${styles.filterButton} ${
              statusFilter === "Paid" ? styles.active : ""
            }`}
            onClick={handleFilterConfirmed}
          >
            Đã xác nhận
          </button>
          <button
            className={`${styles.filterButton} ${
              statusFilter === "Pending" ? styles.active : ""
            }`}
            onClick={handleFilterPending}
          >
            Chờ xác nhận
          </button>
          <button
            className={`${styles.filterButton} ${
              statusFilter === "Cancelled" ? styles.active : ""
            }`}
            onClick={handleFilterCancelled}
          >
            Đã hủy
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorContainer}>
          <p>Lỗi: {error}</p>
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className={styles.emptyContainer}>
          <p>Không tìm thấy vé nào</p>
        </div>
      )}

      {/* Ticket Table */}
      {!loading && !error && tickets.length > 0 && (
        <>
          <TicketTable
            tickets={tickets}
            onConfirm={confirmBooking}
            onCancel={cancelBooking}
            onView={handleView}
            onChangeTicket={handleChangeTicket}
          />

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={isFirst}
            >
              Trang trước
            </button>
            <span className={styles.paginationInfo}>
              Trang {page + 1} / {Math.max(1, totalPages)} (Tổng:{" "}
              {totalElements} vé)
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setPage(page + 1)}
              disabled={isLast}
            >
              Trang sau
            </button>
          </div>
        </>
      )}

      {/* Modal Details (Giữ nguyên) */}
      {selectedTicket && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Chi tiết vé</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Mã booking:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.bookingCode}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Khách hàng:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.customerName}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Số điện thoại:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.customerPhone}
                </div>
              </div>
              {selectedTicket.customerEmail && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Email:</div>
                  <div className={styles.detailValue}>
                    {selectedTicket.customerEmail}
                  </div>
                </div>
              )}
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Tuyến đường:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.tripInfo.routeName}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Ngày khởi hành:</div>
                <div className={styles.detailValue}>
                  {formatDate(selectedTicket.tripInfo.departureTime)} -{" "}
                  {formatTime(selectedTicket.tripInfo.departureTime)}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Phương tiện:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.tripInfo.vehicleInfo}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Tài xế:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.tripInfo.driverName}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Ghế:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.tickets
                    .map((t) => `${t.seatNumber} (${formatPrice(t.price)})`)
                    .join(", ")}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Tổng tiền:</div>
                <div className={styles.detailValue}>
                  {formatPrice(selectedTicket.totalAmount)}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Trạng thái:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.bookingStatus}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Loại booking:</div>
                <div className={styles.detailValue}>
                  {selectedTicket.bookingType}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Ngày đặt:</div>
                <div className={styles.detailValue}>
                  {formatDate(selectedTicket.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Change Modal */}
      {ticketToChange && (
        <TicketChangeModal
          isOpen={changeModalOpen}
          onClose={handleCloseChangeModal}
          ticketId={ticketToChange.tickets[0].ticketId}
          currentTripId={ticketToChange.tripInfo.tripId}
          currentSeatNumber={ticketToChange.tickets.map(t => t.seatNumber).join(", ")}
          currentRouteName={ticketToChange.tripInfo.routeName}
          currentPrice={ticketToChange.tickets[0].price}
          currentDepartureTime={ticketToChange.tripInfo.departureTime}
          routeId={ticketToChange.tripInfo.routeId}
          onSuccess={handleChangeSuccess}
        />
      )}
    </div>
  );
}
