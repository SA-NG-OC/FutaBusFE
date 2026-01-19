'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaHistory } from 'react-icons/fa';
import { User, ActivityLog } from '../types';
import { userApi } from '../api';
import styles from './CustomerDetailModal.module.css';

interface CustomerDetailModalProps {
  customer: User;
  onClose: () => void;
}

export default function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivityLogs();
    }
  }, [activeTab, customer.userId]);

  const fetchActivityLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await userApi.getUserActivityLogs(customer.userId);
      setActivityLogs(response.content || []);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Chi tiết khách hàng</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Customer Summary */}
        <div className={styles.summary}>
          <div className={styles.avatarLarge}>
            {customer.avatarUrl ? (
              <img src={customer.avatarUrl} alt={customer.fullName} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className={styles.summaryInfo}>
            <h3 className={styles.customerName}>{customer.fullName}</h3>
            <span className={`${styles.statusBadge} ${
              customer.status === 'Active' ? styles.active : 
              customer.status === 'Locked' ? styles.locked : styles.inactive
            }`}>
              {customer.status === 'Active' ? 'Hoạt động' : 
               customer.status === 'Locked' ? 'Đã khóa' : 'Không hoạt động'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'activity' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Lịch sử hoạt động
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.content}>
          {activeTab === 'info' ? (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaUser /></div>
                <div>
                  <label>Họ và tên</label>
                  <p>{customer.fullName}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaEnvelope /></div>
                <div>
                  <label>Email</label>
                  <p>{customer.email}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaPhone /></div>
                <div>
                  <label>Số điện thoại</label>
                  <p>{customer.phoneNumber || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaMapMarkerAlt /></div>
                <div>
                  <label>Địa chỉ</label>
                  <p>{customer.address || 'Chưa cập nhật'}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaCalendar /></div>
                <div>
                  <label>Ngày tạo tài khoản</label>
                  <p>{formatDate(customer.createdAt)}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FaCalendar /></div>
                <div>
                  <label>Cập nhật lần cuối</label>
                  <p>{formatDate(customer.updatedAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.activityList}>
              {loadingLogs ? (
                <div className={styles.loading}>Đang tải...</div>
              ) : activityLogs.length === 0 ? (
                <div className={styles.empty}>
                  <FaHistory />
                  <p>Chưa có hoạt động nào</p>
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div key={log.logId} className={styles.activityItem}>
                    <div className={styles.activityDot}></div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityAction}>{log.action}</p>
                      {log.tableName && (
                        <p className={styles.activityDetails}>
                          Bảng: {log.tableName}
                          {log.recordId && ` | ID: ${log.recordId}`}
                        </p>
                      )}
                      {log.newValue && (
                        <p className={styles.activityDetails}>
                          Giá trị mới: {log.newValue}
                        </p>
                      )}
                      <span className={styles.activityTime}>
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
