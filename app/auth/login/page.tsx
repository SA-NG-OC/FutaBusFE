'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS } from '@/shared/constants/colors';

/**
 * Login Page Component
 * 
 * Standalone login page
 * Matches the brand design and uses AuthContext for authentication
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Input sanitization to prevent SQL injection
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>"'`]/g, '') // Remove potential XSS characters
      .replace(/[;\-\-]/g, '') // Remove SQL comment markers
      .replace(/(\/\*|\*\/)/g, '') // Remove SQL block comments
      .trim();
  };

  const validateInput = (): boolean => {
    const sanitized = sanitizeInput(emailOrPhone);
    
    // Check for SQL injection patterns
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

    // Validate email or phone format
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
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center p-4 lg:p-8" style={{ colorScheme: 'light' }}>
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20 xl:gap-32">
        {/* Left Side - Branding (No Block) - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-4 md:p-8 w-full">
          <div className="max-w-[600px] w-full">
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
            <div 
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-lg"
              style={{ backgroundColor: COLORS.primary, boxShadow: `0 4px 12px ${COLORS.primary}33` }}
            >
              🚌
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              FUBA<span style={{ color: COLORS.primary }}>Bus</span>
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 md:mb-4">Chào mừng trở lại!</h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-12">
            Đăng nhập để đặt vé, quản lý chuyến đi hoặc truy cập bảng điều khiển quản trị.
          </p>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-2 border-transparent rounded-xl transition-all hover:border-[#ECDDC0] hover:bg-[#F5EFE1]/30 cursor-default">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                🎫
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">Đặt vé dễ dàng</h3>
                <p className="text-xs md:text-sm text-gray-600">Đặt vé chỉ trong vài giây</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border-2 border-transparent rounded-xl transition-all hover:border-[#ECDDC0] hover:bg-[#F5EFE1]/30 cursor-default">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                🔒
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">Thanh toán bảo mật</h3>
                <p className="text-xs md:text-sm text-gray-600">Giao dịch an toàn 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Right Side - Login Form (White Block) */}
        <div className="w-full lg:flex-1 lg:max-w-[650px]">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[500px] mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-2 text-gray-800">Đăng nhập</h2>
            <p className="text-center text-gray-600 text-sm mb-6 lg:mb-8">Nhập thông tin đăng nhập để tiếp tục</p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">
                  SĐT/Email
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="0989999934 hoặc example@email.com"
                  className="text-gray-800 w-full py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-gray-800 w-full py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
              </div>

              {error && (
              <div className="bg-red-50 text-red-700 py-3 px-4 rounded-lg text-sm border-l-4 border-[#D83E3E]">
                {error}
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium transition-opacity hover:opacity-80 hover:underline"
                style={{ color: COLORS.primary }}
              >
                Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 border-none rounded-lg text-white text-base font-semibold transition-all mt-2 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLoading ? '#999' : COLORS.primary,
                boxShadow: !isLoading ? `0 4px 12px ${COLORS.primary}4D` : 'none',
              }}
            >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={handleSignUp}
              className="font-semibold transition-opacity hover:opacity-80 hover:underline bg-transparent border-none cursor-pointer text-sm"
              style={{ color: COLORS.primary }}
            >
                Đăng ký ngay
              </button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
} 