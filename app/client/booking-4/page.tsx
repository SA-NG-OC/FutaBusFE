"use client";
import Container from "@/src/components/ClientContainer/ClientContainer";
import SeatMap from "@/feature/booking/components/SeatMap/SeatMap";
import TripDetailsSummary from "@/feature/booking/components/TripDetailsSummary/TripDetailsSummary";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function ClientBookingDetailPage() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const router = useRouter();
  const pricePerSeat = 250000;

  // Example: You can change these props to test different bus types
  const busType: "single" | "double" = "double"; // Change to "single" for single-floor bus
  const lowerFloorSeats = 20; // Change to 30 for 30-seat bus, 16 for 16-seat, etc.
  const upperFloorSeats = 20;

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    // Navigate to checkout page with selected seats
    router.push(`/client/booking-6?seats=${selectedSeats.join(",")}`);
  };

  const total = selectedSeats.length * pricePerSeat;
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <Container>
      <div className={styles.backButton}>
        <button onClick={() => router.back()}>← Back to Results</button>
      </div>

      <div className={styles.mainContent}>
        <SeatMap
          onSeatsChange={setSelectedSeats}
          busType={busType}
          lowerFloorSeats={lowerFloorSeats}
          upperFloorSeats={upperFloorSeats}
        />
        <TripDetailsSummary selectedSeats={selectedSeats} />
      </div>

      <button
        className={styles.continueButton}
        onClick={handleContinue}
        disabled={selectedSeats.length === 0}
      >
        Continue to Checkout
      </button>

      {selectedSeats.length > 0 && (
        <div className={styles.totalFloating}>
          <div className={styles.totalContent}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>{formatCurrency(total)}₫</span>
          </div>
        </div>
      )}
    </Container>
  );
}
