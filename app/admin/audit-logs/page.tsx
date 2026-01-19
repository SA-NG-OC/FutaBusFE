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
          <h1>Audit Logs</h1>
          <p>Track all system activities and user actions</p>
        </div>
        <button className={styles.filterButton} onClick={refreshLogs}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <h3>Total Logs</h3>
          <div className={styles.value}>{totalElements}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Current Page</h3>
          <div className={styles.value}>{currentPage + 1}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Pages</h3>
          <div className={styles.value}>{totalPages}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>User ID</label>
            <input
              type="number"
              placeholder="Filter by user ID"
              value={filterForm.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Action</label>
            <select
              value={filterForm.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Table Name</label>
            <input
              type="text"
              placeholder="Filter by table"
              value={filterForm.tableName}
              onChange={(e) => handleFilterChange("tableName", e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={filterForm.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>End Date</label>
            <input
              type="datetime-local"
              value={filterForm.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.filterActions}>
          <button className={`${styles.filterButton} ${styles.clearButton}`} onClick={clearFilters}>
            Clear Filters
          </button>
          <button className={`${styles.filterButton} ${styles.applyButton}`} onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading audit logs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <div className={styles.empty}>
          <p>No audit logs found</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && logs.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Table</th>
                <th>Record ID</th>
                <th>IP Address</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.logId}>
                  <td>#{log.logId}</td>
                  <td>
                    <div>
                      <strong>{log.userName}</strong>
                      <br />
                      <small style={{ color: "#666" }}>{log.userEmail}</small>
                    </div>
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
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Showing {logs.length} of {totalElements} logs
            </div>
            <div className={styles.paginationButtons}>
              <button
                className={styles.paginationButton}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span style={{ padding: "8px 16px" }}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
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
              <h2>Audit Log Details</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Log ID:</div>
                <div className={styles.detailValue}>#{selectedLog.logId}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>User:</div>
                <div className={styles.detailValue}>
                  {selectedLog.userName} ({selectedLog.userEmail})
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>User ID:</div>
                <div className={styles.detailValue}>{selectedLog.userId}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Role:</div>
                <div className={styles.detailValue}>{selectedLog.userRole}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Action:</div>
                <div className={styles.detailValue}>
                  <span className={`${styles.actionBadge} ${getActionBadgeClass(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Table Name:</div>
                <div className={styles.detailValue}>{selectedLog.tableName}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Record ID:</div>
                <div className={styles.detailValue}>{selectedLog.recordId || "N/A"}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>IP Address:</div>
                <div className={styles.detailValue}>{selectedLog.ipAddress}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Timestamp:</div>
                <div className={styles.detailValue}>{formatDateTime(selectedLog.createdAt)}</div>
              </div>
              {selectedLog.oldValue && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Old Value:</div>
                  <div className={styles.detailValue}>
                    <div className={styles.codeBlock}>{selectedLog.oldValue}</div>
                  </div>
                </div>
              )}
              {selectedLog.newValue && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>New Value:</div>
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
