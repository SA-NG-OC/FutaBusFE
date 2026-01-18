import React, { useState, useEffect } from "react";
import styles from "./AdminPassengerInfo.module.css";

// API & Context
import {
  paymentApi,
  CounterBookingRequest,
} from "@/feature/booking/api/paymentApi";
import { useAuth } from "@/src/context/AuthContext";
import { useWebSocket } from "@/src/context/WebSocketContext";

// Types
import { SelectedSeat } from "@/feature/booking/types";
import { TripData } from "@/feature/trip/types";

interface AdminPassengerInfoProps {
  trip: TripData;
  selectedSeats: SelectedSeat[];
  totalAmount: number;
  onBack: () => void;
  onSuccess: (bookingCode: string) => void;
}

export default function AdminPassengerInfo({
  trip,
  selectedSeats,
  totalAmount,
  onBack,
  onSuccess,
}: AdminPassengerInfoProps) {
  const { user } = useAuth();
  const { keepSeatsLocked, isConnected } = useWebSocket();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });

  // --- KEEP ALIVE SEATS ---
  useEffect(() => {
    if (user?.userId && trip.tripId && selectedSeats.length > 0) {
      const seatIds = selectedSeats.map((s) => s.seatId);
      keepSeatsLocked(trip.tripId, seatIds, String(user.userId));
    }
  }, [user, trip.tripId, selectedSeats, keepSeatsLocked]);

  // --- VALIDATION ---
  const validate = () => {
    const newErrors = { name: "", phone: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên khách hàng";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // --- SUBMIT HANDLER [UPDATED] ---
  const handleSubmit = async () => {
    if (!validate()) return;

    if (!user?.userId) {
      alert("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setIsProcessing(true);
    try {
      // Chuẩn bị payload cho API /bookings/counter
      const requestData: CounterBookingRequest = {
        tripId: trip.tripId,
        seatIds: selectedSeats.map((s) => s.seatId),
        userId: String(user.userId), // Admin ID

        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        notes: formData.notes || "Bán tại quầy (Tiền mặt)",
      };

      console.log("🚀 Sending Counter Booking Request:", requestData);

      // Gọi API mới (1 bước duy nhất)
      const res = await paymentApi.createCounterBooking(requestData);

      console.log("✅ Counter booking success:", res);

      // Thành công -> Báo cho Parent Component
      onSuccess(res.bookingCode);
    } catch (error: any) {
      console.error("Booking Error:", error);

      const msg =
        error?.response?.data?.message || error.message || "Xử lý thất bại.";

      // Handle lỗi liên quan đến ghế
      if (
        msg.toLowerCase().includes("khóa") ||
        msg.toLowerCase().includes("locked") ||
        msg.toLowerCase().includes("taken")
      ) {
        alert(
          "Một hoặc nhiều ghế đã bị thay đổi trạng thái. Vui lòng chọn lại.",
        );
        onBack(); // Quay lại màn hình chọn ghế để refresh
      } else {
        alert(`Lỗi đặt vé: ${msg}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- FORMAT DATA ---
  const formatCurrency = (val: number) => val.toLocaleString("vi-VN");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    if (dateStr.includes("T"))
      return new Date(dateStr).toLocaleDateString("vi-VN");
    try {
      const [y, m, d] = dateStr.split("-");
      if (y && m && d) return `${d}/${m}/${y}`;
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "--:--";
    if (timeStr.includes("T"))
      return new Date(timeStr).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    if (timeStr.length >= 5) return timeStr.substring(0, 5);
    return timeStr;
  };

  const displayDate = trip.date
    ? formatDate(trip.date)
    : formatDate(trip.departureTime);
  const displayTime = trip.departureTime
    ? formatTime(trip.departureTime)
    : "--:--";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Quay lại
        </button>
        <h2 className={styles.title}>Thông tin khách hàng & Thanh toán</h2>
      </div>

      <div className={styles.contentLayout}>
        {/* CỘT TRÁI: FORM */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thông tin hành khách</h3>

            <div className={styles.formGroup}>
              <label>
                Họ và tên <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <span className={styles.errorMsg}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Số điện thoại <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                placeholder="09xx xxx xxx"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? styles.inputError : ""}
              />
              {errors.phone && (
                <span className={styles.errorMsg}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email (Tùy chọn)</label>
              <input
                type="email"
                placeholder="khachhang@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Ghi chú</label>
              <textarea
                rows={2}
                placeholder="Ghi chú thêm..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: SUMMARY */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Thông tin chuyến đi</h3>

            <div className={styles.summaryItem}>
              <span className={styles.label}>Tuyến:</span>
              <span className={styles.value}>
                {trip.originName || "Điểm đi"} →{" "}
                {trip.destinationName || "Điểm đến"}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.label}>Khởi hành:</span>
              <span className={styles.value}>
                {displayTime} - {displayDate}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.label}>Xe:</span>
              <span className={styles.value}>{trip.vehicleInfo}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.summaryItem}>
              <span className={styles.label}>
                Ghế ({selectedSeats.length}):
              </span>
              <span className={styles.highlight}>
                {selectedSeats.map((s) => s.seatNumber).join(", ")}
              </span>
            </div>

            <div className={styles.summaryItem}>
              <span className={styles.label}>Đơn giá:</span>
              <span className={styles.value}>
                {selectedSeats.length > 0
                  ? formatCurrency(totalAmount / selectedSeats.length)
                  : 0}
                ₫
              </span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalSection}>
              <span>Tổng thu (Tiền mặt):</span>
              <span className={styles.totalPrice}>
                {formatCurrency(totalAmount)}₫
              </span>
            </div>

            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xuất vé..." : "Xác nhận & In vé"}
            </button>

            <p className={styles.note}>
              * Admin xác nhận đồng nghĩa với việc đã thu tiền mặt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
