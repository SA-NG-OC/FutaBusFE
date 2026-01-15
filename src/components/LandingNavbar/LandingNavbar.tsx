"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { COLORS } from "@/shared/constants/colors";
import { FaBus, FaUser } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
import styles from "./LandingNavbar.module.css";

/**
 * Simple Navigation Bar for Landing Page
 * Features: Logo, Navigation Links, Login Button, User Profile (when authenticated)
 */
export default function LandingNavbar() {
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const navItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Lịch Trình", path: "/schedule" },
    { name: "Tra cứu vé", path: "/client/ticket-lookup" },
    { name: "Về chúng tôi", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <FaBus size={24} color="white" />
          </div>
          <div className={styles.brandName}>
            <span>FUBA</span>
            <span style={{ color: COLORS.primary }}>Bus</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={styles.navLink}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser size={16} />
                <span>{user?.fullName}</span>
              </button>

              {showUserMenu && (
                <div className={styles.dropdown}>
                  <Link href="/profile" className={styles.dropdownItem}>
                    Hồ sơ của tôi
                  </Link>
                  <Link href="/my-bookings" className={styles.dropdownItem}>
                    Vé của tôi
                  </Link>
                  <button
                    onClick={logout}
                    className={styles.dropdownItem}
                    style={{ color: COLORS.error }}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className={styles.loginButton}
              style={{ backgroundColor: COLORS.primary }}
            >
              <BiLogIn size={20} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
