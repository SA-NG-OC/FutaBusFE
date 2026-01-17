'use client';

import React from 'react';
import styles from './AdminHeader.module.css';
import { useTheme } from '../../../src/context/ThemeContext';

import { FiSearch, FiMoon, FiBell, FiSun } from 'react-icons/fi';

const AdminHeader = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <header className={styles['admin-header']}>
            <div className={styles['header-container']}>

                {/* Left Section: Welcome Text */}
                <div className={styles['welcome-section']}>
                    <h2 className={styles['welcome-title']}>
                        Welcome Admin <span role="img" aria-label="wave">👋</span>
                    </h2>
                    <p className={styles['welcome-subtitle']}>
                        Here's what's happening with your store today.
                    </p>
                </div>

                {/* Right Section: Search & Actions */}
                <div className={styles['header-actions']}>

                    {/* Search Bar
                    <div className={styles['search-container']}>
                        <div className={styles['search-icon']}>
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            className={styles['search-input']}
                            placeholder="Search"
                        />
                    </div> */}

                    {/* Action Buttons */}
                    <div className={styles['action-buttons']}>

                        {/* Theme Toggle Button */}
                        <button
                            className={styles['icon-button']}
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        {/* Notification Button */}
                        {/* <button className={`${styles['icon-button']} ${styles['notification-button']}`} aria-label="Notifications">
                            <FiBell size={20} />
                            <span className={styles['notification-badge']}>3</span>
                        </button> */}

                        {/* User Avatar */}
                        <button className={styles['avatar-button']} aria-label="User Profile">
                            <span className={styles['avatar-text']}>AU</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;