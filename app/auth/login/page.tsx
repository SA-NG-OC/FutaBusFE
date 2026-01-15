'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS } from '@/shared/constants/colors';

type LoginMode = 'phone' | 'email';

/**
 * Login Page Component
 * 
 * Standalone login page with phone/email toggle
 * Matches the brand design and uses AuthContext for authentication
 */
export default function LoginPage() {
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
      // Redirect to home or dashboard after successful login
      router.push('/client');
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
    <div className="flex min-h-screen bg-[#EAEAEA] items-center justify-center p-8">
      {/* Login Card - Single Block */}
      <div className="flex bg-white rounded-3xl shadow-2xl max-w-[1100px] w-full overflow-hidden">
        {/* Left Side - Branding */}
        <div className="flex-1 flex items-center justify-center p-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-[500px]">
          <div className="flex items-center gap-4 mb-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ backgroundColor: COLORS.primary, boxShadow: `0 4px 12px ${COLORS.primary}33` }}
            >
              🚌
            </div>
            <h1 className="text-5xl font-bold text-gray-800">
              FUBA<span style={{ color: COLORS.primary }}>Bus</span>
            </h1>
          </div>

          <h2 className="text-4xl font-semibold text-gray-800 mb-4">Welcome Back!</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-12">
            Sign in to book your tickets, manage your trips, or access the admin dashboard.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: COLORS.secondary }}
              >
                🎫
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Easy Booking</h3>
                <p className="text-sm text-gray-600">Book tickets in seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: COLORS.secondary }}
              >
                🔒
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% safe transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white">
          <div className="w-full max-w-[420px]">
            <h2 className="text-4xl font-semibold text-center mb-2 text-gray-800">Sign In</h2>
            <p className="text-center text-gray-600 text-sm mb-8">Choose your account type to continue</p>

            {/* Login Mode Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
              className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 hover:bg-gray-50 ${
                loginMode === 'phone' ? 'border-[#ECDDC0]' : 'border-gray-300'
              }`}
              onClick={() => setLoginMode('phone')}
              style={{
                backgroundColor: loginMode === 'phone' ? COLORS.secondary : 'transparent',
              }}
            >
                <span className="text-lg">📱</span>
                Số điện thoại
              </button>
              <button
                type="button"
              className={`flex-1 px-4 py-3 border-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 hover:bg-gray-50 ${
                loginMode === 'email' ? 'border-[#ECDDC0]' : 'border-gray-300'
              }`}
              onClick={() => setLoginMode('email')}
              style={{
                backgroundColor: loginMode === 'email' ? COLORS.secondary : 'transparent',
              }}
            >
                <span className="text-lg">✉️</span>
                Email
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">
                {loginMode === 'phone' ? 'Số điện thoại' : 'Email'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-lg text-gray-400">
                  {loginMode === 'phone' ? '📧' : '✉️'}
                </span>
                <input
                  type={loginMode === 'phone' ? 'tel' : 'email'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={loginMode === 'phone' ? '0989999934' : 'example@email.com'}
                  className="w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3.5 pl-12 pr-4 border-2 border-gray-200 rounded-lg text-[15px] transition-all outline-none focus:border-[#D83E3E] focus:shadow-[0_0_0_3px_rgba(216,62,62,0.1)] placeholder:text-gray-500"
                  required
                />
                </div>
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
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium transition-opacity hover:opacity-80 hover:underline"
                style={{ color: COLORS.primary }}
              >
                Forgot password?
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
                {isLoading ? 'Đang đăng nhập...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSignUp}
              className="font-semibold transition-opacity hover:opacity-80 hover:underline bg-transparent border-none cursor-pointer text-sm"
              style={{ color: COLORS.primary }}
            >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}