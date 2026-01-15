'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS } from '@/shared/constants/colors';
import { forgotPassword } from '@/feature/auth/api/index';

/**
 * Forgot Password Form Component
 * 
 * Features:
 * - Email/Phone input
 * - Sends reset link via email or OTP via SMS
 * - Matches LoginModal theme
 * - Success/error handling
 */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const message = await forgotPassword({ emailOrPhone });
      setSuccessMessage(message);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yêu cầu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out]">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 animate-[scaleIn_0.5s_ease-out]">
            ✓
          </div>
          <h2 className="text-[32px] font-semibold text-center mb-2 text-gray-800">
            Email đã được gửi!
          </h2>
          <p className="text-center text-gray-800 text-base leading-relaxed mt-2 mb-4">
            {successMessage}
          </p>
          <p className="text-center text-gray-600 text-sm leading-normal mb-6">
            Vui lòng kiểm tra email hoặc tin nhắn của bạn và làm theo hướng dẫn.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 border-none rounded-lg text-white text-base font-semibold cursor-pointer transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(216,62,62,0.3)] active:translate-y-0"
            style={{ backgroundColor: COLORS.primary }}
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-xl animate-[slideUp_0.3s_ease-out]">
        <div className="mb-8">
          <h2 className="text-[32px] font-semibold text-center mb-2 text-gray-800">
            Quên mật khẩu?
          </h2>
          <p className="text-center text-gray-600 text-sm leading-normal">
            Nhập email hoặc số điện thoại để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">Email hoặc Số điện thoại</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base text-gray-600 z-10">📧</span>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="example@email.com hoặc 0989999934"
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg text-sm text-gray-800 transition-colors focus:outline-none focus:border-[#D83E3E]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 py-3 px-4 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 border-none rounded-lg text-white text-base font-semibold cursor-pointer transition-all mt-2 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(216,62,62,0.3)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isLoading ? COLORS.textSecondary : COLORS.primary,
            }}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
          </button>
        </form>

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
