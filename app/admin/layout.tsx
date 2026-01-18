import React from 'react';
import AdminSidebar from '../../src/components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../src/components/AdminHeader/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-row min-h-screen h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
            {/* 1. Sidebar */}
            <AdminSidebar />

            {/* 2. Main Area */}
            <div className="flex-1 flex flex-col h-full relative" style={{ backgroundColor: 'var(--background)' }}>

                {/* Header sẽ đứng yên ở trên cùng */}
                <AdminHeader />

                {/* Nội dung thay đổi (Children) sẽ cuộn độc lập */}
                <main className="flex-1 p-8 overflow-y-auto text-gray-900 dark:text-gray-100 transition-colors duration-200" style={{ backgroundColor: 'var(--background)' }}>
                    {children}
                </main>

            </div>
        </div>
    );
}