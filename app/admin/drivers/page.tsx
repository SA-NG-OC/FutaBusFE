"use client";

import React, { useState, useEffect } from "react";
import DriverCard from "@/feature/driver/components/DriverCard";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
import DriverRouteAssignmentModal from "@/feature/driver/components/DriverRouteAssignmentModal/DriverRouteAssignmentModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
import { driverRouteAssignmentApi } from "@/feature/driver/api/driverRouteAssignmentApi";
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";
import { Driver } from "@/feature/driver/api/driverApi";
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
    keyword,
    isModalOpen,
    isDeleteModalOpen,
    selectedDriver,
    handleSearch,
    handlePageChange,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleSaveDriver,
    handleDeleteConfirm,
    handleCreateWithAccount,
  } = useDrivers();

  // --- STATE ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] =
    useState<{ id: number; name: string } | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [driversWithRoutes, setDriversWithRoutes] = useState<Driver[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // --- LOGIC ---
  useEffect(() => {
    const fetchAssignedRoutes = async () => {
      if (!drivers.length) return;
      setLoadingRoutes(true);
      try {
        const driversWithRoutesData = await Promise.all(
          drivers.map(async (driver) => {
            try {
              const assignments = await driverRouteAssignmentApi.getByDriver(
                driver.driverId,
              );
              const activeRoutes = assignments
                .filter((a) => {
                  const startDate = new Date(a.startDate);
                  const endDate = a.endDate ? new Date(a.endDate) : null;
                  const today = new Date();
                  return startDate <= today && (!endDate || endDate >= today);
                })
                .map((a) => ({
                  assignmentId: a.assignmentId,
                  routeId: a.routeId,
                  routeName: a.routeName,
                  origin: a.origin,
                  destination: a.destination,
                  preferredRole: a.preferredRole,
                  priority: a.priority,
                  startDate: a.startDate,
                  endDate: a.endDate,
                }));
              return { ...driver, activeRoutes };
            } catch (error) {
              console.error(
                `Error fetching routes for driver ${driver.driverId}:`,
                error,
              );
              return { ...driver, activeRoutes: [] };
            }
          }),
        );
        setDriversWithRoutes(driversWithRoutesData);
      } catch (error) {
        console.error("Error fetching driver routes:", error);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchAssignedRoutes();
  }, [drivers]);

  useEffect(() => {
    if (selectedRouteId) {
      filterDriversByRoute();
    } else {
      setFilteredDrivers(driversWithRoutes);
    }
  }, [selectedRouteId, driversWithRoutes]);

  const filterDriversByRoute = async () => {
    if (!selectedRouteId) {
      setFilteredDrivers(driversWithRoutes);
      return;
    }
    try {
      const assignments =
        await driverRouteAssignmentApi.getByRoute(selectedRouteId);
      const driverIds = assignments.map((a) => a.driverId);
      const filtered = driversWithRoutes.filter((d) =>
        driverIds.includes(d.driverId),
      );
      setFilteredDrivers(filtered);
    } catch (error) {
      console.error("Error filtering drivers:", error);
      setFilteredDrivers([]);
    }
  };

  const handleAssignRoute = (driverId: number, driverName: string) => {
    setSelectedDriverForAssignment({ id: driverId, name: driverName });
    setShowAssignmentModal(true);
  };

  const handleAssignmentSuccess = async () => {
    if (selectedRouteId) {
      await filterDriversByRoute();
    }
  };

  const displayDrivers = selectedRouteId ? filteredDrivers : driversWithRoutes;

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        title="Quản lý tài xế"
        subtitle="Quản lý thông tin tài xế và phân công tuyến"
        actionLabel="Thêm tài xế"
        onAction={() => setShowCreateModal(true)}
      />

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
            onRouteSelect={setSelectedRouteId}
            selectedRouteId={selectedRouteId}
            placeholder="Tất cả tuyến đường"
          />
        </div>
      </div>

      {/* --- STATISTICS --- */}
      {selectedRouteId && (
        <div className={styles.statsBox}>
          <p className={styles.statsText}>
            Hiển thị{" "}
            <span className={styles.statsHighlight}>
              {displayDrivers.length}
            </span>{" "}
            tài xế thuộc tuyến đang chọn
          </p>
        </div>
      )}

      {loading && <p className={styles.loadingText}>Đang tải danh sách...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {/* --- DRIVER CARDS GRID --- */}
      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {displayDrivers.map((driver) => (
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

          {displayDrivers.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                {selectedRouteId
                  ? "Không có tài xế nào chạy tuyến này"
                  : "Không tìm thấy tài xế"}
              </p>
              <p className={styles.emptySubtitle}>
                {keyword
                  ? "Thử thay đổi từ khóa tìm kiếm"
                  : selectedRouteId
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
