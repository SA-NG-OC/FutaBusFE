"use client";
import React, { useState } from "react";
import TicketLookup from "@/feature/ticket/components/TicketLookup";
import TicketResult from "@/feature/ticket/components/TicketResult";

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

// Mock data for demo
const MOCK_TICKET: TicketData = {
  bookingCode: "TK-2024-001234",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  customerEmail: "nguyenvana@example.com",
  fromLocation: "Bến xe Miền Đông (TP. Hồ Chí Minh)",
  toLocation: "Bến xe Đà Lạt",
  departureDate: "20/11/2024",
  departureTime: "06:00",
  seats: ["A1", "A2"],
  totalPrice: 500000,
  status: "CONFIRMED",
  vehicleNumber: "51B-12345",
  driverName: "Trần Văn B",
};

export default function TicketLookupDemoPage() {
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

    // Simulate API call
    setTimeout(() => {
      // Check for demo code
      if (
        searchData.value === "TK-2024-001234" ||
        searchData.value === "0901234567" ||
        searchData.value === "nguyenvana@example.com"
      ) {
        setTicketData(MOCK_TICKET);
      } else {
        setError(
          "Không tìm thấy thông tin vé. Vui lòng kiểm tra lại thông tin đã nhập."
        );
      }
      setLoading(false);
    }, 1500);
  };

  const handleSearchAgain = () => {
    setShowResult(false);
    setTicketData(null);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
        padding: "2rem 0",
      }}
    >
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
