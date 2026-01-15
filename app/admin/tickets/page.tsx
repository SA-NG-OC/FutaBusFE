"use client";

import React, { useState } from "react";
import { useTickets } from "@/feature/ticket/hooks/useTickets";
import { TicketTable } from "@/feature/ticket/components/TicketTable/TicketTable";
import { BookingData } from "@/feature/ticket/types";
import styles from "./tickets.module.css";

export default function AdminTickets() {
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
  } = useTickets(page, 20, statusFilter, searchTerm);

  // Filter handlers
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

  // Search handler
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setPage(0);
  };

  const handleView = (ticket: BookingData) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
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
      <div className={styles.header}>
        <h1>All Tickets</h1>
        <p>Quản lý tất cả vé đặt xe</p>
      </div>

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

      {!loading && !error && tickets.length > 0 && (
        <>
          <TicketTable
            tickets={tickets}
            onConfirm={confirmBooking}
            onCancel={cancelBooking}
            onView={handleView}
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

      {/* Modal for ticket details */}
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
    </div>
  );
}
