"use client";
import React from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaSearch,
} from "react-icons/fa";

export default function TripSearch() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full  mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative flex items-center">
          <FaMapMarkerAlt className="absolute left-4 text-red-500" />
          <input
            type="text"
            placeholder="Điểm đi"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <div className="relative flex items-center">
          <FaMapMarkerAlt className="absolute left-4 text-red-500" />
          <input
            type="text"
            placeholder="Điểm đến"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <div className="relative flex items-center">
          <FaCalendarAlt className="absolute left-4 text-red-500" />
          <input
            type="text"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            placeholder="Ngày đi"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        <div className="relative flex items-center">
          <FaUserFriends className="absolute left-4 text-red-500" />
          <input
            type="number"
            defaultValue={1}
            min={1}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-6 space-x-10 w-full">
        <button className="flex items-center w-full justify-center  py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
          <FaSearch className="mr-2" />
          Tìm kiếm chuyến xe
        </button>
      </div>
    </div>
  );
}
