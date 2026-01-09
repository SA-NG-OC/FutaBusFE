'use client';

import React from 'react';
import { COLORS } from '@/shared/constants/colors';
import styles from './RouteCard.module.css';

/**
 * Reusable Route Card Component
 * Used in PopularRoutes section
 * 
 * @param image - Route image URL
 * @param title - Route name (e.g., "Hà Nội - Đà Nẵng")
 * @param duration - Trip duration
 * @param departureTime - Departure time
 * @param price - Ticket price
 * @param available - Number of available seats
 */

interface RouteCardProps {
  image?: string;
  title: string;
  duration: string;
  departureTime: string;
  price: string;
  available: number;
}

export default function RouteCard({
  image,
  title,
  duration,
  departureTime,
  price,
  available,
}: RouteCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            🏙️ {title}
          </div>
        )}
        <div className={styles.badge} style={{ backgroundColor: COLORS.primary }}>
          Phổ biến
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Thời gian:</span>
            <span className={styles.value}>{duration}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Khởi hành:</span>
            <span className={styles.value}>{departureTime}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.label}>Còn trống:</span>
            <span className={styles.value}>{available} chỗ</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.price} style={{ color: COLORS.primary }}>
            {price}
          </div>
          <button 
            className={styles.bookButton}
            style={{ backgroundColor: COLORS.primary }}
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}
