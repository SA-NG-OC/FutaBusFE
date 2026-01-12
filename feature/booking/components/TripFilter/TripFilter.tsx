import React from "react";
import { FaFilter } from "react-icons/fa";

const departureTimes = [
  "Morning (6AM - 12PM)",
  "Afternoon (12PM - 6PM)",
  "Evening (6PM - 12AM)",
  "Night (12AM - 6AM)",
];

const busTypes = ["Seated", "Sleeper", "VIP Sleeper"];

export default function TripFilter() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xs">
      <div className="flex items-center mb-6">
        <FaFilter className="text-red-500 text-xl" />
        <h2 className="ml-3 text-xl font-bold text-gray-800">Filters</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Departure Time</h3>
        <div className="space-y-3">
          {departureTimes.map((time) => (
            <label key={time} className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="ml-3">{time}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-700 mb-4">Bus Type</h3>
        <div className="space-y-3">
          {busTypes.map((type) => (
            <label key={type} className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-400"
              />
              <span className="ml-3">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
        Apply Filters
      </button>
    </div>
  );
}
