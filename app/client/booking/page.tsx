"use client";
import TripCard from "@/feature/booking/components/TripCard/TripCard";
import TripFilter from "@/feature/booking/components/TripFilter/TripFilter";
import TripSearch from "@/feature/booking/components/TripSearch/TripSearch";
import TripSort from "@/feature/booking/components/TripSort/TripSort";
import styles from "./page.module.css";
import React, { useState } from "react";

export default function ClientBookingPage() {
  const [sort, setSort] = useState("recommended");

  const handleSortChange = (value: string) => {
    setSort(value);
    console.log("Sort:", value);
    // xuli
  };

  return (
    <div className={styles.main}>
      <TripSearch />
      <div className={styles.content}>
        <div className={styles.filter}>
          <TripFilter />
        </div>
        <div>
          <div className={styles.mainHeader}>
            <div>4 Trip Found</div>
            <TripSort value={sort} onSortChange={handleSortChange} />
          </div>
          <div className={styles.list}>
            <TripCard />
          </div>
        </div>
      </div>
    </div>
  );
}
