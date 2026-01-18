'use client';

import ForgotPasswordForm from '@/feature/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center p-4" style={{ colorScheme: 'light' }}>
      <ForgotPasswordForm />
    </div>
  );
}
