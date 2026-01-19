"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Select from "react-select";
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

interface SelectOption {
  value: string;
  label: string;
}

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function TripSearch({ onSearch }: TripSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { locations, fetchLocations } = useRoutes();

  const [originId, setOriginId] = useState<string>(
    searchParams?.get("originId") || "",
  );
  const [destId, setDestId] = useState<string>(
    searchParams?.get("destId") || "",
  );
  // Default date to today if not specified
  const [date, setDate] = useState(searchParams?.get("date") || getTodayDate());
  const [passengers, setPassengers] = useState(1);

  // Convert locations to react-select options
  const locationOptions: SelectOption[] = useMemo(() => {
    return locations.map((location) => ({
      value: String(location.locationId),
      label: location.locationName,
    }));
  }, [locations]);

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Sync with URL params
  useEffect(() => {
    setOriginId(searchParams?.get("originId") || "");
    setDestId(searchParams?.get("destId") || "");
    setDate(searchParams?.get("date") || getTodayDate());
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

  // Custom styles for react-select to match the design
  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "8px",
      borderColor: state.isFocused ? "#D83E3E" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(216, 62, 62, 0.2)" : "none",
      padding: "4px 0",
      minHeight: "44px",
      "&:hover": {
        borderColor: "#D83E3E",
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#D83E3E"
        : state.isFocused
          ? "#fef2f2"
          : "white",
      color: state.isSelected ? "white" : "#1f2937",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#fee2e2",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#1f2937",
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.gridContainer}>
        {/* Origin City Dropdown - Searchable */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaMapMarkerAlt className={styles.icon} />
            Điểm đi
          </label>
          <Select
            instanceId="origin-select"
            options={locationOptions}
            value={
              locationOptions.find((opt) => opt.value === originId) || null
            }
            onChange={(option) => setOriginId(option?.value || "")}
            placeholder="Nhập hoặc chọn điểm đi..."
            isClearable
            isSearchable
            styles={customSelectStyles}
            noOptionsMessage={() => "Không tìm thấy địa điểm"}
            classNamePrefix="react-select"
          />
        </div>

        {/* Destination City Dropdown - Searchable */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FaMapMarkerAlt className={styles.icon} />
            Điểm đến
          </label>
          <Select
            instanceId="dest-select"
            options={locationOptions}
            value={locationOptions.find((opt) => opt.value === destId) || null}
            onChange={(option) => setDestId(option?.value || "")}
            placeholder="Nhập hoặc chọn điểm đến..."
            isClearable
            isSearchable
            styles={customSelectStyles}
            noOptionsMessage={() => "Không tìm thấy địa điểm"}
            classNamePrefix="react-select"
          />
        </div>

        {/* Date Input - Default to today */}
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
            min={getTodayDate()}
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
