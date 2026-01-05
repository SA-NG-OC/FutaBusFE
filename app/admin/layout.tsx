import React from 'react';
import AdminSidebar from '../../src/components/AdminSidebar/AdminSidebar';
import AdminHeader from '../../src/components/AdminHeader/AdminHeader';
// Import css module vừa tạo
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>
            {/* 1. Sidebar */}
            <AdminSidebar />

            {/* 2. Main Area */}
            <div className={styles['main-area']}>

                {/* Header sẽ đứng yên ở trên cùng */}
                <AdminHeader />

                {/* Nội dung thay đổi (Children) sẽ cuộn độc lập */}
                <main className={styles['content-area']}>
                    {children}
                </main>

            </div>
        </div>
    );
}