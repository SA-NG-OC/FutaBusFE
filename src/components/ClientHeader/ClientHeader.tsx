'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './ClientHeader.module.css';
import { FaBus, FaBars, FaTimes } from 'react-icons/fa';
// Import icon Login giống trong ảnh (mũi tên đi vào)
import { BiLogIn } from 'react-icons/bi';

const ClientHeader = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Trang chủ', path: '/home' },
        { name: 'Lịch Trình', path: '/schedule' },
        { name: 'Tra cứu vé', path: '/lookup' },
        { name: 'Về chúng tôi', path: '/about-us' },
        { name: 'Liên hệ', path: '/contact' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className={styles['client-header']}>
            <div className={styles['nav-container']}>

                {/* 1. Logo Section (Trái) */}
                <Link href="/" className={styles['company-logo']}>
                    <div className={styles['logo-icon']}>
                        <FaBus size={24} color="white" />
                    </div>
                    <div className={styles['brand-name']}>
                        <span>FUBA</span>
                        <span className={styles['brand-accent']}>Bus</span>
                    </div>
                </Link>

                {/* 2. Desktop Menu (Giữa - Ẩn trên mobile) */}
                <nav className={styles['nav-menu']}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles['nav-link']} ${isActive ? styles['active'] : ''}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. Actions (Phải: Login + Hamburger) */}
                <div className={styles['nav-buttons']}>

                    {/* Login Button: Luôn hiện (Desktop + Mobile) */}
                    <Link href="/auth/login">
                        <button className={styles['login-button']}>
                            <BiLogIn size={20} color="white" />
                            {/* Text thay đổi theo màn hình */}
                            <span className={`${styles['login-text']} ${styles['text-desktop']}`}>
                                Đăng Nhập/Đăng kí
                            </span>
                            <span className={`${styles['login-text']} ${styles['text-mobile']}`}>
                                Đăng nhập
                            </span>
                        </button>
                    </Link>

                    {/* Hamburger Button: Chỉ hiện trên Mobile */}
                    <button
                        className={styles['hamburger-btn']}
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* 4. Mobile Menu Drawer (Menu ẩn trượt ra) */}
            <div className={`${styles['mobile-menu-overlay']} ${isMobileMenuOpen ? styles['open'] : ''}`}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={styles['mobile-nav-link']}
                        onClick={() => setIsMobileMenuOpen(false)} // Đóng menu khi click
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </header>
    );
};

export default ClientHeader;