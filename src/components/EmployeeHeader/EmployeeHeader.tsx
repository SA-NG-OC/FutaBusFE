'use client';

import React from 'react';
import styles from './EmployeeHeader.module.css';
import { useTheme } from '../../../src/context/ThemeContext';
// Chỉ import những icon cần dùng
import {
    FiMoon,
    FiSun,
} from 'react-icons/fi';

const EmployeeHeader = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles['header-wrapper']}>
            <div className={styles['header-card']}>

                {/* --- LEFT: Welcome Text --- */}
                <div className={styles['welcome-section']}>
                    <h2 className={styles['welcome-title']}>
                        Welcome Staff <span role="img" aria-label="wave">👋</span>
                    </h2>
                    <p className={styles['welcome-subtitle']}>
                        Have a good day.
                    </p>
                </div>

                {/* --- RIGHT: Action Icons --- */}
                <div className={styles['header-actions']}>

                    {/* 1. Theme Toggle */}
                    <button
                        className={styles['icon-button']}
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>

                    {/* 2. Avatar */}
                    <button className={styles['avatar-button']}>
                        {/* Có thể đổi chữ AU thành ST (Staff) hoặc lấy từ user login */}
                        <span className={styles['avatar-text']}>ST</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EmployeeHeader;