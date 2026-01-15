"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

// Import động MapContent, tắt SSR
const MapContent = dynamic(() => import("./MapContent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[320px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
            Loading Map Data...
        </div>
    ),
});

interface TripMapProps {
    tripId: number;
}

const TripMap = ({ tripId }: TripMapProps) => {
    // State để lưu thông tin hiển thị trên card (Lấy từ API bên trong MapContent bắn ra)
    const [routeInfo, setRouteInfo] = useState({
        origin: "Loading...",
        destination: "Loading...",
        routeName: "Trip Route"
    });

    // Hàm callback nhận dữ liệu từ MapContent
    const handleRouteLoaded = (data: any) => {
        if (data) {
            setRouteInfo({
                origin: data.origin.locationName,
                destination: data.destination.locationName,
                routeName: data.routeName
            });
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-gray-700 font-semibold text-sm">{routeInfo.routeName}</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Live Tracking
                </span>
            </div>

            {/* Container Bản đồ */}
            <div className="relative w-full h-[400px] group">

                {/* Truyền callback handleRouteLoaded xuống */}
                <MapContent tripId={tripId} onRouteInfoLoaded={handleRouteLoaded} />

                {/* --- LỚP PHỦ THÔNG TIN (Overlay Card) --- */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 z-[400]">
                    <div className="flex justify-between items-center">

                        {/* Thông tin Tuyến đường */}
                        <div className="flex items-center gap-3 w-full">
                            <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-red-200 shadow-lg shrink-0">
                                <FaMapMarkerAlt className="text-sm" />
                            </div>
                            <div className="flex-1 min-w-0"> {/* min-w-0 giúp truncate hoạt động */}
                                <p className="text-[10px] text-gray-400 font-semibold uppercase">Current Route</p>
                                <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                                    <span className="truncate max-w-[40%]">{routeInfo.origin}</span>
                                    <span className="text-gray-300 text-xs">➝</span>
                                    <span className="truncate max-w-[40%]">{routeInfo.destination}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TripMap;