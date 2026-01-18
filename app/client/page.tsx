'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

export default function ClientPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (isAuthenticated && user?.role.roleName === 'ADMIN') {
            router.push('/admin/dashboard');
        } else if (isAuthenticated && user?.role.roleName === 'STAFF') {
            router.push('/employee/dashboard');
        } else if (isAuthenticated && user?.role.roleName === 'DRIVER') {
            router.push('/test-driver');
        }
    }, [isAuthenticated, user, router]);

    return (
        <div> Welcome to the Client Page! </div>
    );
}