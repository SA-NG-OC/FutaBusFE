"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TripSearch from "@/feature/booking/components/TripSearch/TripSearch";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (params: {
    originId?: number;
    destId?: number;
    date?: string;
  }) => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.originId)
      queryParams.set("originId", params.originId.toString());
    if (params.destId) queryParams.set("destId", params.destId.toString());
    if (params.date) queryParams.set("date", params.date);

    // Navigate to booking page with search params
    router.push(`/client/booking?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to FubaBus
            </h1>
            <p className="text-xl opacity-90">
              Book your bus tickets easily and travel comfortably
            </p>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            <TripSearch onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Quick Links or Features Section (Optional) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book tickets in just a few clicks</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Multiple payment options available
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Book from anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
