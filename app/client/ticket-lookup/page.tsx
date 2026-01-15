"use client";
import React, { useState } from "react";
import TicketLookup from "@/feature/ticket/components/TicketLookup";
import TicketResult from "@/feature/ticket/components/TicketResult";
import { ticketApi } from "@/feature/ticket/api/ticketApi";
import styles from "./page.module.css";

type SearchMethod = "email" | "phone" | "code";

interface TicketData {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  seats: string[];
  totalPrice: number;
  status: string;
  vehicleNumber?: string;
  driverName?: string;
}

export default function TicketLookupPage() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = async (searchData: {
    method: SearchMethod;
    value: string;
  }) => {
    setLoading(true);
    setError(null);
    setShowResult(true);

    try {
      let response;

      if (searchData.method === "code") {
        // Search by booking code
        response = await ticketApi.getBookingByCode(searchData.value);
      } else if (searchData.method === "email") {
        // Search by email
        response = await ticketApi.getBookingByEmail(searchData.value);
      } else if (searchData.method === "phone") {
        // Search by phone
        response = await ticketApi.getBookingByPhone(searchData.value);
      }

      if (response && response.data) {
        // Map API response to TicketData format
        const booking = response.data;
        const mappedData: TicketData = {
          bookingCode: booking.bookingCode || "",
          customerName: booking.customerName || "",
          customerPhone: booking.customerPhone || "",
          customerEmail: booking.customerEmail || "",
          fromLocation: booking.trip?.route?.startLocation || "",
          toLocation: booking.trip?.route?.endLocation || "",
          departureDate: booking.trip?.departureDate
            ? new Date(booking.trip.departureDate).toLocaleDateString("vi-VN")
            : "",
          departureTime: booking.trip?.departureTime || "",
          seats: booking.seats?.map((s: any) => s.seatNumber) || [],
          totalPrice: booking.totalPrice || 0,
          status: booking.status || "PENDING",
          vehicleNumber: booking.trip?.vehicle?.licensePlate || "",
          driverName: booking.trip?.driver?.name || "",
        };

        setTicketData(mappedData);
      } else {
        setError(
          "Không tìm thấy thông tin vé. Vui lòng kiểm tra lại thông tin đã nhập."
        );
      }
    } catch (err: any) {
      console.error("Error searching ticket:", err);
      setError(err.message || "Không thể tra cứu vé. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setShowResult(false);
    setTicketData(null);
    setError(null);
  };

  return (
    <div className={styles.page}>
      {!showResult ? (
        <TicketLookup onSearch={handleSearch} />
      ) : (
        <TicketResult
          ticket={ticketData}
          loading={loading}
          error={error}
          onSearchAgain={handleSearchAgain}
        />
      )}
    </div>
  );
}
