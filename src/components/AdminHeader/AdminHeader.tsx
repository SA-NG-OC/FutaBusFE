'use client';

import React from 'react';
import Image from 'next/image';
import styles from './AdminHeader.module.css';
import { useTheme } from '../../../src/context/ThemeContext';
import { useAuth } from '../../../src/context/AuthContext';

import { FiSearch, FiMoon, FiBell, FiSun } from 'react-icons/fi';

const AdminHeader = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    // Lấy chữ cái đầu của tên để làm avatar mặc định
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className={styles['admin-header']}>
            <div className={styles['header-container']}>

                {/* Phần bên trái: Lời chào */}
                <div className={styles['welcome-section']}>
                    <h2 className={styles['welcome-title']}>
                        Xin chào {user?.fullName || 'Quản trị viên'} <span role="img" aria-label="vẫy tay">👋</span>
                    </h2>
                    <p className={styles['welcome-subtitle']}>
                        Đây là tình hình hoạt động cửa hàng của bạn hôm nay.
                    </p>
                </div>

                {/* Phần bên phải: Tìm kiếm & Hành động */}
                <div className={styles['header-actions']}>

                    {/* Thanh tìm kiếm (Đang ẩn)
                    <div className={styles['search-container']}>
                        <div className={styles['search-icon']}>
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            className={styles['search-input']}
                            placeholder="Tìm kiếm..."
                        />
                    </div> */}

                    {/* Các nút hành động */}
                    <div className={styles['action-buttons']}>

                        {/* Nút chuyển đổi giao diện Sáng/Tối */}
                        <button
                            className={styles['icon-button']}
                            onClick={toggleTheme}
                            aria-label="Chuyển đổi giao diện"
                        >
                            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        {/* Nút thông báo */}
                        {/* <button className={`${styles['icon-button']} ${styles['notification-button']}`} aria-label="Thông báo">
                            <FiBell size={20} />
                            <span className={styles['notification-badge']}>3</span>
                        </button> */}

                        {/* Ảnh đại diện người dùng */}
                        <button className={styles['avatar-button']} aria-label="Hồ sơ người dùng">
                            {user?.avt ? (
                                <Image
                                    src={user.avt}
                                    alt={user.fullName}
                                    width={40}
                                    height={40}
                                    className={styles['avatar-image']}
                                />
                            ) : (
                                <span className={styles['avatar-text']}>
                                    {/* Thay 'AU' bằng 'QT' (Quản Trị) khi chưa có user */}
                                    {user ? getInitials(user.fullName) : 'QT'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;