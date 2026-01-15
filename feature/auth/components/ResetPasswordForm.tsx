'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { COLORS } from '@/shared/constants/colors';
import { resetPassword } from '@/feature/auth/api/index';

/**
 * Reset Password Form Component
 * 
 * Features:
 * - Token validation from URL query params
 * - Password strength indicator
 * - Confirm password matching
 * - Matches LoginModal theme
 * - Success/error handling
 * 
 * URL: /auth/reset-password?token=xxx
 */
export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const errorParam = searchParams.get('error');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  useEffect(() => {
    // Check for error in URL params
    if (errorParam === 'invalid_token') {
      setError('Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.');
      setIsValidatingToken(false);
      return;
    }

    if (!token) {
      setError('Token không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu mới.');
      setIsValidatingToken(false);
      return;
    }

    // Token is already validated by backend redirect, so just set as valid
    setIsValidatingToken(false);
  }, [token, errorParam]);

  // Update password strength indicators
  useEffect(() => {
    setPasswordStrength({
      hasLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!passwordStrength.hasLength || !passwordStrength.hasUppercase || 
        !passwordStrength.hasLowercase || !passwordStrength.hasNumber) {
      setError('Mật khẩu chưa đủ mạnh. Vui lòng kiểm tra yêu cầu bên dưới.');
      return;
    }

    if (!token) {
      setError('Token không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out]">
          <div className="flex flex-col items-center gap-4 text-gray-600">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D83E3E] rounded-full animate-spin"></div>
            <p>Đang xác thực token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out]">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-[scaleIn_0.5s_ease-out]">
            ✓
          </div>
          <h2 className="text-[32px] font-semibold text-center mb-2 text-gray-800">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-center text-gray-600 leading-relaxed mt-2">
            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out]">
        <div className="mb-8">
          <h2 className="text-[32px] font-semibold text-center mb-2 text-gray-800">
            Đặt lại mật khẩu
          </h2>
          <p className="text-center text-gray-600 text-sm">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">Mật khẩu mới</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base text-gray-600 z-10">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 px-12 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-[#D83E3E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!!error && error.includes('Token')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-lg cursor-pointer p-1 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-transparent border-none"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Password Strength Indicators */}
          {newPassword && (
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg -mt-1">
              <div className={`text-[13px] flex items-center gap-1.5 transition-colors ${passwordStrength.hasLength ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {passwordStrength.hasLength ? '✓' : '○'} Tối thiểu 8 ký tự
              </div>
              <div className={`text-[13px] flex items-center gap-1.5 transition-colors ${passwordStrength.hasUppercase ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {passwordStrength.hasUppercase ? '✓' : '○'} Có chữ hoa
              </div>
              <div className={`text-[13px] flex items-center gap-1.5 transition-colors ${passwordStrength.hasLowercase ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {passwordStrength.hasLowercase ? '✓' : '○'} Có chữ thường
              </div>
              <div className={`text-[13px] flex items-center gap-1.5 transition-colors ${passwordStrength.hasNumber ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {passwordStrength.hasNumber ? '✓' : '○'} Có số
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">Xác nhận mật khẩu</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base text-gray-600 z-10">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 px-12 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-[#D83E3E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!!error && error.includes('Token')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-lg cursor-pointer p-1 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-transparent border-none"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className={`py-2.5 px-4 rounded-lg text-sm font-medium text-center -mt-1 transition-all ${
              newPassword === confirmPassword 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-600'
            }`}>
              {newPassword === confirmPassword ? (
                <>✓ Mật khẩu khớp</>
              ) : (
                <>✗ Mật khẩu không khớp</>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 py-3 px-4 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!!error && error.includes('Token'))}
            className="w-full py-3.5 border-none rounded-lg text-white text-base font-semibold cursor-pointer transition-all mt-2 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(216,62,62,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isLoading || (!!error && error.includes('Token')) 
                ? COLORS.textSecondary 
                : COLORS.primary,
              cursor: isLoading || (!!error && error.includes('Token')) 
                ? 'not-allowed' 
                : 'pointer',
            }}
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          Nhớ mật khẩu?{' '}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-transparent border-none font-semibold cursor-pointer transition-opacity hover:opacity-80 hover:underline"
            style={{ color: COLORS.primary }}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
