import React from "react";
import { TripData } from "@/feature/trip/types";

type TripCardProps = {
  tripDetail?: TripData;
  handleSelectSeat: (tripId: number) => void;
};

export default function TripCard({
  tripDetail,
  handleSelectSeat,
}: TripCardProps) {
  if (!tripDetail) {
    return <div>Loading trip...</div>; // Or a proper skeleton loader
  }

  // Split routeName into departure and arrival cities
  const [departureCity, arrivalCity] = tripDetail.routeName.split(" -> ");

  // Calculate duration from departure and arrival times
  const calculateDuration = (departure: string, arrival: string): string => {
    try {
      // Parse times in format "HH:mm"
      const [depHour, depMin] = departure.split(":").map(Number);
      const [arrHour, arrMin] = arrival.split(":").map(Number);

      let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin);

      // Handle case where arrival is next day
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (minutes === 0) {
        return `${hours} giờ`;
      }
      return `${hours} giờ ${minutes} phút`;
    } catch {
      return "0h";
    }
  };

  const duration = calculateDuration(
    tripDetail.departureTime,
    tripDetail.arrivalTime
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Left Section */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FFF0EF] p-3 rounded-lg text-[#D83E3E] text-2xl">
            🚌
          </div>
          <div>
            <p className="font-bold text-gray-800">{tripDetail.routeName}</p>
            <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-md">
              {tripDetail.vehicleInfo}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-end justify-between gap-4">
          {/* Departure */}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
              <span className="text-red-500">🕒</span>{" "}
              {tripDetail.departureTime}
            </p>
            <p className="text-sm text-gray-600">{departureCity}</p>
          </div>

          {/* Duration */}
          <div className="text-center hidden md:block">
            <p className="text-sm text-gray-500">Duration</p>
            <div className="flex items-center gap-2">
              <div className="grow border-t border-gray-300"></div>
              <p className="text-sm text-gray-600">{duration}</p>
              <div className="grow border-t border-gray-300"></div>
            </div>
          </div>

          {/* Arrival */}
          <div className="space-y-1 text-left">
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
              {tripDetail.arrivalTime} <span className="text-red-500">📍</span>
            </p>
            <p className="text-sm text-gray-600">{arrivalCity}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>👥</span>
          {tripDetail.totalSeats} seats available
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end justify-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-6">
        <div className="text-2xl font-bold text-[#D83E3E] text-right">
          {tripDetail.price.toLocaleString("vi-VN")}đ
        </div>
        <button
          onClick={() => handleSelectSeat(tripDetail.tripId)}
          className="bg-[#D83E3E] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#B93434] transition-colors w-full"
        >
          Select Seats
        </button>
      </div>
    </div>
  );
}
