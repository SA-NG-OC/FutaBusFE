"use client";
import Container from "@/src/components/ClientContainer/ClientContainer";
import PassengerForm from "@/feature/booking/components/PassengerForm/PassengerForm";
import PaymentMethod from "@/feature/booking/components/PaymentMethod/PaymentMethod";
import BookingSummary from "@/feature/booking/components/BookingSummary/BookingSummary";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import type { PassengerData } from "@/feature/booking/components/PassengerForm/PassengerForm";

export default function ClientBookingCheckoutPage() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [passengerData, setPassengerData] = useState<PassengerData | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const seatsParam = searchParams?.get("seats") ?? "";
  const seats = seatsParam ? seatsParam.split(",") : [];

  useEffect(() => {
    if (seats.length === 0) {
      router.push("/client/booking-4");
    }
  }, [seats.length, router]);

  const handleFormChange = (isValid: boolean, data: PassengerData) => {
    setIsFormValid(isValid);
    setPassengerData(data);
  };

  const handleConfirmPayment = async () => {
    if (!isFormValid || !passengerData) {
      alert("Please fill in all required information");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to result page
      const status = Math.random() > 0.2 ? "success" : "fail";
      router.push(`/client/booking-6?status=${status}`);
    }, 2000);
  };

  // Check if showing result page
  const status = searchParams?.get("status");
  if (status) {
    // Return existing result page logic
    return (
      <Container>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            {status === "success" ? (
              <>
                <div style={{ fontSize: 64 }}>✅</div>
                <h2>Booking Successful!</h2>
                <p>Reference: BT-70981 954</p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 64 }}>❌</div>
                <h2>Booking Failed</h2>
                <p>Reference: ERR-402</p>
              </>
            )}
          </div>
        </div>
      </Container>
    );
  }

  if (isProcessing) {
    return (
      <Container>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 50 50" aria-hidden>
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="#e14b45"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <div style={{ color: "#6b7280" }}>
              Processing payment, please wait...
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.backButton}>
        <button onClick={() => router.back()}>← Back</button>
      </div>

      <div className={styles.container}>
        <div className={styles.leftSection}>
          <PassengerForm onFormChange={handleFormChange} />
          <PaymentMethod onMethodChange={setPaymentMethod} />
        </div>

        <div className={styles.rightSection}>
          <BookingSummary seats={seats} />
          <button
            className={styles.confirmButton}
            onClick={handleConfirmPayment}
            disabled={!isFormValid}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </Container>
  );
}
