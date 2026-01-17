"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Container from "@/src/components/ClientContainer/ClientContainer";
import { paymentApi } from "@/feature/booking/api/paymentApi";
import { useWebSocket } from "@/src/context/WebSocketContext";
import styles from "./page.module.css";

type PaymentStatus = "loading" | "verifying" | "success" | "failed";

interface PaymentInfo {
  orderId: string;
  transId: string;
  amount: number;
  message: string;
}

function PaymentResultContent() {
  /* ===================== HOOKS (LUÔN Ở TRÊN) ===================== */
  const hasProcessedRef = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const wsContext = useWebSocket();

  const orderId = searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");
  const transId = searchParams.get("transId");
  const requestId = searchParams.get("requestId");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ===================== SIDE EFFECT ===================== */
  useEffect(() => {
    // luôn gọi hook, nhưng logic có điều kiện
    if (!orderId) {
      setStatus("failed");
      setError("Không tìm thấy thông tin thanh toán");
      return;
    }

    // chặn StrictMode chạy lại
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const processPaymentResult = async () => {
      console.log("Payment result params:", {
        orderId,
        resultCode,
        message,
        transId,
        requestId,
      });

      if (resultCode === "0") {
        setStatus("verifying");

        try {
          if (requestId) {
            const statusResponse = await paymentApi.checkPaymentStatus(
              orderId,
              requestId,
            );

            if (statusResponse.resultCode === 0) {
              setStatus("success");
              setPaymentInfo({
                orderId,
                transId: transId || String(statusResponse.transId),
                amount: statusResponse.amount,
                message: "Thanh toán thành công",
              });
            } else {
              setStatus("failed");
              setError(statusResponse.message || "Thanh toán thất bại");
            }
          } else {
            // fallback: tin redirect của MoMo
            setStatus("success");
            setPaymentInfo({
              orderId,
              transId: transId || "",
              amount: 0,
              message: message || "Thanh toán thành công",
            });
          }
        } catch (err) {
          console.error("Verify payment error:", err);
          setStatus("success");
          setPaymentInfo({
            orderId,
            transId: transId || "",
            amount: 0,
            message: message || "Thanh toán thành công",
          });
        }
      } else {
        setStatus("failed");
        setError(message || "Thanh toán không thành công");
      }

      // cleanup – chỉ chạy 1 lần
      sessionStorage.removeItem("bookingInfo");
      sessionStorage.removeItem("selectedSeats");
      sessionStorage.removeItem("seatHoldExpiry");
      localStorage.removeItem("pendingPayment");

      wsContext.unsubscribeFromTrip();
      console.log("✅ Cleaned up WebSocket subscription");
    };

    processPaymentResult();
  }, [orderId, resultCode, message, transId, requestId, wsContext]);

  /* ===================== HELPERS ===================== */
  const formatCurrency = (amount: number) => amount.toLocaleString("vi-VN");

  /* ===================== UI STATES ===================== */
  if (status === "loading" || status === "verifying") {
    return (
      <Container>
        <div className={styles.resultContainer}>
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>
              {status === "loading"
                ? "Đang xử lý kết quả thanh toán..."
                : "Đang xác nhận với hệ thống..."}
            </p>
          </div>
        </div>
      </Container>
    );
  }

  if (status === "success") {
    return (
      <Container>
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <h1 className={styles.successTitle}>Thanh toán thành công!</h1>

            <div className={styles.paymentDetails}>
              {paymentInfo && (
                <>
                  <div className={styles.detailRow}>
                    <span>Mã đơn hàng:</span>
                    <span>{paymentInfo.orderId}</span>
                  </div>

                  {paymentInfo.transId && (
                    <div className={styles.detailRow}>
                      <span>Mã giao dịch MoMo:</span>
                      <span>{paymentInfo.transId}</span>
                    </div>
                  )}

                  {paymentInfo.amount > 0 && (
                    <div className={styles.detailRow}>
                      <span>Số tiền:</span>
                      <span>{formatCurrency(paymentInfo.amount)}đ</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                onClick={() => router.push("/client/my-ticket")}
              >
                Xem vé của tôi
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

  // FAILED
  return (
    <Container>
      <div className={styles.resultContainer}>
        <div className={styles.resultCard}>
          <h1 className={styles.failedTitle}>Thanh toán thất bại</h1>
          <p className={styles.failedMessage}>
            {error || "Giao dịch không thể hoàn tất"}
          </p>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={() => router.back()}
            >
              Thử lại
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => router.push("/client/booking")}
            >
              Đặt vé mới
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function PaymentResultPage() {
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
      <PaymentResultContent />
    </Suspense>
  );
}
