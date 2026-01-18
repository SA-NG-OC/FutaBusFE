'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/feature/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center p-4" style={{ colorScheme: 'light' }}>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
