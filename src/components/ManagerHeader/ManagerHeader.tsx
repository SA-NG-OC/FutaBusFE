'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ManagerHeader.module.css'; // Đảm bảo bạn đã có file css này
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiMoon, FiBell, FiSun } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const ManagerHeader = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();

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

                {/* Phần bên trái: Lời chào cho Manager */}
                <div className={styles['welcome-section']}>
                    <h2 className={styles['welcome-title']}>
                        Xin chào, Quản lý <span role="img" aria-label="vẫy tay">👋</span>
                    </h2>
                    <p className={styles['welcome-subtitle']}>
                        Đây là tổng quan tình hình vận hành hệ thống hôm nay.
                    </p>
                </div>

                {/* Phần bên phải: Tìm kiếm & Hành động */}
                <div className={styles['header-actions']}>

                    {/* Thanh tìm kiếm (Giữ nguyên logic ẩn hiện tại) */}
                    {/* <div className={styles['search-container']}>
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

                        {/* Nút thông báo (Có thể mở lại nếu cần) */}
                        {/* <button className={`${styles['icon-button']} ${styles['notification-button']}`} aria-label="Thông báo">
                            <FiBell size={20} />
                            <span className={styles['notification-badge']}>3</span>
                        </button> */}

                        {/* Ảnh đại diện người dùng */}
                        <button
                            className={styles['avatar-button']}
                            aria-label="Hồ sơ người dùng"
                            title="Xem hồ sơ cá nhân"
                            // Điều hướng về trang profile của Manager
                            onClick={() => router.push('/manager/profile')}
                        >
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
                                    {/* Hiển thị QL (Quản Lý) nếu không tìm thấy tên */}
                                    {user ? getInitials(user.fullName) : 'QL'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ManagerHeader;