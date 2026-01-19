"use client";
import Container from "@/src/components/ClientContainer/ClientContainer";
import PassengerForm from "@/feature/booking/components/PassengerForm/PassengerForm";
import PaymentMethod, {
  PaymentMethodType,
} from "@/feature/booking/components/PaymentMethod/PaymentMethod";
import BookingSummary from "@/feature/booking/components/BookingSummary/BookingSummary";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentApi } from "@/feature/booking/api/paymentApi";
import { useWebSocket } from "@/src/context/WebSocketContext";
import { useAuth } from "@/src/context/AuthContext";
import styles from "./page.module.css";
import type { PassengerData } from "@/feature/booking/components/PassengerForm/PassengerForm";

interface BookingInfoState {
  pricePerSeat: number;
  tripInfo: {
    routeName: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
  } | null;
  tripId: number | null;
  selectedSeats: Array<{
    seatId: number;
    seatNumber: string;
  }>;
  userId: string;
  isGuest?: boolean;
}

export default function ClientBookingCheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const [isFormValid, setIsFormValid] = useState(false);
  const [passengerData, setPassengerData] = useState<PassengerData | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [bookingInfo, setBookingInfo] = useState<BookingInfoState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const wsContext = useWebSocket();

  const seatsParam = searchParams?.get("seats") ?? "";
  const seats = seatsParam ? seatsParam.split(",") : [];

  // Load booking info from sessionStorage
  useEffect(() => {
    const loadBookingInfo = () => {
      const stored = sessionStorage.getItem("bookingInfo");
      const storedSeats = sessionStorage.getItem("selectedSeats");
      const storedTripId = sessionStorage.getItem("selectedTripId");
      const storedUserId = sessionStorage.getItem("booking_user_id");
      const storedIsGuest = sessionStorage.getItem("booking_is_guest");

      if (stored) {
        try {
          const parsedInfo = JSON.parse(stored);
          const parsedSeats = storedSeats ? JSON.parse(storedSeats) : [];

          // Use real userId from auth if authenticated, otherwise use stored guest ID
          const effectiveUserId =
            isAuthenticated && user ? String(user.userId) : storedUserId || "";

          setBookingInfo({
            ...parsedInfo,
            tripId: storedTripId ? parseInt(storedTripId, 10) : null,
            selectedSeats: parsedSeats,
            userId: effectiveUserId,
            isGuest: storedIsGuest === "true",
          });
        } catch (e) {
          console.error("Failed to parse booking info:", e);
        }
      }
    };

    loadBookingInfo();
  }, [isAuthenticated, user]);

  // Keep seats locked using WebSocket context
  useEffect(() => {
    if (
      bookingInfo &&
      bookingInfo.tripId &&
      bookingInfo.selectedSeats.length > 0 &&
      bookingInfo.userId
    ) {
      const tripId = bookingInfo.tripId;
      const seatIds = bookingInfo.selectedSeats.map((s) => s.seatId);
      const userId = bookingInfo.userId;

      // Enable keep-alive to re-lock seats every 2 minutes
      wsContext.keepSeatsLocked(tripId, seatIds, userId);
      console.log("✅ Keep-alive enabled for seats:", seatIds);

      return () => {
        // Cleanup when leaving page - but don't unlock seats yet
        // They will be unlocked after payment or on timeout
      };
    }
  }, [bookingInfo, wsContext]);

  // Countdown timer for seat hold expiry (15 minutes from booking-4)
  useEffect(() => {
    const holdExpiry = sessionStorage.getItem("seatHoldExpiry");
    if (!holdExpiry) return;

    const expiryTime = new Date(holdExpiry).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeRemaining(null);
        setError("Hết thời gian giữ chỗ. Vui lòng đặt vé lại.");
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seats.length === 0) {
      router.push("/client/booking-4");
    }
  }, [seats.length, router]);

  const handleFormChange = useCallback(
    (isValid: boolean, data: PassengerData) => {
      setIsFormValid(isValid);
      setPassengerData(data);
    },
    [],
  );

  const handlePaymentMethodChange = useCallback((method: PaymentMethodType) => {
    setPaymentMethod(method);
  }, []);

  const handleConfirmPayment = async () => {
    if (!isFormValid || !passengerData) {
      setError("Vui lòng điền đầy đủ thông tin hành khách");
      return;
    }

    if (!bookingInfo?.tripId || !bookingInfo?.selectedSeats?.length) {
      setError("Không tìm thấy thông tin đặt vé. Vui lòng thử lại.");
      return;
    }

    if (!bookingInfo?.userId) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng thử lại.");
      return;
    }

    console.log("=== DEBUG: Booking Info ===");
    console.log("tripId:", bookingInfo.tripId);
    console.log("selectedSeats:", bookingInfo.selectedSeats);
    console.log("userId:", bookingInfo.userId);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isGuest:", bookingInfo.isGuest);
    console.log("passengerData:", passengerData);

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create booking
      setProcessingStep("Đang tạo đơn đặt vé...");

      const isGuest = bookingInfo.isGuest ?? !isAuthenticated;

      const requestData = {
        tripId: bookingInfo.tripId,
        seatIds: bookingInfo.selectedSeats.map((s) => s.seatId),
        userId: bookingInfo.userId,
        customerName: passengerData.name,
        customerPhone: passengerData.phone,
        customerEmail: passengerData.email || undefined,
        pickupAddress: passengerData.pickupAddress || null,
        dropoffAddress: passengerData.dropoffAddress || null,
        specialNote: passengerData.specialNote || null,
        isGuestBooking: isGuest,
        guestSessionId: isGuest ? bookingInfo.userId : undefined,
        passengers: bookingInfo.selectedSeats.map((seat) => ({
          seatId: seat.seatId,
          fullName: passengerData.name,
          phoneNumber: passengerData.phone,
          email: passengerData.email || undefined,
          pickupAddress: passengerData.pickupAddress || null,
          dropoffAddress: passengerData.dropoffAddress || null,
          specialNote: passengerData.specialNote || null,
        })),
      };

      console.log("=== DEBUG: Passenger Data ===");
      console.log(
        "pickupAddress:",
        passengerData.pickupAddress,
        "length:",
        passengerData.pickupAddress.length,
      );
      console.log(
        "dropoffAddress:",
        passengerData.dropoffAddress,
        "length:",
        passengerData.dropoffAddress.length,
      );
      console.log(
        "specialNote:",
        passengerData.specialNote,
        "length:",
        passengerData.specialNote.length,
      );
      console.log("=== DEBUG: Request Data ===");
      console.log(JSON.stringify(requestData, null, 2));

      // const isGuest = bookingInfo.isGuest ?? !isAuthenticated;

      // const requestData = {
      //   tripId: bookingInfo.tripId,
      //   seatIds: bookingInfo.selectedSeats.map((s) => s.seatId),
      //   userId: bookingInfo.userId,
      //   customerName: passengerData.name,
      //   customerPhone: passengerData.phone,
      //   customerEmail: passengerData.email || undefined,
      //   isGuestBooking: isGuest,
      //   guestSessionId: isGuest ? bookingInfo.userId : undefined,
      // };

      // console.log("=== DEBUG: Final Request Data ===");
      // console.log(JSON.stringify(requestData, null, 2));

      const bookingResponse = await paymentApi.createBooking(requestData);

      console.log("Booking created:", bookingResponse);

      // Step 2: Create MoMo payment
      if (paymentMethod === "momo") {
        setProcessingStep("Đang kết nối với MoMo...");

        const paymentResponse = await paymentApi.createMomoPayment(
          bookingResponse.bookingId,
        );

        console.log("MoMo payment created:", paymentResponse);

        // Save pending payment info
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            orderId: paymentResponse.orderId,
            requestId: paymentResponse.requestId,
            bookingId: bookingResponse.bookingId,
            bookingCode: bookingResponse.bookingCode,
          }),
        );

        // Redirect to MoMo payment page
        setProcessingStep("Đang chuyển đến trang thanh toán MoMo...");

        // Small delay for user to see the message
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Redirect to MoMo
        window.location.href = paymentResponse.payUrl;
      } else if (paymentMethod === "bypass") {
        // Bypass payment - instant confirmation
        setProcessingStep("Đang xác nhận thanh toán...");

        const confirmedBooking = await paymentApi.bypassPayment(
          bookingResponse.bookingId,
        );

        console.log("Bypass payment completed:", confirmedBooking);

        // Cleanup session storage
        sessionStorage.removeItem("bookingInfo");
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("seatHoldExpiry");

        // Disconnect WebSocket
        wsContext.unsubscribeFromTrip();

        // Redirect to success page
        setProcessingStep("Thanh toán thành công! Đang chuyển hướng...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        router.push(
          `/client/payment/result?orderId=${bookingResponse.bookingCode}&resultCode=0&message=Thanh%20to%C3%A1n%20th%C3%A0nh%20c%C3%B4ng&bypass=true`,
        );
      } else {
        // Other payment methods (not implemented yet)
        setError("Phương thức thanh toán này chưa được hỗ trợ");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("=== Payment error ===");
      console.error("Error object:", err);

      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";

      // Type guard for axios error
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as {
          response?: {
            data?: {
              message?: string;
              errors?: Record<string, string>;
              errorCode?: string;
            };
          };
        };
        console.error("Error response:", axiosErr.response);
        console.error("Error data:", axiosErr.response?.data);

        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;

          // Nếu lỗi do ghế không được lock
          if (
            axiosErr.response.data.errorCode === "BAD_REQUEST" ||
            axiosErr.response.data.message.includes("chưa được khóa")
          ) {
            errorMessage =
              "Ghế đã hết thời gian giữ chỗ. Vui lòng quay lại trang chọn ghế và chọn lại.";

            // Redirect về trang chọn ghế sau 3 giây
            setTimeout(() => {
              router.push("/client/booking-4");
            }, 3000);
          }
        } else if (axiosErr.response?.data?.errors) {
          // Validation errors từ backend
          const errors = axiosErr.response.data.errors;
          errorMessage = Object.values(errors).join(", ");
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  // Processing screen
  if (isProcessing) {
    return (
      <Container>
        <div className={styles.processingContainer}>
          <div className={styles.processingCard}>
            <div className={styles.spinner}>
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
            </div>
            <p className={styles.processingText}>{processingStep}</p>
            <p className={styles.processingNote}>
              Vui lòng không đóng trang này...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.backButton}>
        <button onClick={() => router.back()}>← Quay lại</button>
      </div>

      {/* Timer warning */}
      {timeRemaining && (
        <div className={styles.timerBanner}>
          <span className={styles.timerIcon}>⏱️</span>
          <span>
            Thời gian giữ chỗ còn: <strong>{timeRemaining}</strong>
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
          <button className={styles.errorClose} onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.leftSection}>
          <PassengerForm onFormChange={handleFormChange} />
          <PaymentMethod
            onMethodChange={handlePaymentMethodChange}
            selectedMethod={paymentMethod}
          />
        </div>

        <div className={styles.rightSection}>
          <BookingSummary
            seats={seats}
            pricePerSeat={bookingInfo?.pricePerSeat}
            route={bookingInfo?.tripInfo?.routeName}
            date={bookingInfo?.tripInfo?.date}
            time={bookingInfo?.tripInfo?.departureTime}
          />

          <button
            className={styles.confirmButton}
            onClick={handleConfirmPayment}
            disabled={!isFormValid || isProcessing}
          >
            {paymentMethod === "momo" ? (
              <>Thanh toán với MoMo</>
            ) : paymentMethod === "bypass" ? (
              <>
                <span style={{ marginRight: 8 }}>⚡</span>
                Xác nhận ngay (Demo)
              </>
            ) : (
              "Xác nhận thanh toán"
            )}
          </button>

          <p className={styles.securityNote}>
            {paymentMethod === "bypass"
              ? "⚠️ Chế độ Demo: Bỏ qua thanh toán thực, vé sẽ được xác nhận ngay lập tức."
              : "🔒 Giao dịch được bảo mật bởi MoMo. Chúng tôi không lưu trữ thông tin thanh toán của bạn."}
          </p>
        </div>
      </div>
    </Container>
  );
}
