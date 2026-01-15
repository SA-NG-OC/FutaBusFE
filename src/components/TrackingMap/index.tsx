"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaRoute } from "react-icons/fa";

// Import động MapContent, tắt SSR
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Loading Map Data...
    </div>
  ),
});

interface TripMapProps {
  tripId: number;
  // Props optional để truyền data ban đầu vào
  routeInfo?: {
    origin: string;
    destination: string;
    startTime: string;
    endTime: string;
  };
}

const TripMap = ({ tripId, routeInfo }: TripMapProps) => {
  // Kết hợp State: Ưu tiên dùng props truyền vào, nếu không có thì dùng state nội bộ
  // (Giữ lại logic của bạn tui để sau này mở rộng update từ API)
  const [displayInfo, setDisplayInfo] = useState({
    origin: routeInfo?.origin || "Loading...",
    destination: routeInfo?.destination || "Loading...",
    startTime: routeInfo?.startTime || "--:--",
    endTime: routeInfo?.endTime || "--:--",
  });

  // Nếu props routeInfo thay đổi, update lại state hiển thị
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

  // Callback nhận data từ MapContent (giữ logic của bạn tui để update real-time nếu có)
  const handleRouteLoaded = (data: any) => {
    // Chỉ update nếu chưa có thông tin từ props (hoặc muốn override)
    if (data && !routeInfo) {
      setDisplayInfo((prev) => ({
        ...prev,
        origin: data.origin?.locationName || prev.origin,
        destination: data.destination?.locationName || prev.destination,
        // Giữ nguyên time hoặc update nếu API có trả về
      }));
    }
  };

  return (
    // [RESOLVED] Dùng layout FULL HEIGHT của bạn (đẹp hơn cho Modal)
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Header nhỏ */}
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-red-50 p-1.5 rounded-md text-red-500">
            <FaRoute />
          </div>
          <h3 className="text-gray-800 font-bold text-sm">Route Tracking</h3>
        </div>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      </div>

      {/* Container Bản đồ: Dùng flex-1 để chiếm hết không gian còn lại */}
      <div className="relative w-full flex-1 group bg-gray-50">
        {/* Bản đồ */}
        {/* Truyền thêm callback handleRouteLoaded để tương thích code bạn tui */}
        <MapContent tripId={tripId} onRouteInfoLoaded={handleRouteLoaded} />

        {/* --- LỚP PHỦ THÔNG TIN (Overlay Card) --- */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-[400] transition-all duration-300 hover:bg-white">
          <div className="flex justify-between items-center">
            {/* Route Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md shrink-0">
                <FaMapMarkerAlt className="text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Route
                </p>
                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm truncate">
                  <span className="truncate">{displayInfo.origin}</span>
                  <span className="text-gray-300 text-xs shrink-0">➝</span>
                  <span className="truncate">{displayInfo.destination}</span>
                </div>
              </div>
            </div>

            {/* Duration Info */}
            <div className="text-right pl-4 border-l border-gray-100 shrink-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Est. Time
              </p>
              <p className="font-bold text-gray-800 text-sm whitespace-nowrap tabular-nums">
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
