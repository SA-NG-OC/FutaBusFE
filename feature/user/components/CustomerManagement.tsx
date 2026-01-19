'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaEye, FaLock, FaUnlock, FaTicketAlt, FaUser } from 'react-icons/fa';
import { userApi } from '@/feature/user/api';
import { User, CustomerFilterRequest } from '@/feature/user/types';
import styles from './CustomerManagement.module.css';
import CustomerDetailModal from './CustomerDetailModal';
import CustomerTicketsModal from './CustomerTicketsModal';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);

  // Action loading
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: CustomerFilterRequest = {
        page,
        size: pageSize,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      };
      const response = await userApi.getCustomers(params);
      setCustomers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchCustomers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleToggleStatus = async (customer: User) => {
    const newStatus = customer.status === 'Active' ? 'Locked' : 'Active';
    const confirmMessage = customer.status === 'Active' 
      ? `Bạn có chắc muốn khóa tài khoản "${customer.fullName}"?`
      : `Bạn có chắc muốn mở khóa tài khoản "${customer.fullName}"?`;
    
    if (!window.confirm(confirmMessage)) return;

    setActionLoading(customer.userId);
    try {
      await userApi.updateUserStatus(customer.userId, newStatus);
      // Refresh the list
      fetchCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetail = (customer: User) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleViewTickets = (customer: User) => {
    setSelectedCustomer(customer);
    setShowTicketsModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      Active: styles.statusActive,
      Inactive: styles.statusInactive,
      Locked: styles.statusLocked,
      Pending: styles.statusPending,
    };
    return (
      <span className={`${styles.statusBadge} ${statusStyles[status] || ''}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản Lý Khách Hàng</h1>
          <p className={styles.subtitle}>Quản lý thông tin và tài khoản khách hàng</p>
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <FaUser /> {totalElements} khách hàng
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className={styles.filterSelect}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Hoạt động</option>
          <option value="Locked">Đã khóa</option>
          <option value="Inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.loadingCell}>
                  <div className={styles.spinner}></div>
                  Đang tải...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  Không tìm thấy khách hàng nào
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.userId}>
                  <td>{customer.userId}</td>
                  <td>
                    <div className={styles.customerInfo}>
                      <div className={styles.avatar}>
                        {customer.avatarUrl ? (
                          <img src={customer.avatarUrl} alt={customer.fullName} />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <span className={styles.customerName}>{customer.fullName}</span>
                    </div>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber || '-'}</td>
                  <td>{getStatusBadge(customer.status)}</td>
                  <td>{formatDate(customer.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        onClick={() => handleViewDetail(customer)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.ticketBtn}`}
                        onClick={() => handleViewTickets(customer)}
                        title="Xem vé"
                      >
                        <FaTicketAlt />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${
                          customer.status === 'Active' ? styles.lockBtn : styles.unlockBtn
                        }`}
                        onClick={() => handleToggleStatus(customer)}
                        disabled={actionLoading === customer.userId}
                        title={customer.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {actionLoading === customer.userId ? (
                          <span className={styles.btnSpinner}></span>
                        ) : customer.status === 'Active' ? (
                          <FaLock />
                        ) : (
                          <FaUnlock />
                        )}
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
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={styles.pageBtn}
          >
            Trước
          </button>
          <span className={styles.pageInfo}>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={styles.pageBtn}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {showTicketsModal && selectedCustomer && (
        <CustomerTicketsModal
          customer={selectedCustomer}
          onClose={() => {
            setShowTicketsModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}
