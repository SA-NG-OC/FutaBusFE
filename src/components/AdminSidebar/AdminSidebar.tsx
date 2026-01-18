'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';
import {
    FaBus, FaRoute, FaTicketAlt, FaUserTie, FaUsers,
    FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaMapMarkerAlt
} from 'react-icons/fa';
import { MdDashboard, MdSchedule } from 'react-icons/md';

// 1. Định nghĩa danh sách menu cho ADMIN (Full quyền)
const ADMIN_MENU = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <MdDashboard /> },
    { name: 'Vehicles', path: '/admin/vehicles', icon: <FaBus /> },
    { name: 'Routes', path: '/admin/routes', icon: <FaRoute /> },
    { name: 'Locations', path: '/admin/locations', icon: <FaMapMarkerAlt /> },
    { name: 'Trip Scheduling', path: '/admin/trip-scheduling', icon: <MdSchedule /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <FaTicketAlt /> },
    { name: 'Drivers', path: '/admin/drivers', icon: <FaUserTie /> },
    { name: 'Employees', path: '/admin/employees', icon: <FaUsers /> },
    { name: 'Customers', path: '/admin/customers', icon: <FaUsers /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaChartBar /> },
    //{ name: 'Notifications', path: '/admin/notifications', icon: <FaBell /> },
];

// 2. Định nghĩa danh sách menu cho EMPLOYEE (Ít quyền hơn - Theo HTML mới của bạn)
// Lưu ý: Mình đã đổi path thành /employee/... nếu bạn dùng chung route thì sửa lại nhé
const EMPLOYEE_MENU = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: <MdDashboard /> },
    { name: 'Routes', path: '/employee/routes', icon: <FaRoute /> },
    { name: 'Trip Scheduling', path: '/employee/trip-scheduling', icon: <MdSchedule /> },
    { name: 'Tickets', path: '/employee/tickets', icon: <FaTicketAlt /> },
    { name: 'Drivers', path: '/employee/drivers', icon: <FaUserTie /> },
    //{ name: 'Notifications', path: '/employee/notifications', icon: <FaBell /> },
];

// Định nghĩa kiểu dữ liệu cho Props (mặc định là admin nếu không truyền gì)
interface SidebarProps {
    role?: 'admin' | 'employee';
}

const AdminSidebar = ({ role = 'admin' }: SidebarProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Tự động chọn menu dựa trên role được truyền vào
    const menuItems = role === 'employee' ? EMPLOYEE_MENU : ADMIN_MENU;

    // Close sidebar when route changes
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Nút Hamburger cho Mobile */}
            <button
                className={styles['hamburger-btn']}
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Overlay nền tối */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.show : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <div className={`${styles['admin-sidebar']} ${isOpen ? styles['open'] : ''}`}>

                {/* Header Section */}
                <div className={styles['sidebar-header']}>
                    <div className={styles['logo-container']}>
                        <div className={styles['logo-icon']}>
                            <FaBus size={24} />
                        </div>
                        <div className={styles['logo-text']}>
                            <p className={styles['brand-name']}>
                                FUBA<span className={styles['brand-highlight']}>Bus</span>
                            </p>
                            <p className={styles['brand-subtitle']}>Management Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Section (Render Dynamic dựa trên role) */}
                <nav className={styles['sidebar-navigation']}>
                    {menuItems.map((item) => {
                        // Logic kiểm tra active link
                        const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`${styles['nav-link']} ${isActive ? styles['active'] : ''}`}
                            >
                                <div className={styles['nav-icon']}>
                                    {item.icon}
                                </div>
                                <span className={styles['nav-text']}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className={styles['sidebar-footer']}>
                    <Link href="/auth/login" className={styles['logout-link']}>
                        <div className={styles['nav-icon']}>
                            <FaSignOutAlt />
                        </div>
                        <span className={styles['logout-text']}>Logout</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;