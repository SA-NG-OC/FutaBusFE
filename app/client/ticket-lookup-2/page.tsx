"use client";
import React, { useState } from "react";
import TicketLookup from "@/feature/ticket/components/TicketLookup";
import TicketDetail from "@/feature/ticket/components/TicketDetail";

type SearchMethod = "email" | "phone" | "code";

interface TicketDetailData {
  bookingCode: string;
  status: string;
  qrCode?: string;
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  departureTime: string;
  duration: string;
  vehicleType: string;
  licensePlate: string;
  driverName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerIdCard?: string;
  seatNumber: string;
  seatFloor: string;
  pickupLocation: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffTime: string;
}

// Mock data for demo
const MOCK_TICKET: TicketDetailData = {
  bookingCode: "TK-2024-001234",
  status: "CONFIRMED",
  qrCode: "TK-2024-001234",
  fromLocation: "Ho Chi Minh",
  toLocation: "Da Lat",
  departureDate: "25/11/2024",
  departureTime: "06:00 - 12:30",
  duration: "6h 30m",
  vehicleType: "Limousine 24 seats",
  licensePlate: "VH-045",
  driverName: "Nguyễn Văn An",
  customerName: "Trần Văn A",
  customerPhone: "+84 123 456 789",
  customerEmail: "tran.van.a@email.com",
  customerIdCard: "079123456789",
  seatNumber: "A3",
  seatFloor: "Upper deck - Window",
  pickupLocation: "Bến xe Miền Đông, TP.HCM",
  pickupTime: "05:45",
  dropoffLocation: "Bến xe Đà Lạt",
  dropoffTime: "12:30",
};

export default function TicketLookupDemoPage() {
  const [ticketData, setTicketData] = useState<TicketDetailData | null>(null);
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

  const handleDownload = () => {
    alert("Tải xuống vé (chức năng đang phát triển)");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, var(--bg-secondary) 0%, var(--background) 100%)",
        padding: "2rem 0",
      }}
    >
      {!showResult ? (
        <TicketLookup onSearch={handleSearch} />
      ) : loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--background-paper)",
            borderRadius: "12px",
            maxWidth: "700px",
            margin: "0 auto",
            boxShadow: "var(--modal-shadow)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid var(--border-gray)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p style={{ color: "var(--text-secondary)" }}>
            Đang tra cứu thông tin vé...
          </p>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--background-paper)",
            borderRadius: "12px",
            maxWidth: "700px",
            margin: "0 auto",
            boxShadow: "var(--modal-shadow)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "var(--warning-bg)",
              color: "var(--warning-text)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1rem",
            }}
          >
            ✕
          </div>
          <h3 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Không tìm thấy vé
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
            {error}
          </p>
          <button
            onClick={handleSearchAgain}
            style={{
              background: "var(--primary)",
              color: "var(--text-white)",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Tra cứu lại
          </button>
        </div>
      ) : ticketData ? (
        <TicketDetail
          ticket={ticketData}
          onBack={handleSearchAgain}
          onDownload={handleDownload}
        />
      ) : null}
    </div>
  );
}
