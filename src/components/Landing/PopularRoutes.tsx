"use client";

import React from "react";
import RouteCard from "./RouteCard";
import styles from "./PopularRoutes.module.css";
import { useRouter } from "next/navigation";

/**
 * Popular Routes Section
 * Displays featured bus routes using reusable RouteCard component
 *
 * TODO:
 * - Fetch routes from API
 * - Add pagination or "View More" button
 * - Implement route filtering
 */

export default function PopularRoutes() {
  const router = useRouter();
  // TODO: Replace with API data
  const routes = [
    {
      title: "Hà Nội - Đà Nẵng",
      duration: "14 giờ",
      departureTime: "18:00 - 04/12/2025",
      price: "450.000đ",
      available: 12,
    },
    {
      title: "TP HCM - Đà Lạt",
      duration: "8 giờ",
      departureTime: "20:00 - 04/12/2025",
      price: "320.000đ",
      available: 8,
    },
    {
      title: "Hà Nội - Đà Nẵng",
      duration: "14 giờ",
      departureTime: "08:00 - 05/12/2025",
      price: "480.000đ",
      available: 15,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>🔥 Tuyến đường hot</span>
          <h2 className={styles.title}>Các tuyến đường được yêu thích</h2>
          <p className={styles.subtitle}>
            Khám phá những tuyến đường phổ biến nhất với nhiều chuyến xe mỗi
            ngày và giá vé tốt nhất
          </p>
        </div>

        <div className={styles.grid}>
          {routes.map((route, index) => (
            <RouteCard key={index} {...route} />
          ))}
        </div>

        <div className={styles.viewMore}>
          <button
            className={styles.viewMoreButton}
            onClick={() => router.push("/client/booking")}
          >
            Xem tất cả tuyến đường →
          </button>
        </div>
      </div>
    </section>
  );
}
