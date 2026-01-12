'use client';

import React from 'react';
import Link from 'next/link';
import { COLORS } from '@/shared/constants/colors';
import { FaBus, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

/**
 * Footer Component
 * Reusable footer for all pages
 * 
 * TODO:
 * - Add actual social media links
 * - Connect newsletter form
 * - Add sitemap links
 */

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.column}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <FaBus size={24} color="white" />
              </div>
              <div className={styles.brandName}>
                <span>FUBA</span>
                <span style={{ color: COLORS.primary }}>Bus</span>
              </div>
            </Link>
            <p className={styles.description}>
              Hệ thống đặt vé xe khách uy tín hàng đầu Việt Nam với hơn 1000+ tuyến đường
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}><FaFacebook /></a>
              <a href="#" className={styles.socialLink}><FaTwitter /></a>
              <a href="#" className={styles.socialLink}><FaInstagram /></a>
              <a href="#" className={styles.socialLink}><FaYoutube /></a>
            </div>
          </div>

          {/* Links Section 1 */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Liên kết nhanh</h3>
            <ul className={styles.linkList}>
              <li><Link href="/about">Về chúng tôi</Link></li>
              <li><Link href="/routes">Tuyến đường</Link></li>
              <li><Link href="/booking">Đặt vé</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Hỗ trợ</h3>
            <ul className={styles.linkList}>
              <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link href="/policy">Chính sách đặt vé</Link></li>
              <li><Link href="/terms">Điều khoản sử dụng</Link></li>
              <li><Link href="/privacy">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Liên hệ</h3>
            <ul className={styles.contactList}>
              <li>📞 1900 6067</li>
              <li>📧 support@fubabus.vn</li>
              <li>📍 Khu phố 6, Linh Trung, Thủ Đức, TP.HCM</li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={styles.payment}>
          <p>Phương thức thanh toán:</p>
          <div className={styles.paymentMethods}>
            <div className={styles.paymentMethod}>Visa</div>
            <div className={styles.paymentMethod}>MasterCard</div>
            <div className={styles.paymentMethod}>Momo</div>
            <div className={styles.paymentMethod}>ZaloPay</div>
            <div className={styles.paymentMethod}>VNPay</div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          © 2025 FUBABus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
