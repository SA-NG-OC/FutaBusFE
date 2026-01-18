import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTruck } from "react-icons/fa";
import styles from "./VehicleTable.module.css";

// Types for Vehicle data
interface VehicleData {
  vehicleId: number;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  createdAt: string;
}

interface VehicleTableProps {
  vehicles: VehicleData[];
  loading?: boolean;
  onEditVehicle: (vehicle: VehicleData) => void;
  onDeleteVehicle: (vehicleId: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
}

export default function VehicleTable({
  vehicles = [],
  loading = false,
  onEditVehicle,
  onDeleteVehicle,
  currentPage = 0,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
}: VehicleTableProps) {
  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status badge class
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return `${styles.statusBadge} ${styles.statusActive}`;
      case "INACTIVE":
        return `${styles.statusBadge} ${styles.statusInactive}`;
      case "MAINTENANCE":
        return `${styles.statusBadge} ${styles.statusMaintenance}`;
      default:
        return styles.statusBadge;
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "MAINTENANCE":
        return "Bảo trì";
      default:
        return status;
    }
  };

  // Pagination helper
  const renderPagination = () => {
    if (!onPageChange || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`${styles.paginationButton} ${
            i === currentPage ? styles.paginationButtonActive : ""
          }`}
        >
          {i + 1}
        </button>,
      );
    }

    return (
      <div className={styles.paginationButtons}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`${styles.paginationButton} ${
            currentPage === 0 ? styles.paginationButtonDisabled : ""
          }`}
        >
          ‹ Trước
        </button>
        {pages}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`${styles.paginationButton} ${
            currentPage >= totalPages - 1 ? styles.paginationButtonDisabled : ""
          }`}
        >
          Sau ›
        </button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Đang tải danh sách xe...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.tableHeaderCell}>Biển số</th>
              <th className={styles.tableHeaderCell}>Loại xe</th>
              <th className={styles.tableHeaderCell}>Sức chứa</th>
              <th className={styles.tableHeaderCell}>Trạng thái</th>
              <th className={styles.tableHeaderCell}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>🚌</div>
                    <div className={styles.emptyStateText}>Chưa có xe nào</div>
                    <div className={styles.emptyStateSubtext}>
                      Thêm xe đầu tiên để bắt đầu quản lý đội xe
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div style={{ fontWeight: 600, color: "#1f2937" }}>
                      {vehicle.licensePlate}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.typeBadge}>
                      {vehicle.vehicleType}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{vehicle.capacity} chỗ</td>
                  <td className={styles.tableCell}>
                    <span className={getStatusClass(vehicle.status)}>
                      {getStatusText(vehicle.status)}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => onEditVehicle(vehicle)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteVehicle(vehicle.vehicleId)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Xóa"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {vehicles.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {vehicles.length} / {totalElements} xe
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  );
}
