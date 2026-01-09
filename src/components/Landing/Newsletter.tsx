'use client';

import React from 'react';
import { COLORS } from '@/shared/constants/colors';
import styles from './Newsletter.module.css';

/**
 * Newsletter Subscription Section
 * 
 * TODO:
 * - Connect to email subscription API
 * - Add email validation
 * - Show success/error messages
 */

export default function Newsletter() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.badge}>📧 Nhận thông tin mới nhất</span>
            <h2 className={styles.title}>
              Nhận ưu đãi đặc biệt &<br />
              tin tức mới nhất
            </h2>
            <p className={styles.description}>
              Đăng ký nhận bản tin để không bỏ lỡ các ưu đãi hấp dẫn, chương trình khuyến mãi và thông tin về các tuyến đường mới.
            </p>

            <div className={styles.form}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className={styles.input}
              />
              <button 
                className={styles.button}
                style={{ backgroundColor: COLORS.primaryDark }}
              >
                Đăng ký
              </button>
            </div>

            <p className={styles.note}>
              Hơn 50.000+ người đã đăng ký nhận bản tin từ chúng tôi. Không spam, chỉ những thông tin hữu ích!
            </p>
          </div>

          <div className={styles.imageContent}>
            <div className={styles.placeholder}>
              🎁 Newsletter Image
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
