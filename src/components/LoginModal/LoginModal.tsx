'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '@/shared/constants/colors';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Reusable Login Modal Component
 * 
 * Features:
 * - Single input for email/phone
 * - Remember me checkbox
 * - Input validation & sanitization
 * - Forgot password link
 * - Sign up redirect
 * - Matches brand color palette
 */
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Input sanitization
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>"'`]/g, '')
      .replace(/[;\-\-]/g, '')
      .replace(/(\/\*|\*\/)/g, '')
      .trim();
  };

  const validateInput = (): boolean => {
    const sanitized = sanitizeInput(emailOrPhone);
    
    const sqlPatterns = [
      /('|(\-\-)|(;)|(\|\|)|(\*))/i,
      /(\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/i,
      /(exec|execute|script|javascript|alert)/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(sanitized)) {
        setError('Dữ liệu đầu vào không hợp lệ');
        return false;
      }
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
    const isPhone = /^[0-9]{10}$/.test(sanitized);

    if (!isEmail && !isPhone) {
      setError('Vui lòng nhập email hoặc số điện thoại hợp lệ');
      return false;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedInput = sanitizeInput(emailOrPhone);
      await login({ emailOrPhone: sanitizedInput, password, rememberMe });
      setEmailOrPhone('');
      setPassword('');
      setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    router.push('/auth/forgot-password');
  };

  const handleSignUp = () => {
    onClose();
    router.push('/auth/signup');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>Đăng nhập</h2>
        <p className={styles.subtitle}>Nhập thông tin đăng nhập để tiếp tục</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              SĐT/Email
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="0989999934 hoặc example@email.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.forgotPassword}
              style={{ color: COLORS.primary }}
            >
              Quên mật khẩu?
            </button>
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
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className={styles.footer}>
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={handleSignUp}
            className={styles.signUpLink}
            style={{ color: COLORS.primary }}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
