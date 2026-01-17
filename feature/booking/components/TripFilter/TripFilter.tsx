"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa";
import styles from "./TripFilter.module.css";

interface TripFilterProps {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    timeRanges?: string[];
    vehicleTypes?: string[];
  }) => void;
}

const timeRangeOptions = [
  { label: "Morning (6AM - 12PM)", value: "Morning" },
  { label: "Afternoon (12PM - 6PM)", value: "Afternoon" },
  { label: "Evening (6PM - 12AM)", value: "Evening" },
  { label: "Night (12AM - 6AM)", value: "Night" },
];

//call API hoặc mock data
const vehicleTypeOptions = [
  { label: "Limousine", value: "Limousine" },
  { label: "Giường nằm", value: "Giường nằm" },
  { label: "Ghế ngồi", value: "Ghế ngồi" },
  { label: "Limousine 34 Phòng", value: "Limousine 34 Phòng" },
];

export default function TripFilter({ onFilterChange }: TripFilterProps) {
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>(
    [],
  );

  // Initialize from URL params
  useEffect(() => {
    const minPriceParam = searchParams?.get("minPrice");
    const maxPriceParam = searchParams?.get("maxPrice");

    setMinPrice(minPriceParam ? parseInt(minPriceParam) : undefined);
    setMaxPrice(maxPriceParam ? parseInt(maxPriceParam) : undefined);
    setSelectedTimeRanges(searchParams?.get("timeRanges")?.split(",") || []);
    setSelectedVehicleTypes(
      searchParams?.get("vehicleTypes")?.split(",") || [],
    );
  }, [searchParams]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRanges((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleVehicleTypeChange = (value: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      minPrice: minPrice,
      maxPrice: maxPrice,
      timeRanges:
        selectedTimeRanges.length > 0 ? selectedTimeRanges : undefined,
      vehicleTypes:
        selectedVehicleTypes.length > 0 ? selectedVehicleTypes : undefined,
    });
  };

  const handleClearFilters = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedTimeRanges([]);
    setSelectedVehicleTypes([]);
    onFilterChange({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaFilter className={styles.filterIcon} />
        <h2 className={styles.title}>Filters</h2>
      </div>

      {/* Price Range */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Price Range</h3>
        <div className={styles.inputContainer}>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className={styles.input}
          />
        </div>
      </div>

      {/* Departure Time */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Departure Time</h3>
        <div className={styles.checkboxContainer}>
          {timeRangeOptions.map((option) => (
            <label key={option.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedTimeRanges.includes(option.value)}
                onChange={() => handleTimeRangeChange(option.value)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vehicle Type */}
      <div className={styles.sectionLarge}>
        <h3 className={styles.sectionTitle}>Vehicle Type</h3>
        <div className={styles.checkboxContainer}>
          {vehicleTypeOptions.map((option) => (
            <label key={option.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedVehicleTypes.includes(option.value)}
                onChange={() => handleVehicleTypeChange(option.value)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonContainer}>
        <button onClick={handleApplyFilters} className={styles.applyButton}>
          Apply Filters
        </button>
        <button onClick={handleClearFilters} className={styles.clearButton}>
          Clear All
        </button>
      </div>
    </div>
  );
}
