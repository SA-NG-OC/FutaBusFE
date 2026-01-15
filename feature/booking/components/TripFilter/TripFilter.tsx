"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa";

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
    []
  );

  // Initialize from URL params
  useEffect(() => {
    const minPriceParam = searchParams?.get("minPrice");
    const maxPriceParam = searchParams?.get("maxPrice");

    setMinPrice(minPriceParam ? parseInt(minPriceParam) : undefined);
    setMaxPrice(maxPriceParam ? parseInt(maxPriceParam) : undefined);
    setSelectedTimeRanges(searchParams?.get("timeRanges")?.split(",") || []);
    setSelectedVehicleTypes(
      searchParams?.get("vehicleTypes")?.split(",") || []
    );
  }, [searchParams]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRanges((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleVehicleTypeChange = (value: string) => {
    setSelectedVehicleTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
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
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xs">
      <div className="flex items-center mb-6">
        <FaFilter className="text-red-500 text-xl" />
        <h2 className="ml-3 text-xl font-bold text-gray-800">Filters</h2>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Price Range</h3>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>

      {/* Departure Time */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Departure Time</h3>
        <div className="space-y-3">
          {timeRangeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTimeRanges.includes(option.value)}
                onChange={() => handleTimeRangeChange(option.value)}
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="ml-3">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-4">Vehicle Type</h3>
        <div className="space-y-3">
          {vehicleTypeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center text-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedVehicleTypes.includes(option.value)}
                onChange={() => handleVehicleTypeChange(option.value)}
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="ml-3">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleApplyFilters}
          className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="w-full py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
