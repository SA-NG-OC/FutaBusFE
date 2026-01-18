import React, { useEffect, useState } from "react";
import styles from "./AdminBookingView.module.css";

// Reuse components
import TripFilter from "@/feature/booking/components/TripFilter/TripFilter";
import TripSearch from "@/feature/booking/components/TripSearch/TripSearch";
import TripSort from "@/feature/booking/components/TripSort/TripSort";
import TripCard from "@/feature/booking/components/TripCard/TripCard";
import Pagination from "@/src/components/Pagination/Pagination";

// [NEW] Import 2 component con của quy trình đặt vé
import AdminSeatSelection from "@/feature/ticket/components/AdminSeatSelection/AdminSeatSelection";
import AdminPassengerInfo from "@/feature/ticket/components/AdminPassengerInfo/AdminPassengerInfo";

// Hook & Types
import { useTrips } from "@/feature/trip/hooks/useTrips";
import { SelectedSeat } from "@/feature/booking/types";
import { TripData } from "@/feature/trip/types"; // Import type chuẩn

interface AdminBookingViewProps {
  onBack: () => void;
}

interface BookingFilters {
  page: number;
  originId?: number;
  destId?: number;
  date?: string;
  sortBy: "price" | "departureTime" | "rating";
  sortDir: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  timeRanges: ("Morning" | "Afternoon" | "Evening" | "Night")[];
  vehicleTypes: string[];
}

export default function AdminBookingView({ onBack }: AdminBookingViewProps) {
  // --- STATE QUẢN LÝ FLOW ---
  // Step 1: Search Trip -> Step 2: Select Seat -> Step 3: Passenger Info
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Data tạm để truyền giữa các bước
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [bookingSeats, setBookingSeats] = useState<SelectedSeat[]>([]);
  const [bookingTotal, setBookingTotal] = useState<number>(0);

  // --- STATE FILTERS ---
  const [filters, setFilters] = useState<BookingFilters>({
    page: 0,
    originId: undefined,
    destId: undefined,
    date: undefined,
    sortBy: "departureTime",
    sortDir: "asc",
    minPrice: undefined,
    maxPrice: undefined,
    timeRanges: [],
    vehicleTypes: [],
  });

  const {
    trips,
    loading,
    currentPage,
    totalPages,
    totalElements,
    fetchTripsForBooking,
  } = useTrips();

  useEffect(() => {
    fetchTripsForBooking(filters);
  }, [filters, fetchTripsForBooking]);

  // --- HANDLERS FILTERS ---
  const handleSearch = (params: {
    originId?: number;
    destId?: number;
    date?: string;
  }) => {
    setFilters((prev) => ({ ...prev, ...params, page: 0 }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      timeRanges: newFilters.timeRanges as any,
      page: 0,
    }));
  };

  const handleSortChange = (sortBy: string, sortDir: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as any,
      sortDir: sortDir as any,
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // --- HANDLERS BOOKING FLOW ---

  // B1 -> B2: Chọn chuyến xe
  const handleSelectTrip = (tripIdOrObj: any) => {
    const tripData =
      typeof tripIdOrObj === "number"
        ? trips.find((t) => t.tripId === tripIdOrObj)
        : tripIdOrObj;

    if (!tripData) return alert("Lỗi: Không tìm thấy chuyến xe");

    setSelectedTrip(tripData);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // B2 -> B3: Đã chọn ghế xong, sang điền thông tin
  const handleSeatSelectionDone = (seats: SelectedSeat[], total: number) => {
    setBookingSeats(seats);
    setBookingTotal(total);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // B3 -> Success: Đặt vé thành công
  const handleBookingSuccess = (bookingCode: string) => {
    alert(`✅ Đặt vé thành công!\nMã đặt chỗ: ${bookingCode}`);
    // Reset về trang tìm kiếm để đặt vé mới
    setCurrentStep(1);
    setSelectedTrip(null);
    setBookingSeats([]);
    // Reload lại danh sách chuyến (để cập nhật số ghế trống)
    fetchTripsForBooking(filters);
  };

  // --- RENDER LOGIC ---

  // STEP 3: THÔNG TIN KHÁCH & THANH TOÁN
  if (currentStep === 3 && selectedTrip) {
    return (
      <AdminPassengerInfo
        trip={selectedTrip}
        selectedSeats={bookingSeats}
        totalAmount={bookingTotal}
        onBack={() => setCurrentStep(2)} // Quay lại chọn ghế
        onSuccess={handleBookingSuccess}
      />
    );
  }

  // STEP 2: CHỌN GHẾ
  if (currentStep === 2 && selectedTrip) {
    return (
      <AdminSeatSelection
        trip={selectedTrip}
        onBack={() => {
          setSelectedTrip(null);
          setCurrentStep(1);
        }}
        onNext={handleSeatSelectionDone}
      />
    );
  }

  // STEP 1: DANH SÁCH CHUYẾN XE (SEARCH & FILTER)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Quay lại Dashboard
        </button>
        <h2 className={styles.title}>Đặt vé tại quầy (Walk-in Booking)</h2>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "10px" }}>
        <TripSearch onSearch={handleSearch} />
      </div>

      <div className={styles.content}>
        {/* Sidebar Filter */}
        <div className={styles.filterSidebar}>
          <TripFilter onFilterChange={handleFilterChange} />
        </div>

        {/* List Result */}
        <div className={styles.tripList}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              Tìm thấy <b>{totalElements}</b> chuyến xe
            </span>
            <TripSort onSortChange={handleSortChange} />
          </div>

          {loading ? (
            <div className={styles.loading}>Đang tải dữ liệu chuyến xe...</div>
          ) : trips.length === 0 ? (
            <div className={styles.empty}>
              Không tìm thấy chuyến xe nào phù hợp.
            </div>
          ) : (
            trips.map((trip) => (
              <TripCard
                key={trip.tripId}
                tripDetail={trip}
                handleSelectSeat={(id) => handleSelectTrip(id)}
              />
            ))
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
