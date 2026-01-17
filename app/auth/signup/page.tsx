'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS } from '@/shared/constants/colors';

/**
 * Sign Up Page Component
 * 
 * Standalone registration page
 * Matches the brand design and uses AuthContext for registration
 */
export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      // Redirect to home or dashboard after successful registration
      router.push('/client');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/auth/login');
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

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 md:mb-4">Join FUBABus Today!</h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-12">
            Create your account to start booking tickets and enjoy seamless travel experiences.
          </p>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                ⚡
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">Quick Registration</h3>
                <p className="text-xs md:text-sm text-gray-600">Get started in under 2 minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                🎁
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">Special Offers</h3>
                <p className="text-xs md:text-sm text-gray-600">Exclusive deals for members</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                📱
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-1">Easy Management</h3>
                <p className="text-xs md:text-sm text-gray-600">Track bookings anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Right Side - Sign Up Form (White Block) */}
        <div className="w-full lg:flex-1 lg:max-w-[650px]">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="w-full max-w-[500px] mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-2 text-gray-800">Create Account</h2>
            <p className="text-center text-gray-600 text-sm mb-6 lg:mb-8">Fill in your information to get started</p>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Họ và tên</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">👤</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="text-gray-800 w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-800">Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="text-gray-800 w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Số điện thoại</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">📱</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0989999934"
                  className="text-gray-800 w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Mật khẩu</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="text-gray-800 w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Xác nhận mật khẩu</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="text-gray-800 w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
                </div>
              </div>

              {error && (
              <div className="bg-red-50 text-red-700 py-3 px-4 rounded-lg text-sm border-l-4 border-[#D83E3E]">
                {error}
                </div>
              )}

              <label className="flex items-start gap-2 text-[13px] text-gray-600 cursor-pointer leading-relaxed mt-1">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <a 
                  href="/terms" 
                  className="font-semibold transition-opacity hover:opacity-80 hover:underline"
                  style={{ color: COLORS.primary }}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a 
                  href="/privacy" 
                  className="font-semibold transition-opacity hover:opacity-80 hover:underline"
                  style={{ color: COLORS.primary }}
                >
                  Privacy Policy
                </a>
                </span>
              </label>

              <button
                type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 border-none rounded-lg text-white text-base font-semibold transition-all mt-2 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLoading ? '#999' : COLORS.primary,
                boxShadow: !isLoading ? `0 4px 12px ${COLORS.primary}4D` : 'none',
              }}
            >
                {isLoading ? 'Đang đăng ký...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleSignIn}
              className="font-semibold transition-opacity hover:opacity-80 hover:underline bg-transparent border-none cursor-pointer text-sm"
              style={{ color: COLORS.primary }}
            >
                Sign in
              </button>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
