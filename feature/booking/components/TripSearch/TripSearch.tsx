"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaSearch,
} from "react-icons/fa";
import { useRoutes } from "@/feature/route/hooks/useRoutes";
import styles from "./TripSearch.module.css";

interface TripSearchProps {
  onSearch: (params: {
    originId?: number;
    destId?: number;
    date?: string;
  }) => void;
}

export default function TripSearch({ onSearch }: TripSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { locations, fetchLocations } = useRoutes();

  const [originId, setOriginId] = useState<string>(
    searchParams?.get("originId") || ""
  );
  const [destId, setDestId] = useState<string>(
    searchParams?.get("destId") || ""
  );
  const [date, setDate] = useState(searchParams?.get("date") || "");
  const [passengers, setPassengers] = useState(1);

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Sync with URL params
  useEffect(() => {
    setOriginId(searchParams?.get("originId") || "");
    setDestId(searchParams?.get("destId") || "");
    setDate(searchParams?.get("date") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = {
      originId: originId ? parseInt(originId) : undefined,
      destId: destId ? parseInt(destId) : undefined,
      date: date || undefined,
    };

    // Check if we're on home page or any page NOT booking page
    const isHomePage =
      pathname === "/" || pathname === "/client" || pathname === "/client/home";

    if (isHomePage) {
      // Navigate to booking page with params
      const queryParams = new URLSearchParams();
      if (params.originId)
        queryParams.set("originId", params.originId.toString());
      if (params.destId) queryParams.set("destId", params.destId.toString());
      if (params.date) queryParams.set("date", params.date);

      router.push(`/client/booking?${queryParams.toString()}`);
    } else {
      // Already on booking page, just update search
      onSearch(params);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.gridContainer}>
        {/* Origin City Dropdown */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaMapMarkerAlt className={styles.icon} />
            Điểm đi
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Select Origin</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
        </div>

        {/* Destination City Dropdown */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaMapMarkerAlt className={styles.icon} />
            Điểm đến
          </label>
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">Select Destination</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaCalendarAlt className={styles.icon} />
            Ngày đi
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* Passengers Input */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaUserFriends className={styles.icon} />
            Số hành khách
          </label>
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
            min={1}
            max={10}
            className={styles.input}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.searchButton}>
        <FaSearch className={styles.buttonIcon} />
        Tìm kiếm chuyến xe
      </button>
    </form>
  );
}
