'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaTicketAlt, FaBus, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { User } from '../types';
import { userApi } from '../api';
import styles from './CustomerTicketsModal.module.css';

interface CustomerTicketsModalProps {
  customer: User;
  onClose: () => void;
}

interface BookingInfo {
  bookingId: number;
  bookingCode: string;
  bookingStatus: string;
  totalAmount: number;
  createdAt: string;
  tripInfo: {
    tripId: number;
    routeName: string;
    departureTime: string;
    arrivalTime: string;
    vehicleType: string;
    seatNumbers: string[];
  };
}

export default function CustomerTicketsModal({ customer, onClose }: CustomerTicketsModalProps) {
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, [customer.userId, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await userApi.getCustomerTickets(customer.userId, page, 5);
      setBookings(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Confirmed: { label: 'Đã xác nhận', className: styles.statusConfirmed },
      Pending: { label: 'Chờ xử lý', className: styles.statusPending },
      Cancelled: { label: 'Đã hủy', className: styles.statusCancelled },
      Completed: { label: 'Hoàn thành', className: styles.statusCompleted },
    };
    const info = statusMap[status] || { label: status, className: '' };
    return (
      <span className={`${styles.statusBadge} ${info.className}`}>
        {info.label}
      </span>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Vé của {customer.fullName}</h2>
            <p className={styles.subtitle}>{customer.email}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Đang tải...
            </div>
          ) : bookings.length === 0 ? (
            <div className={styles.empty}>
              <FaTicketAlt />
              <p>Khách hàng chưa có vé nào</p>
            </div>
          ) : (
            <div className={styles.bookingList}>
              {bookings.map((booking) => (
                <div key={booking.bookingId} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <span className={styles.bookingCode}>#{booking.bookingCode}</span>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                  
                  <div className={styles.tripInfo}>
                    <div className={styles.tripRoute}>
                      <FaMapMarkerAlt className={styles.routeIcon} />
                      <span>{booking.tripInfo?.routeName || 'N/A'}</span>
                    </div>
                    <div className={styles.tripDetails}>
                      <div className={styles.tripDetail}>
                        <FaCalendar />
                        <span>{booking.tripInfo?.departureTime ? formatDate(booking.tripInfo.departureTime) : 'N/A'}</span>
                      </div>
                      <div className={styles.tripDetail}>
                        <FaBus />
                        <span>{booking.tripInfo?.vehicleType || 'N/A'}</span>
                      </div>
                    </div>
                    <div className={styles.seatInfo}>
                      <strong>Ghế:</strong> {booking.tripInfo?.seatNumbers?.join(', ') || 'N/A'}
                    </div>
                  </div>

                  <div className={styles.bookingFooter}>
                    <span className={styles.bookingDate}>
                      Đặt lúc: {formatDate(booking.createdAt)}
                    </span>
                    <span className={styles.totalAmount}>
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              {page + 1} / {totalPages}
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
      </div>
    </div>
  );
}
