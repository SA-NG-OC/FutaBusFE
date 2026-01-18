"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import TicketLookup from "@/feature/ticket/components/TicketLookup";
import TicketDetail from "@/feature/ticket/components/TicketDetail";
import BookingList from "@/feature/ticket/components/BookingList";
import PrintableTicket from "@/feature/ticket/components/PrintableTicket";
import { ticketApi } from "@/feature/ticket/api/ticketApi";
import { BookingListItem, TicketInfo } from "@/feature/ticket/types";
import styles from "./page.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const searchParams = useSearchParams();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketData, setTicketData] = useState<TicketDetailData | null>(null);
  const [bookingList, setBookingList] = useState<BookingListItem[]>([]);
  const [viewState, setViewState] = useState<ViewState>("search");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auto-load ticket when URL has bookingCode parameter
  useEffect(() => {
    const bookingCode = searchParams.get("code");
    if (bookingCode) {
      handleSearchByBookingCode(bookingCode);
    }
  }, [searchParams]);

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
          : "Không thể tra cứu. Vui lòng thử lại sau.",
      );
      setViewState("search");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCode = async (ticketCode: string) => {
    const booking = await ticketApi.getTicketDetailByCode(ticketCode) as BookingListItem;

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
          booking.tripInfo.departureTime,
        ).toLocaleDateString("vi-VN"),
        departureTime: new Date(
          booking.tripInfo.departureTime,
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        duration: `${Math.round(
          (new Date(booking.tripInfo.arrivalTime).getTime() -
            new Date(booking.tripInfo.departureTime).getTime()) /
            (1000 * 60 * 60),
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
          booking.tripInfo.pickupTime || booking.tripInfo.departureTime,
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        dropoffLocation: booking.tripInfo.dropoffLocation || "",
        dropoffTime: new Date(
          booking.tripInfo.dropoffTime || booking.tripInfo.arrivalTime,
        ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setTicketData(mappedData);
      setViewState("ticketDetail");
  };

  // New function to search by booking code (from my-ticket page)
  const handleSearchByBookingCode = async (bookingCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const booking = await ticketApi.getBookingByCode(bookingCode) as BookingListItem;

      // Get the first ticket from the booking
      const firstTicket = booking.tickets[0];

        if (!firstTicket) {
          throw new Error("Không tìm thấy vé trong booking");
        }

        const mappedData: TicketDetailData = {
          bookingCode: booking.bookingCode,
          status: booking.bookingStatus,
          qrCode: firstTicket.ticketCode,
          fromLocation:
            booking.tripInfo.routeName.split("→")[0]?.trim() ||
            booking.tripInfo.pickupLocation ||
            "",
          toLocation:
            booking.tripInfo.routeName.split("→")[1]?.trim() ||
            booking.tripInfo.dropoffLocation ||
            "",
          departureDate: new Date(
            booking.tripInfo.departureTime,
          ).toLocaleDateString("vi-VN"),
          departureTime: new Date(
            booking.tripInfo.departureTime,
          ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          duration: `${Math.round(
            (new Date(booking.tripInfo.arrivalTime).getTime() -
              new Date(booking.tripInfo.departureTime).getTime()) /
              (1000 * 60 * 60),
          )}h`,
          vehicleType: "Limousine",
          licensePlate: booking.tripInfo.vehiclePlate || "N/A",
          driverName: booking.tripInfo.driverName,
          customerName: firstTicket.passenger?.fullName || booking.customerName,
          customerPhone:
            firstTicket.passenger?.phoneNumber || booking.customerPhone,
          customerEmail: firstTicket.passenger?.email || booking.customerEmail,
          customerIdCard: "",
          seatNumber: booking.tickets
            .map((t: TicketInfo) => t.seatNumber)
            .join(", "),
          seatFloor: `Tầng ${firstTicket.floorNumber}`,
          pickupLocation: booking.tripInfo.pickupLocation || "",
          pickupTime: new Date(
            booking.tripInfo.pickupTime || booking.tripInfo.departureTime,
          ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          dropoffLocation: booking.tripInfo.dropoffLocation || "",
          dropoffTime: new Date(
            booking.tripInfo.dropoffTime || booking.tripInfo.arrivalTime,
          ).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };

        setTicketData(mappedData);
        setViewState("ticketDetail");
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tra cứu. Vui lòng thử lại sau.",
      );
      setViewState("search");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByPhone = async (phone: string) => {
    const bookings = await ticketApi.getBookingsByPhone(phone) as BookingListItem[];

    if (bookings && bookings.length > 0) {
      setBookingList(bookings);
      setViewState("bookingList");
    } else {
      setError("Không tìm thấy booking nào với số điện thoại này.");
      setViewState("search");
    }
  };

  const handleSearchByEmail = async (email: string) => {
    const bookings = await ticketApi.getBookingsByEmail(email) as BookingListItem[];

    if (bookings && bookings.length > 0) {
      setBookingList(bookings);
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
        err instanceof Error ? err.message : "Không thể tải thông tin vé.",
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

  const handleDownload = async () => {
    if (!ticketData) {
      alert("Không tìm thấy thông tin vé để tải xuống");
      return;
    }

    setIsDownloading(true);

    try {
      // Create iframe to completely isolate from Tailwind CSS and global styles
      const iframe = document.createElement('iframe');
      iframe.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 800px;
        height: 1px;
        border: none;
      `;
      document.body.appendChild(iframe);

      // Get iframe's document
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe document');

      // Write minimal HTML structure with NO external CSS
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;"></body></html>');
      iframeDoc.close();

      // Inject strict reset CSS into iframe to prevent any Tailwind/variable styles from applying
      const resetStyle = iframeDoc.createElement('style');
      resetStyle.innerHTML = `
        /* Force safe colors and disable complex functions */
        * { color: #000 !important; background: transparent !important; background-color: transparent !important; border-color: #e2e8f0 !important; box-shadow: none !important; }
        body { background: #ffffff !important; color: #000 !important; font-family: Arial, Helvetica, sans-serif !important; }
        .statusBadge, .downloadButton, .backButton { box-shadow: none !important; }
        svg, foreignObject { overflow: visible !important; }
        img { image-rendering: crisp-edges; max-width: 100%; }
      `;
      iframeDoc.head.appendChild(resetStyle);

      // Create container in iframe
      const printContainer = iframeDoc.createElement('div');
      iframeDoc.body.appendChild(printContainer);

      // Render PrintableTicket component to iframe container
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(printContainer);
      
      // Render and wait for it to be ready
      await new Promise<void>((resolve) => {
        root.render(
          <PrintableTicket {...ticketData} />
        );
        // Wait for render to complete
        setTimeout(() => resolve(), 400);
      });

      const ticketElement = printContainer.firstChild as HTMLElement;
      // Ensure element is visible and not clipped
      ticketElement.style.overflow = 'visible';
      // Resize iframe to match rendered content so html2canvas captures full QR
      try {
        const height = ticketElement.scrollHeight || ticketElement.clientHeight || 1000;
        const width = ticketElement.scrollWidth || ticketElement.clientWidth || 800;
        iframe.style.height = `${height + 40}px`;
        iframe.style.width = `${width + 40}px`;
      } catch (e) {
        // ignore
      }
      // allow layout to settle
      await new Promise((r) => setTimeout(r, 200));

      // Create canvas from the ticket element - now completely isolated from main page CSS
      const canvas = await html2canvas(ticketElement, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        scale: 2,
        windowWidth: ticketElement.scrollWidth || 800,
        windowHeight: ticketElement.scrollHeight || 1000,
      });

      // Cleanup
      root.unmount();
      document.body.removeChild(iframe);

      // Calculate dimensions for PDF (A4 size in mm)
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "portrait",
        unit: "mm",
        format: "a4",
      });

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`Ve-Xe-${ticketData.bookingCode}.pdf`);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Không thể tải xuống vé. Vui lòng thử lại sau.");
    } finally {
      setIsDownloading(false);
    }
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
        <div ref={ticketRef}>
          <TicketDetail
            ticket={ticketData}
            onBack={handleSearchAgain}
            onDownload={handleDownload}
          />
          {isDownloading && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid #f3f4f6",
                    borderTopColor: "#D83E3E",
                    borderRadius: "50%",
                    margin: "0 auto 1rem",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <p style={{ color: "#374151", fontWeight: 500 }}>
                  Đang tạo file PDF...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
