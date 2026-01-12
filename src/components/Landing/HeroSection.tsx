'use client';

import React from 'react';
import { COLORS } from '@/shared/constants/colors';
import styles from './HeroSection.module.css';

/**
 * Hero Section - Main banner with search form
 * TODO: 
 * - Connect to real API for route search
 * - Add date picker functionality
 * - Implement seat selection
 * - Add form validation
 */
export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Content */}
          <div className={styles.textContent}>
            <div className={styles.badge}>
              🎉 Ưu đãi mùa lễ - Giảm đến 20%
            </div>
            
            <h1 className={styles.title}>
              Trải nghiệm đặt vé<br />
              <span style={{ color: COLORS.textWhite }}>XE KHÁCH</span>
            </h1>
            
            <p className={styles.description}>
              Hệ thống đặt vé xe khách trực tuyến hiện đại, tiện lợi. Với hơn 1000+ chuyến xe mỗi ngày, đặt vé nhanh chóng chỉ trong vài phút.
            </p>

            {/* Search Form */}
            <div className={styles.searchForm}>
              <div className={styles.inputGroup}>
                <label>Điểm đi</label>
                <select className={styles.select}>
                  <option>Chọn điểm đi</option>
                  {/* TODO: Load from API */}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Điểm đến</label>
                <select className={styles.select}>
                  <option>Chọn điểm đến</option>
                  {/* TODO: Load from API */}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Ngày đi</label>
                <input type="date" className={styles.input} />
                {/* TODO: Integrate date picker */}
              </div>

              <button 
                className={styles.searchButton}
                style={{ backgroundColor: COLORS.primary }}
              >
                Tìm chuyến xe
              </button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1000+</div>
                <div className={styles.statLabel}>Tuyến đường</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Xe khách</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>2M+</div>
                <div className={styles.statLabel}>Khách hàng</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className={styles.imageContent}>
            <div className={styles.busImage}>
              {/* TODO: Replace with actual bus interior image */}
              <div className={styles.placeholder}>
                🚌 Bus Interior Image
              </div>
              
              {/* Floating Info Card */}
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>✓</div>
                <div>
                  <div className={styles.infoTitle}>Thanh toán sau</div>
                  <div className={styles.infoText}>Đặt vé không cần thanh toán trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Shape Bottom */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f5f5f5"></path>
        </svg>
      </div>
    </section>
  );
}
