"use client";

import React, { useState, useEffect } from "react";
import DriverCard from "@/feature/driver/components/DriverCard";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
import DriverRouteAssignmentModal from "@/feature/driver/components/DriverRouteAssignmentModal/DriverRouteAssignmentModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";
import { DriverStats, driverApi } from "@/feature/driver/api/driverApi";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";
import styles from "./AdminDriversPage.module.css";

export default function AdminDriversPage() {
  const {
    drivers,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    keyword,
    isModalOpen,
    isDeleteModalOpen,
    selectedDriver,
    handleSearch,
    handlePageChange,
    handleRouteFilter,
    routeFilter,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleSaveDriver,
    handleDeleteConfirm,
    handleCreateWithAccount,
  } = useDrivers();

  // --- STATS STATE ---
  const [stats, setStats] = useState<DriverStats>({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // --- STATE ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] =
    useState<{ id: number; name: string } | null>(null);

  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const isDataReady = !loading && !loadingRoutes;
  
  // --- LOGIC ---
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const statsData = await driverApi.getStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching driver stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [drivers]); // Refresh when drivers change

  const handleAssignRoute = (driverId: number, driverName: string) => {
    setSelectedDriverForAssignment({ id: driverId, name: driverName });
    setShowAssignmentModal(true);
  };

  const handleAssignmentSuccess = async () => {
    // Refresh will be handled by the hook
  };

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title="Quản lý tài xế"
        subtitle="Quản lý thông tin tài xế và phân công tuyến"
        actionLabel="Thêm tài xế"
        onAction={() => setShowCreateModal(true)}
      />

      {/* Total drivers count */}
      {!loading && !routeFilter && (
        <div className={styles.statsBox}>
          <p className={styles.statsText}>
            Tổng số:{" "}
            <span className={styles.statsHighlight}>
              {stats.total}
            </span>{" "}
            tài xế
          </p>
        </div>
      )}

      {/* --- FILTER SECTION --- */}
      <div className={styles.filterContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, bằng lái, email hoặc SĐT..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.routeFilterBox}>
          <RouteFilter
            onRouteSelect={(routeId) => handleRouteFilter(routeId || undefined)}
            selectedRouteId={routeFilter || null}
            placeholder="Tất cả tuyến đường"
          />
        </div>
      </div>

      {/* --- STATISTICS --- */}
      {routeFilter && (
        <div className={styles.statsBox}>
          <p className={styles.statsText}>
            Hiển thị{" "}
            <span className={styles.statsHighlight}>
              {drivers.length}
            </span>{" "}
            tài xế thuộc tuyến đang chọn
          </p>
        </div>
      )}

      {(loading || loadingRoutes) && (
        <p className={styles.loadingText}>Đang tải dữ liệu và cập nhật tuyến...</p>
      )}
      {error && <p className={styles.errorText}>{error}</p>}

      {/* --- DRIVER CARDS GRID --- */}
      {!error && isDataReady && (
        <>
          <div className={styles.grid}>
            {drivers.map((driver) => (
              <div key={driver.driverId} className={styles.cardWrapper}>
                <DriverCard
                  driver={driver}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onAssignRoute={handleAssignRoute} // Truyền prop vào Card, KHÔNG render nút ở đây
                />

                {/* [ĐÃ XÓA] Nút Gán tuyến Overlay đỏ cũ ở đây */}
              </div>
            ))}
          </div>

          {drivers.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                {routeFilter
                  ? "Không có tài xế nào chạy tuyến này"
                  : "Không tìm thấy tài xế"}
              </p>
              <p className={styles.emptySubtitle}>
                {keyword
                  ? "Thử thay đổi từ khóa tìm kiếm"
                  : routeFilter
                    ? "Hãy thử chọn tuyến khác hoặc thêm mới"
                    : 'Nhấn "Thêm tài xế" để tạo mới'}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* --- MODALS --- */}
      <CreateDriverModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWithAccount}
      />

      <DriverModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveDriver}
        initialData={selectedDriver}
        title={selectedDriver ? "Chỉnh sửa thông tin" : "Thêm tài xế mới"}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        driver={selectedDriver}
      />

      {selectedDriverForAssignment && (
        <DriverRouteAssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedDriverForAssignment(null);
          }}
          driverId={selectedDriverForAssignment.id}
          driverName={selectedDriverForAssignment.name}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
}
