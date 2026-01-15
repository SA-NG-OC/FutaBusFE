"use client";

import dynamic from "next/dynamic";
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
  routeInfo?: {
    origin: string;
    destination: string;
    startTime: string;
    endTime: string;
  };
}

const TripMap = ({ tripId, routeInfo }: TripMapProps) => {
  const displayInfo = routeInfo || {
    origin: "Ho Chi Minh",
    destination: "Da Lat",
    startTime: "06:00",
    endTime: "12:00",
  };

  return (
    // [UPDATE] Class cha: h-full, flex flex-col, bỏ rounded/border để liền mạch với modal
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

      {/* [UPDATE] Container Map: flex-1 để chiếm hết không gian còn lại */}
      <div className="relative w-full flex-1 group bg-gray-50">
        {/* Bản đồ */}
        <MapContent tripId={tripId} />

        {/* --- LỚP PHỦ THÔNG TIN (Overlay Card) --- */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 z-[400] transition-all duration-300 hover:bg-white">
          <div className="flex justify-between items-center">
            {/* Route */}
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

            {/* Duration */}
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
