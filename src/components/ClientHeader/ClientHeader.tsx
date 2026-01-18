"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ClientHeader.module.css";
import { FaBus, FaBars, FaTimes } from "react-icons/fa";
import { BiLogIn, BiUser, BiPackage, BiLogOut } from "react-icons/bi";
import { AiOutlineHome, AiOutlineSearch, AiOutlineInfoCircle } from "react-icons/ai";
import { MdConfirmationNumber, MdSchedule, MdContactMail } from "react-icons/md";
import { BsMoon, BsSun } from "react-icons/bs";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";

const ClientHeader = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Lịch Trình", path: "/client/booking" },
    { name: "Tra cứu vé", path: "/client/ticket-lookup" },
    { name: "Về chúng tôi", path: "/client/about-us" },
    { name: "Liên hệ", path: "/client/contact" },
  ];

  // Dynamic dropdown items based on user role
  const getDropdownItems = () => {
    if (!user) return [];
    
    const rolePrefix = user.role.roleName === 'ADMIN' ? '/admin' : 
                       user.role.roleName === 'STAFF' ? '/employee' : '/client';
    
    // Admin và Staff có menu khác với User
    if (user.role.roleName === 'ADMIN') {
      return [
        { name: "Dashboard", path: "/admin/dashboard", icon: <AiOutlineHome size={20} /> },
        { name: "Hồ sơ", path: "/admin/profile", icon: <BiUser size={20} /> },
      ];
    } else if (user.role.roleName === 'STAFF') {
      return [
        { name: "Dashboard", path: "/employee/dashboard", icon: <AiOutlineHome size={20} /> },
        { name: "Hồ sơ", path: "/employee/profile", icon: <BiUser size={20} /> },
      ];
    } else if (user.role.roleName === 'DRIVER') {
      return [
        { name: "Dashboard", path: "/test-driver", icon: <AiOutlineHome size={20} /> },
        { name: "Hồ sơ", path: "/client/profile", icon: <BiUser size={20} /> },
      ];
    } else {
      // USER role
      return [
        { name: "Hồ sơ", path: "/client/profile", icon: <BiUser size={20} /> },
        { name: "Vé của tôi", path: "/client/my-ticket", icon: <MdConfirmationNumber size={20} /> },
      ];
    }
  };
  
  const dropdownItems = getDropdownItems();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className={styles["client-header"]}>
      <div className={styles["nav-container"]}>
        {/* 1. Logo Section (Trái) */}
        <Link href="/" className={styles["company-logo"]}>
          <div className={styles["logo-icon"]}>
            <FaBus size={24} color="white" />
          </div>
          <div className={styles["brand-name"]}>
            <span>FUBA</span>
            <span className={styles["brand-accent"]}>Bus</span>
          </div>
        </Link>

        {/* 2. Desktop Menu (Giữa - Ẩn trên mobile) */}
        <nav className={styles["nav-menu"]}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles["nav-link"]} ${
                  isActive ? styles["active"] : ""
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. Actions (Phải: Theme Toggle + Avatar/Login + Hamburger) */}
        <div className={styles["nav-buttons"]}>
          {/* Dark Mode Toggle Button */}
          <button
            className={styles["theme-toggle"]}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>

          {/* Avatar Dropdown khi đã đăng nhập, Login button khi chưa */}
          {isAuthenticated ? (
            <div className={styles["avatar-container"]} ref={dropdownRef}>
              <button
                className={styles["avatar-button"]}
                onClick={toggleDropdown}
                aria-label="User Menu"
              >
                {user?.avt ? (
                  <img 
                    src={user.avt} 
                    alt={user.fullName} 
                    className={styles["avatar-img"]}
                  />
                ) : (
                  <div className={styles["avatar"]}>
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={styles["dropdown-menu"]}>
                  {/* User Info Section */}
                  <div className={styles["dropdown-header"]}>
                    {user?.avt ? (
                      <img 
                        src={user.avt} 
                        alt={user.fullName} 
                        className={styles["dropdown-avatar-img"]}
                      />
                    ) : (
                      <div className={styles["dropdown-avatar"]}>
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className={styles["dropdown-user-info"]}>
                      <p className={styles["dropdown-name"]}>{user?.fullName || 'User'}</p>
                      <p className={styles["dropdown-email"]}>{user?.email || ''}</p>
                    </div>
                  </div>

                  <div className={styles["dropdown-divider"]}></div>

                  {/* Menu Items */}
                  <div className={styles["dropdown-items"]}>
                    {dropdownItems.length > 0 && dropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={styles["dropdown-item"]}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className={styles["dropdown-item-icon"]}>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className={styles["dropdown-divider"]}></div>

                  {/* Logout */}
                  <button
                    className={styles["dropdown-logout"]}
                    onClick={handleLogout}
                  >
                    <BiLogOut size={20} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <button className={styles["login-button"]}>
                <BiLogIn size={20} color="white" />
                <span
                  className={`${styles["login-text"]} ${styles["text-desktop"]}`}
                >
                  Đăng Nhập/Đăng kí
                </span>
                <span
                  className={`${styles["login-text"]} ${styles["text-mobile"]}`}
                >
                  Đăng nhập
                </span>
              </button>
            </Link>
          )}

          {/* Hamburger Button: Chỉ hiện trên Mobile */}
          <button
            className={styles["hamburger-btn"]}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Drawer (Menu ẩn trượt ra) */}
      <div
        className={`${styles["mobile-menu-overlay"]} ${
          isMobileMenuOpen ? styles["open"] : ""
        }`}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={styles["mobile-nav-link"]}
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
