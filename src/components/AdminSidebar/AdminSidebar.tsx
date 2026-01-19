'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.css';
import {
    FaBus, FaRoute, FaTicketAlt, FaUserTie, FaUsers,
    FaChartBar, FaSignOutAlt, FaBars, FaTimes, FaMapMarkerAlt, FaHistory, FaCogs, FaUserShield
} from 'react-icons/fa';
import { MdDashboard, MdSchedule } from 'react-icons/md';

// 1. ADMIN (IT System Admin): Chỉ quản lý hệ thống, tài khoản và log
// Giáo viên yêu cầu: Bảo trì, hỗ trợ, không nghiệp vụ.
const ADMIN_MENU = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <MdDashboard /> },
    { name: 'System Users', path: '/admin/employees', icon: <FaUserShield /> }, // Quản lý tài khoản Manager/Employee
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FaHistory /> }, // Tra cứu lịch sử lỗi/tác động
    // Có thể thêm System Settings nếu có
    // { name: 'Settings', path: '/admin/settings', icon: <FaCogs /> },
];

// 2. MANAGER (Quản lý vận hành): Thừa hưởng các quyền quản lý nghiệp vụ từ Admin cũ
const MANAGER_MENU = [
    { name: 'Dashboard', path: '/manager/dashboard', icon: <MdDashboard /> },
    { name: 'Vehicles', path: '/manager/vehicles', icon: <FaBus /> },
    { name: 'Routes', path: '/manager/routes', icon: <FaRoute /> },
    { name: 'Locations', path: '/manager/locations', icon: <FaMapMarkerAlt /> },
    { name: 'Trip Scheduling', path: '/manager/trip-scheduling', icon: <MdSchedule /> },
    { name: 'Tickets', path: '/manager/tickets', icon: <FaTicketAlt /> }, // Quản lý vé (Hủy/Duyệt/Check)
    { name: 'Drivers', path: '/manager/drivers', icon: <FaUserTie /> },
    { name: 'Customers', path: '/manager/customers', icon: <FaUsers /> }, // CRM
    { name: 'Reports', path: '/manager/reports', icon: <FaChartBar /> }, // Xem doanh thu
];

// 3. EMPLOYEE (Nhân viên): Tác nghiệp cụ thể (Bán vé, xem lịch)
const EMPLOYEE_MENU = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: <MdDashboard /> },
    { name: 'Trip Scheduling', path: '/employee/trip-scheduling', icon: <MdSchedule /> }, // Xem lịch để tư vấn
    { name: 'Tickets Sales', path: '/employee/tickets', icon: <FaTicketAlt /> }, // Bán vé là chính
    { name: 'Routes', path: '/employee/routes', icon: <FaRoute /> }, // Tra cứu tuyến
    { name: 'Drivers', path: '/employee/drivers', icon: <FaUserTie /> }, // Tra cứu thông tin tài xế (nếu cần liên lạc)
];

// Định nghĩa kiểu dữ liệu cho Props
interface SidebarProps {
    role?: 'admin' | 'manager' | 'employee';
}

const AdminSidebar = ({ role = 'admin' }: SidebarProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Logic chọn menu
    let menuItems;
    switch (role) {
        case 'manager':
            menuItems = MANAGER_MENU;
            break;
        case 'employee':
            menuItems = EMPLOYEE_MENU;
            break;
        case 'admin':
        default:
            menuItems = ADMIN_MENU;
            break;
    }

    // Close sidebar when route changes
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Hàm hiển thị tên Role cho đẹp trên giao diện
    const getRoleDisplayName = () => {
        if (role === 'admin') return 'System Admin';
        if (role === 'manager') return 'Operations Manager';
        return 'Staff';
    }

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
                            <p className={styles['brand-subtitle']}>{getRoleDisplayName()}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Section */}
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