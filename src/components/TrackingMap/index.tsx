"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaRoute } from "react-icons/fa";

// Import động MapContent, tắt SSR
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    // [EDIT] Dùng var(--bg-secondary) và var(--text-secondary)
    <div className="w-full h-full bg-[var(--bg-secondary)] animate-pulse flex items-center justify-center text-[var(--text-secondary)] text-sm">
      Loading Map Data...
    </div>
  ),
});

interface TripMapProps {
  tripId: number;
  routeInfo?: {
    origin: string;
    destination: string;
    startTime: string;
    endTime: string;
  };
}

const TripMap = ({ tripId, routeInfo }: TripMapProps) => {
  const [displayInfo, setDisplayInfo] = useState({
    origin: routeInfo?.origin || "Loading...",
    destination: routeInfo?.destination || "Loading...",
    startTime: routeInfo?.startTime || "--:--",
    endTime: routeInfo?.endTime || "--:--",
  });

  useEffect(() => {
    if (routeInfo) {
      setDisplayInfo({
        origin: routeInfo.origin,
        destination: routeInfo.destination,
        startTime: routeInfo.startTime,
        endTime: routeInfo.endTime,
      });
    }
  }, [routeInfo]);

  const handleRouteLoaded = (data: any) => {
    if (data && !routeInfo) {
      setDisplayInfo((prev) => ({
        ...prev,
        origin: data.origin?.locationName || prev.origin,
        destination: data.destination?.locationName || prev.destination,
      }));
    }
  };

  return (
    // [EDIT] Outer container giữ var(--primary)
    <div className="w-full h-full bg-[var(--primary)] flex flex-col overflow-hidden">

      {/* --- Header --- */}
      {/* [EDIT] Background: var(--background-paper), Border: var(--border-gray) */}
      <div className="px-4 py-3 border-b border-[var(--border-gray)] flex justify-between items-center bg-[var(--background-paper)] z-10 shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-2">
          {/* [EDIT] Icon Box: Dùng var(--primary) với opacity thấp để tạo nền nhạt, text chính var(--primary) */}
          <div className="bg-[var(--primary)]/10 p-1.5 rounded-md text-[var(--primary)]">
            <FaRoute />
          </div>
          {/* [EDIT] Title: var(--text-primary) */}
          <h3 className="text-[var(--text-primary)] font-bold text-sm">Route Tracking</h3>
        </div>

        {/* [EDIT] Badge Live: Dùng var(--badge-running-*) từ file CSS */}
        <span className="text-[10px] bg-[var(--badge-running-bg)] text-[var(--badge-running-text)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
          {/* [EDIT] Dot: Dùng currentColor hoặc var(--badge-running-text) */}
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
          Live
        </span>
      </div>

      {/* --- Map Container --- */}
      {/* [EDIT] Background: var(--bg-secondary) */}
      <div className="relative w-full flex-1 group bg-[var(--bg-secondary)]">
        <MapContent tripId={tripId} onRouteInfoLoaded={handleRouteLoaded} />

        {/* --- LỚP PHỦ THÔNG TIN (Overlay Card) --- */}
        {/* [EDIT] 
            - Bg: var(--background-paper) (Đảm bảo dark mode nền tối)
            - Border: var(--border-gray) 
            - Shadow giữ nguyên
        */}
        <div className="absolute bottom-4 left-4 right-4 bg-[var(--background-paper)]/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-[var(--border-gray)] z-[400] transition-all duration-300">
          <div className="flex justify-between items-center">

            {/* Route Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              {/* [EDIT] Gradient: Dùng var(--primary) -> var(--primary-active) */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-active)] w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md shrink-0">
                <FaMapMarkerAlt className="text-sm" />
              </div>

              <div className="min-w-0">
                {/* [EDIT] Label: var(--text-secondary) */}
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                  Route
                </p>
                {/* [EDIT] Main Text: var(--text-primary) */}
                <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-sm truncate">
                  <span className="truncate">{displayInfo.origin}</span>
                  {/* [EDIT] Arrow: var(--text-secondary) */}
                  <span className="text-[var(--text-secondary)] text-xs shrink-0">➝</span>
                  <span className="truncate">{displayInfo.destination}</span>
                </div>
              </div>
            </div>

            {/* Duration Info */}
            {/* [EDIT] Border divider: var(--border-gray) */}
            <div className="text-right pl-4 border-l border-[var(--border-gray)] shrink-0">
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                Est. Time
              </p>
              <p className="font-bold text-[var(--text-primary)] text-sm whitespace-nowrap tabular-nums">
                {displayInfo.startTime} - {displayInfo.endTime}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TripMap;