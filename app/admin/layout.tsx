/* app/admin/layout.tsx */
import React from 'react';
import AdminSidebar from '../../src/components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../src/components/AdminHeader/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', backgroundColor: 'var(--background)' }}>

            {/* 1. Sidebar */}
            <AdminSidebar />

            {/* 2. Main Area (Chứa Header + Content) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)' }}>

                {/* Header nằm ở đây */}
                <AdminHeader />

                {/* Nội dung thay đổi (Children) */}
                <main style={{
                    flex: 1,
                    padding: '32px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    transition: 'background-color 0.2s ease, color 0.2s ease'
                }}>
                    {children}
                </main>

            </div>
        </div>
    );
}