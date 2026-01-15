"use client";
import React, { useState } from "react";
import TicketLookup from "@/feature/ticket/components/TicketLookup";
import TicketDetail from "@/feature/ticket/components/TicketDetail";
import BookingList from "@/feature/ticket/components/BookingList";
import { ticketApi } from "@/feature/ticket/api/ticketApi";
import { BookingListItem } from "@/feature/ticket/types";
import styles from "./page.module.css";

type SearchMethod = "email" | "phone" | "code";
type ViewState = "search" | "bookingList" | "ticketDetail";

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

export default function TicketLookupPage() {
  const [ticketData, setTicketData] = useState<TicketDetailData | null>(null);
  const [bookingList, setBookingList] = useState<BookingListItem[]>([]);
  const [viewState, setViewState] = useState<ViewState>("search");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchData: {
    method: SearchMethod;
    value: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (searchData.method === "code") {
        // Search by ticket code
        await handleSearchByCode(searchData.value);
      } else if (searchData.method === "phone") {
        // Search by phone
        await handleSearchByPhone(searchData.value);
      } else if (searchData.method === "email") {
        // Search by email
        await handleSearchByEmail(searchData.value);
      }
    } catch (err) {
      console.error("Error searching:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tra cứu. Vui lòng thử lại sau."
      );
      setViewState("search");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCode = async (ticketCode: string) => {
    const response = await ticketApi.getTicketDetailByCode(ticketCode);

    if (response && response.success && response.data) {
      const booking = response.data;

      // Find the ticket with matching ticketCode
      const ticket = booking.tickets.find((t) => t.ticketCode === ticketCode);

      if (!ticket) {
        throw new Error("Không tìm thấy vé trong booking");
      }

      const mappedData: TicketDetailData = {
        bookingCode: booking.bookingCode,
        status: booking.bookingStatus,
        qrCode: ticket.ticketCode,
        fromLocation:
          booking.tripInfo.routeName.split("→")[0]?.trim() ||
          booking.tripInfo.pickupLocation ||
          "",
        toLocation:
          booking.tripInfo.routeName.split("→")[1]?.trim() ||
          booking.tripInfo.dropoffLocation ||
          "",
        departureDate: new Date(
          booking.tripInfo.departureTime
        ).toLocaleDateString("vi-VN"),
        departureTime: new Date(
          booking.tripInfo.departureTime
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        duration: `${Math.round(
          (new Date(booking.tripInfo.arrivalTime).getTime() -
            new Date(booking.tripInfo.departureTime).getTime()) /
            (1000 * 60 * 60)
        )}h`,
        vehicleType: "Limousine",
        licensePlate: booking.tripInfo.vehiclePlate || "N/A",
        driverName: booking.tripInfo.driverName,
        customerName: ticket.passenger?.fullName || booking.customerName,
        customerPhone: ticket.passenger?.phoneNumber || booking.customerPhone,
        customerEmail: ticket.passenger?.email || booking.customerEmail,
        customerIdCard: "",
        seatNumber: ticket.seatNumber,
        seatFloor: `Tầng ${ticket.floorNumber}`,
        pickupLocation: booking.tripInfo.pickupLocation || "",
        pickupTime: new Date(
          booking.tripInfo.pickupTime || booking.tripInfo.departureTime
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        dropoffLocation: booking.tripInfo.dropoffLocation || "",
        dropoffTime: new Date(
          booking.tripInfo.dropoffTime || booking.tripInfo.arrivalTime
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setTicketData(mappedData);
      setViewState("ticketDetail");
    } else {
      setError("Không tìm thấy thông tin vé. Vui lòng kiểm tra lại mã vé.");
      setViewState("search");
    }
  };

  const handleSearchByPhone = async (phone: string) => {
    const response = await ticketApi.getBookingsByPhone(phone);

    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      setBookingList(response.data);
      setViewState("bookingList");
    } else {
      setError("Không tìm thấy booking nào với số điện thoại này.");
      setViewState("search");
    }
  };

  const handleSearchByEmail = async (email: string) => {
    const response = await ticketApi.getBookingsByEmail(email);

    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      setBookingList(response.data);
      setViewState("bookingList");
    } else {
      setError("Không tìm thấy booking nào với email này.");
      setViewState("search");
    }
  };

  const handleSelectTicket = async (ticketCode: string) => {
    // When user selects a ticket from the booking list, search by that ticket code
    setLoading(true);
    try {
      await handleSearchByCode(ticketCode);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải thông tin vé."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setViewState("search");
    setTicketData(null);
    setBookingList([]);
    setError(null);
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    alert("Tải xuống vé (chức năng đang phát triển)");
  };

  return (
    <div className={styles.page}>
      {viewState === "search" && (
        <>
          <TicketLookup onSearch={handleSearch} />
          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--background-paper)",
                borderRadius: "12px",
                maxWidth: "700px",
                margin: "2rem auto 0",
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
              <h3
                style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}
              >
                Không tìm thấy
              </h3>
              <p style={{ color: "var(--text-secondary)" }}>{error}</p>
            </div>
          )}
        </>
      )}

      {loading && (
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
            Đang tra cứu thông tin...
          </p>
        </div>
      )}

      {viewState === "bookingList" && !loading && (
        <BookingList
          bookings={bookingList}
          onSelectTicket={handleSelectTicket}
          onBack={handleSearchAgain}
        />
      )}

      {viewState === "ticketDetail" && !loading && ticketData && (
        <TicketDetail
          ticket={ticketData}
          onBack={handleSearchAgain}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
