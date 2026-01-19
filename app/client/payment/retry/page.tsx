"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/src/components/ClientContainer/ClientContainer";
import {
  paymentApi,
  BookingDetailResponse,
} from "@/feature/booking/api/paymentApi";
import styles from "./page.module.css";

function RetryPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch booking info
  useEffect(() => {
    const fetchBooking = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        const bookingData = await paymentApi.getBookingByCode(orderId);

        // Check if booking is still pending
        if (
          bookingData.bookingStatus !== "Pending" &&
          bookingData.bookingStatus !== "Held"
        ) {
          setError("Đơn hàng này không còn khả dụng để thanh toán");
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // Set initial timer from remainingSeconds
        if (bookingData.remainingSeconds > 0) {
          const minutes = Math.floor(bookingData.remainingSeconds / 60);
          const seconds = bookingData.remainingSeconds % 60;
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        } else {
          setIsExpired(true);
          setTimeRemaining("Đã hết hạn");
        }
      } catch (err) {
        console.error("Fetch booking error:", err);
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!booking?.holdExpiry) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(booking.holdExpiry).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining("Đã hết hạn");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [booking?.holdExpiry]);

  const handleRetryPayment = async () => {
    if (!booking || isExpired) return;

    setIsProcessing(true);
    try {
      // Create MoMo payment using booking code
      const paymentResponse = await paymentApi.createMomoPaymentByCode(
        booking.bookingCode,
      );

      console.log("MoMo payment created:", paymentResponse);

      // Redirect to MoMo payment page
      if (paymentResponse.payUrl) {
        window.location.href = paymentResponse.payUrl;
      } else if (paymentResponse.deeplink) {
        window.location.href = paymentResponse.deeplink;
      } else {
        throw new Error("Không nhận được URL thanh toán từ MoMo");
      }
    } catch (err) {
      console.error("Retry payment error:", err);
      alert("Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN");

  if (loading) {
    return (
      <Container>
        <div className={styles.container}>
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <h1 className={styles.errorTitle}>Không thể tải đơn hàng</h1>
            <p className={styles.errorMessage}>{error || "Đã có lỗi xảy ra"}</p>
            <div className={styles.actions}>
              <button
                className={styles.secondaryButton}
                onClick={() => router.push("/client/booking")}
              >
                Đặt vé mới
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => router.push("/client/home")}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.bookingCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Đơn hàng chờ thanh toán</h1>
            <div
              className={
                isExpired ? styles.statusExpired : styles.statusPending
              }
            >
              {isExpired ? "Đã hết hạn" : "Chờ thanh toán"}
            </div>
          </div>

          <div className={styles.bookingInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Mã đơn hàng:</span>
              <span className={styles.value}>{booking.bookingCode}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Tuyến:</span>
              <span className={styles.value}>{booking.tripInfo.routeName}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Ghế:</span>
              <span className={styles.value}>
                {booking.tickets?.map((t) => t.seatNumber).join(", ") || "N/A"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Khách hàng:</span>
              <span className={styles.value}>{booking.customerName}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Số điện thoại:</span>
              <span className={styles.value}>{booking.customerPhone}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.infoRow}>
              <span className={styles.labelBold}>Tổng tiền:</span>
              <span className={styles.valueBold}>
                {formatCurrency(booking.totalAmount)}đ
              </span>
            </div>

            {!isExpired && (
              <div className={styles.timerSection}>
                <div className={styles.timerIcon}>⏱️</div>
                <div className={styles.timerText}>
                  <span>Thời gian còn lại:</span>
                  <span className={styles.timerValue}>{timeRemaining}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {!isExpired ? (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleRetryPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() => router.push("/client/home")}
                >
                  Về trang chủ
                </button>
              </>
            ) : (
              <>
                <p className={styles.expiredMessage}>
                  Đơn hàng đã hết hạn. Vui lòng đặt vé mới.
                </p>
                <button
                  className={styles.primaryButton}
                  onClick={() => router.push("/client/booking")}
                >
                  Đặt vé mới
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function RetryPaymentPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Đang tải...
          </div>
        </Container>
      }
    >
      <RetryPaymentContent />
    </Suspense>
  );
}
