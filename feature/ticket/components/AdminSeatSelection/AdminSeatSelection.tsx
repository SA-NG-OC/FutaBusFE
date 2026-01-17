import React, { useState, useEffect } from "react";
import styles from "./AdminSeatSelection.module.css";

// Reuse components from Booking Client
import SeatMap from "@/feature/booking/components/SeatMap/SeatMap";
import TripDetailsSummary from "@/feature/booking/components/TripDetailsSummary/TripDetailsSummary";

// Định nghĩa Interface linh hoạt hơn để hứng mọi kiểu dữ liệu từ API
interface TripDetail {
  tripId: number;
  routeName: string;
  departureTime: string;
  price: number | string; // Có thể API trả về string hoặc number
  basePrice?: number; // Fallback nếu price không có

  // Các biến có thể chứa thông tin loại xe
  vehicleType?: string;
  vehicleInfo?: string;
  vehicleName?: string;

  licensePlate?: string;
  driverName?: string;
  origin?: string; // Có thể là locationName
  destination?: string;

  // Tổng số ghế để chia tầng
  totalSeats?: number;
}

interface AdminSeatSelectionProps {
  trip: any; // Dùng any tạm thời để tránh lỗi type nếu API trả về khác Interface
  onBack: () => void;
  onNext: (selectedSeats: string[], totalAmount: number) => void;
}

export default function AdminSeatSelection({
  trip,
  onBack,
  onNext,
}: AdminSeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  // Debug: In ra để xem cấu trúc trip thực tế là gì
  useEffect(() => {
    console.log("Data chuyến xe nhận được:", trip);

    // TODO: Gọi API lấy ghế đã đặt thật
    setBookedSeats(["A01", "A02", "B05"]);
  }, [trip]);

  // --- XỬ LÝ DỮ LIỆU AN TOÀN ---

  // 1. Lấy giá tiền (Ưu tiên price, nếu không có lấy basePrice)
  const rawPrice = trip.price || trip.basePrice || 0;
  const pricePerSeat = Number(rawPrice);
  const total = selectedSeats.length * pricePerSeat;

  // 2. Xác định loại xe (2 tầng hay 1 tầng) [FIX QUAN TRỌNG]
  // Gom tất cả các trường có thể chứa thông tin xe lại thành 1 chuỗi để kiểm tra
  const vehicleString = [
    trip.vehicleType,
    trip.vehicleInfo,
    trip.vehicleName,
    trip.vehicle?.vehicleType?.typeName, // Nếu lồng nhau sâu
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isDoubleDecker =
    vehicleString.includes("giường") ||
    vehicleString.includes("sleeper") ||
    vehicleString.includes("limousine") ||
    vehicleString.includes("phòng");

  // 3. Tính số ghế mỗi tầng
  // Nếu có totalSeats thì chia đôi, nếu không mặc định 40 ghế (20/20)
  const totalSeats = trip.totalSeats || 40;
  const seatsPerFloor = Math.ceil(totalSeats / 2);

  // 4. Xử lý hiển thị Ngày & Giờ (Tránh lỗi Invalid Date)
  const getFormattedDate = () => {
    try {
      if (!trip.departureTime) return "N/A";
      return new Date(trip.departureTime).toLocaleDateString("vi-VN");
    } catch (e) {
      return "N/A";
    }
  };

  const getFormattedTime = () => {
    try {
      if (!trip.departureTime) return "N/A";
      return new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế");
      return;
    }
    onNext(selectedSeats, total);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  return (
    <div className={styles.container}>
      {/* Header Back */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Quay lại chọn chuyến xe
        </button>
      </div>

      <div className={styles.mainContent}>
        {/* CỘT TRÁI: SƠ ĐỒ GHẾ */}
        <div className={styles.seatMapWrapper}>
          <SeatMap
            onSeatsChange={setSelectedSeats}
            // Nếu là xe giường nằm -> double, ngược lại single
            busType={isDoubleDecker ? "double" : "single"}
            // Chia số ghế tự động
            lowerFloorSeats={isDoubleDecker ? seatsPerFloor : totalSeats}
            upperFloorSeats={isDoubleDecker ? seatsPerFloor : 0}
            bookedSeats={bookedSeats}
          />
        </div>

        {/* CỘT PHẢI: TÓM TẮT */}
        <div>
          <TripDetailsSummary
            selectedSeats={selectedSeats}
            pricePerSeat={pricePerSeat}
            // Map đúng trường dữ liệu (fallback an toàn)
            from={trip.origin || trip.route?.origin?.locationName || "Điểm đi"}
            to={
              trip.destination ||
              trip.route?.destination?.locationName ||
              "Điểm đến"
            }
            date={getFormattedDate()}
            time={getFormattedTime()}
            busType={trip.vehicleType || trip.vehicleInfo || "Xe khách"}
          />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.bottomBar}>
        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>
            Tổng cộng ({selectedSeats.length} vé):
          </span>
          <span className={styles.totalAmount}>{formatCurrency(total)}₫</span>
        </div>
        <button
          className={styles.continueButton}
          onClick={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          Tiếp tục: Thông tin khách hàng →
        </button>
      </div>
    </div>
  );
}
