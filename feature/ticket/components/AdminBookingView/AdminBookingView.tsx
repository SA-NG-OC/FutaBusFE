import React, { useEffect, useState } from "react";
import styles from "./AdminBookingView.module.css";

// Reuse components
import TripFilter from "@/feature/booking/components/TripFilter/TripFilter";
import TripSearch from "@/feature/booking/components/TripSearch/TripSearch";
import TripSort from "@/feature/booking/components/TripSort/TripSort";
import TripCard from "@/feature/booking/components/TripCard/TripCard";
import Pagination from "@/src/components/Pagination/Pagination";

// [NEW] Import component chọn ghế
import AdminSeatSelection from "@/feature/ticket/components/AdminSeatSelection/AdminSeatSelection";

// Hook
import { useTrips } from "@/feature/trip/hooks/useTrips";

interface AdminBookingViewProps {
  onBack: () => void;
}

// Định nghĩa Interface chuẩn cho Filters để tránh lỗi TypeScript
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
  // Step 1: Chọn chuyến (Search)
  // Step 2: Chọn ghế (Seat Selection)
  // Step 3: Điền thông tin (Sẽ làm sau)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

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

  // Gọi API khi filters thay đổi
  useEffect(() => {
    fetchTripsForBooking(filters);
  }, [filters, fetchTripsForBooking]);

  // --- HANDLERS CHO FILTER & SEARCH ---

  const handleSearch = (searchParams: {
    originId?: number;
    destId?: number;
    date?: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      ...searchParams,
      page: 0,
    }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Ép kiểu thủ công để TS không báo lỗi
      timeRanges: newFilters.timeRanges as (
        | "Morning"
        | "Afternoon"
        | "Evening"
        | "Night"
      )[],
      page: 0,
    }));
  };

  const handleSortChange = (sortBy: string, sortDir: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as "price" | "departureTime" | "rating",
      sortDir: sortDir as "asc" | "desc",
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // --- HANDLERS CHO BOOKING FLOW ---

  // Chuyển từ Step 1 -> Step 2
  const handleSelectSeat = (tripIdOrObj: any) => {
    // Tìm object trip đầy đủ từ mảng trips dựa vào ID (vì TripCard thường chỉ trả về ID)
    const tripData =
      typeof tripIdOrObj === "number"
        ? trips.find((t) => t.tripId === tripIdOrObj)
        : tripIdOrObj;

    if (!tripData) {
      alert("Không tìm thấy thông tin chuyến xe!");
      return;
    }

    console.log("Selected Trip:", tripData);
    setSelectedTrip(tripData);
    setCurrentStep(2);

    // Scroll lên đầu trang cho mượt
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quay lại từ Step 2 -> Step 1
  const handleBackToSearch = () => {
    setCurrentStep(1);
    setSelectedTrip(null);
  };

  // Chuyển từ Step 2 -> Step 3 (Form khách hàng)
  const handleNextToForm = (seats: string[], total: number) => {
    console.log("Seats:", seats, "Total:", total);
    alert(
      `Đã chọn ghế: ${seats.join(
        ", "
      )}. Code chuyển sang bước điền Form khách hàng sẽ nằm ở đây!`
    );
    // setCurrentStep(3); // Uncomment khi đã có component form
  };

  // --- RENDER STEP 2: CHỌN GHẾ ---
  if (currentStep === 2 && selectedTrip) {
    return (
      <AdminSeatSelection
        trip={selectedTrip}
        onBack={handleBackToSearch}
        onNext={handleNextToForm}
      />
    );
  }

  // --- RENDER STEP 1: DANH SÁCH CHUYẾN XE ---
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          ← Quay lại danh sách vé
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

        {/* Main Content */}
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
                handleSelectSeat={(id) => handleSelectSeat(id)}
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
