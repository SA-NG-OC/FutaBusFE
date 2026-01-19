"use client";

import React, { useState } from "react";
import { useAuditLogs } from "@/feature/audit-log/hooks/useAuditLogs";
import { AuditLogData } from "@/feature/audit-log/types";
import styles from "./audit-logs.module.css";

export default function AuditLogsPage() {
  const {
    logs,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    filters,
    updateFilters,
    goToPage,
    refreshLogs,
  } = useAuditLogs();

  const [selectedLog, setSelectedLog] = useState<AuditLogData | null>(null);
  const [filterForm, setFilterForm] = useState({
    userId: "",
    action: "",
    tableName: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilterForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const newFilters: any = {};
    if (filterForm.userId) newFilters.userId = parseInt(filterForm.userId);
    if (filterForm.action) newFilters.action = filterForm.action;
    if (filterForm.tableName) newFilters.tableName = filterForm.tableName;
    if (filterForm.startDate) newFilters.startDate = filterForm.startDate;
    if (filterForm.endDate) newFilters.endDate = filterForm.endDate;
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    setFilterForm({
      userId: "",
      action: "",
      tableName: "",
      startDate: "",
      endDate: "",
    });
    updateFilters({});
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes("CREATE") || action.includes("INSERT")) return styles.actionCreate;
    if (action.includes("UPDATE") || action.includes("MODIFY")) return styles.actionUpdate;
    if (action.includes("DELETE")) return styles.actionDelete;
    if (action.includes("LOGIN")) return styles.actionLogin;
    return styles.actionOther;
  };

  const handleViewDetails = (log: AuditLogData) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  return (
    <div className={styles.auditLogsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Nhật ký hệ thống</h1>
          <p>Theo dõi toàn bộ hoạt động và thao tác người dùng</p>
        </div>
        <button className={styles.filterButton} onClick={refreshLogs}>
          🔄 Làm mới
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <h3>Tổng số log</h3>
          <div className={styles.value}>{totalElements}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Trang hiện tại</h3>
          <div className={styles.value}>{currentPage + 1}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Tổng số trang</h3>
          <div className={styles.value}>{totalPages}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>ID người dùng</label>
            <input
              type="number"
              placeholder="Lọc theo ID người dùng"
              value={filterForm.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Hành động</label>
            <select
              value={filterForm.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="CREATE">Tạo mới</option>
              <option value="UPDATE">Cập nhật</option>
              <option value="DELETE">Xóa</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOGOUT">Đăng xuất</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Tên bảng</label>
            <input
              type="text"
              placeholder="Lọc theo bảng"
              value={filterForm.tableName}
              onChange={(e) => handleFilterChange("tableName", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Từ ngày</label>
            <input
              type="datetime-local"
              value={filterForm.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Đến ngày</label>
            <input
              type="datetime-local"
              value={filterForm.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterActions}>
          <button className={`${styles.filterButton} ${styles.clearButton}`} onClick={clearFilters}>
            Xóa bộ lọc
          </button>
          <button className={`${styles.filterButton} ${styles.applyButton}`} onClick={applyFilters}>
            Áp dụng
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải nhật ký...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className={styles.error}>
          <p>Lỗi: {error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && logs.length === 0 && (
        <div className={styles.empty}>
          <p>Không có nhật ký nào</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && logs.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Log</th>
                <th>Người dùng</th>
                <th>Vai trò</th>
                <th>Hành động</th>
                <th>Bảng</th>
                <th>ID bản ghi</th>
                <th>IP</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.logId}>
                  <td>#{log.logId}</td>
                  <td>
                    <strong>{log.userName}</strong>
                    <br />
                    <small style={{ color: "#666" }}>{log.userEmail}</small>
                  </td>
                  <td>
                    <span className={styles.roleBadge}>{log.userRole}</span>
                  </td>
                  <td>
                    <span className={`${styles.actionBadge} ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.tableName}</td>
                  <td>{log.recordId || "-"}</td>
                  <td>{log.ipAddress}</td>
                  <td>{formatDateTime(log.createdAt)}</td>
                  <td>
                    <button className={styles.viewButton} onClick={() => handleViewDetails(log)}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Hiển thị {logs.length}/{totalElements} log
            </div>
            <div className={styles.paginationButtons}>
              <button
                className={styles.paginationButton}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Trước
              </button>
              <span style={{ padding: "8px 16px" }}>
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết nhật ký</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>ID Log:</div>
                <div className={styles.detailValue}>#{selectedLog.logId}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Người dùng:</div>
                <div className={styles.detailValue}>
                  {selectedLog.userName} ({selectedLog.userEmail})
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>ID người dùng:</div>
                <div className={styles.detailValue}>{selectedLog.userId}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Vai trò:</div>
                <div className={styles.detailValue}>{selectedLog.userRole}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Hành động:</div>
                <div className={styles.detailValue}>
                  <span className={`${styles.actionBadge} ${getActionBadgeClass(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Tên bảng:</div>
                <div className={styles.detailValue}>{selectedLog.tableName}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>ID bản ghi:</div>
                <div className={styles.detailValue}>{selectedLog.recordId || "Không có"}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Địa chỉ IP:</div>
                <div className={styles.detailValue}>{selectedLog.ipAddress}</div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Thời gian:</div>
                <div className={styles.detailValue}>{formatDateTime(selectedLog.createdAt)}</div>
              </div>

              {selectedLog.oldValue && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Giá trị cũ:</div>
                  <div className={styles.detailValue}>
                    <div className={styles.codeBlock}>{selectedLog.oldValue}</div>
                  </div>
                </div>
              )}

              {selectedLog.newValue && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Giá trị mới:</div>
                  <div className={styles.detailValue}>
                    <div className={styles.codeBlock}>{selectedLog.newValue}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
