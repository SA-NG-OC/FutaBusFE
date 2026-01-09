'use client';

import React from 'react';
import styles from './FeatureCard.module.css';

/**
 * Reusable Feature Card Component
 * Used in WhyChooseUs section
 * 
 * @param icon - Emoji or icon
 * @param title - Feature title
 * @param description - Feature description
 */

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
