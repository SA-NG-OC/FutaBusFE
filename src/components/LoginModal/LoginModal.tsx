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

type LoginMode = 'phone' | 'email';

/**
 * Reusable Login Modal Component
 * 
 * Features:
 * - Email/Phone toggle
 * - Remember me checkbox
 * - Forgot password link
 * - Sign up redirect
 * - Matches brand color palette
 * 
 * @example
 * // In any component
 * const { isLoginModalOpen, closeLoginModal, openLoginModal } = useAuth();
 * 
 * <button onClick={openLoginModal}>Login</button>
 * <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
 */
export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<LoginMode>('phone');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ emailOrPhone, password, rememberMe });
      // Modal will close automatically via AuthContext
      setEmailOrPhone('');
      setPassword('');
      setError('');
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

        <h2 className={styles.title}>Sign In</h2>
        <p className={styles.subtitle}>Choose your account type to continue</p>

        {/* Login Mode Toggle */}
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${loginMode === 'phone' ? styles.toggleActive : ''}`}
            onClick={() => setLoginMode('phone')}
            style={{
              backgroundColor: loginMode === 'phone' ? COLORS.secondary : 'transparent',
              borderColor: loginMode === 'phone' ? COLORS.secondaryDark : COLORS.border,
            }}
          >
            <span className={styles.toggleIcon}>📱</span>
            Số điện thoại
          </button>
          <button
            className={`${styles.toggleButton} ${loginMode === 'email' ? styles.toggleActive : ''}`}
            onClick={() => setLoginMode('email')}
            style={{
              backgroundColor: loginMode === 'email' ? COLORS.secondary : 'transparent',
              borderColor: loginMode === 'email' ? COLORS.secondaryDark : COLORS.border,
            }}
          >
            <span className={styles.toggleIcon}>✉️</span>
            Email
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              {loginMode === 'phone' ? 'Số điện thoại' : 'Email'}
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                {loginMode === 'phone' ? '📧' : '✉️'}
              </span>
              <input
                type={loginMode === 'phone' ? 'tel' : 'email'}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={loginMode === 'phone' ? '0989999934' : 'example@email.com'}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={styles.input}
                required
              />
            </div>
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
              Remember me
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.forgotPassword}
              style={{ color: COLORS.primary }}
            >
              Forgot password?
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
            {isLoading ? 'Đang đăng nhập...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={handleSignUp}
            className={styles.signUpLink}
            style={{ color: COLORS.primary }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
