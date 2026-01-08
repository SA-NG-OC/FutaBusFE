"use client";

import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaRoute } from "react-icons/fa"; // Icon map

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
    // Các thông tin hiển thị trên Card (Optional)
    routeInfo?: {
        origin: string;
        destination: string;
        startTime: string;
        endTime: string;
    };
}

const TripMap = ({ tripId, routeInfo }: TripMapProps) => {
    // Dữ liệu giả lập nếu không truyền vào (để test UI)
    const displayInfo = routeInfo || {
        origin: "Ho Chi Minh",
        destination: "Da Lat",
        startTime: "06:00",
        endTime: "12:00"
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header nhỏ nếu cần */}
            <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-gray-700 font-semibold text-sm">Route Map</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Live Tracking
                </span>
            </div>

            {/* Container Bản đồ */}
            <div className="relative w-full h-[320px] group">

                {/* Bản đồ nằm dưới cùng */}
                <MapContent tripId={tripId} />

                {/* --- LỚP PHỦ THÔNG TIN (Overlay Card) --- */}
                {/* absolute bottom-4: Đặt đè lên góc dưới */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 z-[400]">
                    <div className="flex justify-between items-center">

                        {/* Thông tin Tuyến đường */}
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-red-200 shadow-lg shrink-0">
                                <FaMapMarkerAlt className="text-sm" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase">Route</p>
                                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                                    <span className="truncate max-w-[80px]">{displayInfo.origin}</span>
                                    <span className="text-gray-300 text-xs">➝</span>
                                    <span className="truncate max-w-[80px]">{displayInfo.destination}</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin Thời gian */}
                        <div className="text-right pl-4 border-l border-gray-100">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">Duration</p>
                            <p className="font-bold text-gray-800 text-sm whitespace-nowrap">
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