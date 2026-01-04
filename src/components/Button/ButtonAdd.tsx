'use client';

import React from 'react';
import styles from './ButtonAdd.module.css';

interface ButtonProps {
    children: React.ReactNode; // Nội dung chữ (Ví dụ: "Add Route")
    onClick?: () => void;
    icon?: React.ReactNode; // Icon tùy chỉnh (nếu muốn thay đổi)
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button = ({
    children,
    onClick,
    type = 'button',
    // Mặc định icon là dấu cộng nếu không truyền icon khác vào
    icon = (
        <svg fill="none" viewBox="0 0 16 16" width="100%" height="100%">
            <path d="M3.33333 8H12.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M8 3.33333V12.6667" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
    )
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={styles.btn}
            onClick={onClick}
        >
            {/* Nếu có icon thì hiển thị */}
            {icon && <span className={styles.icon}>{icon}</span>}

            {/* Nội dung chữ */}
            <span>{children}</span>
        </button>
    );
};

export default Button;