import React from 'react';
import ClientHeader from '@/src/components/ClientHeader/ClientHeader';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--background)'
        }}>

            {/* Header luôn nằm trên cùng */}
            <ClientHeader />

            {/* Phần nội dung chính sẽ thay đổi */}
            <main style={{
                flex: 1, /* Đẩy footer xuống đáy (nếu có sau này) */
                width: '100%',
                maxWidth: '1440px', /* Giới hạn chiều rộng nội dung cho đẹp mắt giống header */
                margin: '0 auto',   /* Căn giữa màn hình */
                padding: '32px 64px', /* Padding giống Header để thẳng hàng */
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)'
            }}>
                {children}
            </main>

            {/* Bạn có thể thêm <ClientFooter /> ở đây sau này */}
        </div>
    );
}