'use client';

import React from 'react';
import FeatureCard from './FeatureCard';
import styles from './WhyChooseUs.module.css';

/**
 * Why Choose Us Section
 * Displays benefits using reusable FeatureCard component
 * 
 * TODO:
 * - Replace placeholder icons with proper icon library
 * - Add animations on scroll
 */

export default function WhyChooseUs() {
  const features = [
    {
      icon: '⚡',
      title: 'Đặt vé nhanh chóng',
      description: 'Chỉ 3 bước đơn giản để hoàn tất đặt vé. Dễ dàng, nhanh chóng chỉ trong vài giây.',
    },
    {
      icon: '🔒',
      title: 'Thanh toán bảo mật',
      description: 'Hệ thống thanh toán được mã hóa SSL. Đảm bảo an toàn cho thông tin của bạn.',
    },
    {
      icon: '🎧',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.',
    },
    {
      icon: '📱',
      title: 'Hủy vé dễ dàng',
      description: 'Chính sách hủy vé linh hoạt, hoàn tiền nhanh chóng trong vòng 24h.',
    },
    {
      icon: '💳',
      title: 'Nhiều hình thức thanh toán',
      description: 'Hỗ trợ đa dạng phương thức thanh toán: Thẻ, ví điện tử, ngân hàng.',
    },
    {
      icon: '⏰',
      title: 'Đúng giờ & đúng lộ trình',
      description: 'Cam kết xuất bến đúng giờ, đi đúng lộ trình đã công bố.',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>⭐ Vì sao chọn chúng tôi</span>
          <h2 className={styles.title}>Lý do bạn nên đặt vé với FubaBus</h2>
          <p className={styles.subtitle}>
            Chúng tôi cam kết mang đến trải nghiệm đặt vé tuyệt vời với nhiều ưu điểm vượt trội
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
