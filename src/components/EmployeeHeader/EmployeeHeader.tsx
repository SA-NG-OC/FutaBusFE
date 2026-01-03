'use client';

import React from 'react';
import styles from './EmployeeHeader.module.css';
import { useTheme } from '../../../src/context/ThemeContext'; // Import context theme cũ
// Import bộ icon Feather (Fi) nhìn thanh mảnh giống ảnh mẫu
import {
    FiFlag,
    FiMaximize,
    FiStar,
    FiMoon,
    FiSun,
    FiBell
} from 'react-icons/fi';

const EmployeeHeader = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles['header-wrapper']}>
            <div className={styles['header-card']}>

                {/* --- LEFT: Welcome Text --- */}
                <div className={styles['welcome-section']}>
                    <h2 className={styles['welcome-title']}>
                        Welcome Alex <span role="img" aria-label="wave">👋</span>
                    </h2>
                    <p className={styles['welcome-subtitle']}>
                        Have a good day, baby.
                    </p>
                </div>

                {/* --- RIGHT: Action Icons --- */}
                <div className={styles['header-actions']}>

                    {/* 1. Flag Icon */}
                    <button className={styles['icon-button']} title="Language">
                        <FiFlag size={20} />
                    </button>

                    {/* 2. Fullscreen Icon */}
                    <button className={styles['icon-button']} title="Fullscreen">
                        <FiMaximize size={20} />
                    </button>

                    {/* 3. Star Icon */}
                    <button className={styles['icon-button']} title="Favorites">
                        <FiStar size={20} />
                    </button>

                    {/* 4. Theme Toggle (Chức năng hoạt động) */}
                    <button
                        className={styles['icon-button']}
                        onClick={toggleTheme}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>

                    {/* 5. Notification Icon */}
                    <button className={`${styles['icon-button']} ${styles['notification-button']}`}>
                        <FiBell size={20} />
                        <span className={styles['notification-badge']}>3</span>
                    </button>

                    {/* 6. Avatar */}
                    <button className={styles['avatar-button']}>
                        <span className={styles['avatar-text']}>AU</span>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EmployeeHeader;