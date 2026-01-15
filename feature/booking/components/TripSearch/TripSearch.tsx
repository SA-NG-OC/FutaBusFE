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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg w-full mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Origin City Dropdown */}
        <div className="relative flex items-center">
          <FaMapMarkerAlt className="absolute left-4 text-red-500 z-10" />
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none cursor-pointer"
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
        <div className="relative flex items-center">
          <FaMapMarkerAlt className="absolute left-4 text-red-500 z-10" />
          <select
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none cursor-pointer"
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
        <div className="relative flex items-center">
          <FaCalendarAlt className="absolute left-4 text-red-500 z-10" />
          <input
            type="date"
            placeholder="Ngày đi"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Passengers Input */}
        <div className="relative flex items-center">
          <FaUserFriends className="absolute left-4 text-red-500 z-10" />
          <input
            type="number"
            value={passengers}
            onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
            min={1}
            placeholder="Number of passengers"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center mt-6 space-x-10 w-full">
        <button
          type="submit"
          className="flex items-center w-full justify-center py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
        >
          <FaSearch className="mr-2" />
          Tìm kiếm chuyến xe
        </button>
      </div>
    </form>
  );
}
