'use client';

import React from 'react';
import styles from './PageHeader.module.css';
// Import nút Button tái sử dụng mà bạn đã tạo ở bài trước
import ButtonAdd from '../Button/ButtonAdd';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;       // Chữ trên nút (VD: Add Route)
    onAction?: () => void;      // Hàm xử lý khi bấm nút
}

const PageHeader = ({ title, subtitle, actionLabel, onAction }: PageHeaderProps) => {
    return (
        <div className={styles.container}>
            {/* Phần Text bên trái */}
            <div className={styles['text-section']}>
                <h1 className={styles.heading}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            {/* Phần Nút bên phải - Chỉ hiện khi có actionLabel */}
            {actionLabel && (
                <div className={styles['button-wrapper']}>
                    {/* Sử dụng lại Button component cũ */}
                    {/* Mặc định Button đã có icon dấu + nên không cần truyền icon */}
                    <ButtonAdd onClick={onAction}>
                        {actionLabel}
                    </ButtonAdd>
                </div>
            )}
        </div>
    );
};

export default PageHeader;