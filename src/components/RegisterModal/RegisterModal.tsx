'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '@/shared/constants/colors';
import styles from './RegisterModal.module.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

/**
 * Register Modal Component with prefill support
 * 
 * Features:
 * - Pre-filled data from passenger form
 * - Same styling as LoginModal
 * - Returns to booking flow after registration
 */
export default function RegisterModal({ isOpen, onClose, prefillData }: RegisterModalProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill data when modal opens
  useEffect(() => {
    if (isOpen && prefillData) {
      setFormData((prev) => ({
        ...prev,
        fullName: prefillData.fullName || prev.fullName,
        email: prefillData.email || prev.email,
        phoneNumber: prefillData.phoneNumber || prev.phoneNumber,
      }));
    }
  }, [isOpen, prefillData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!formData.phoneNumber.trim() || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      setError('Số điện thoại không hợp lệ (10 chữ số)');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!acceptTerms) {
      setError('Vui lòng chấp nhận điều khoản sử dụng');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
      // Close modal after 2 seconds to show success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>🎁 Đăng ký tài khoản</h2>
        <p className={styles.subtitle}>
          Đăng ký để nhận ưu đãi và quản lý vé dễ dàng hơn
        </p>

        {success ? (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✅</span>
            <p>Đăng ký thành công! Đang chuyển về trang thanh toán...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Số điện thoại</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="0901234567"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.termsRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={styles.checkbox}
                />
                Tôi đồng ý với <a href="/terms" target="_blank" className={styles.termsLink}>điều khoản sử dụng</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
              style={{
                backgroundColor: isLoading ? COLORS.textSecondary : COLORS.primary,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
            </button>
          </form>
        )}

        <div className={styles.benefits}>
          <h4>🎉 Ưu đãi khi đăng ký:</h4>
          <ul>
            <li>✓ Giảm 10% cho chuyến đi đầu tiên</li>
            <li>✓ Tích điểm thưởng mỗi chuyến đi</li>
            <li>✓ Quản lý vé và lịch sử dễ dàng</li>
            <li>✓ Nhận thông báo khuyến mãi sớm nhất</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
