"use client";
import React, { useState, useEffect } from "react";
import { useVehicles } from "@/feature/vehicle/hooks/useVehicle";
import { Vehicle, VehicleRequest, VehicleType } from "@/feature/vehicle/types";
import VehicleTable from "@/feature/vehicle/components/VehicleTable/VehicleTable";
import VehicleModal from "@/feature/vehicle/components/VehicleModal/VehicleModal";
import ConfirmDeleteModal from "@/feature/vehicle/components/ConfirmDeleteModal/ConfirmDeleteModal";
// [NEW] Import Modal Gán tuyến
import VehicleRouteAssignmentModal from "@/feature/vehicle/components/VehicleRouteAssignmentModal/VehicleRouteAssignmentModal";
import { vehicleRouteAssignmentApi } from "@/feature/vehicle/api/vehicleRouteAssignmentApi";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import styles from "./VehiclePage.module.css";
// [NEW] Import Filter
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";

// --- Types & Helper Functions (Giữ nguyên như cũ) ---
interface VehicleTableData {
  vehicleId: number;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  insuranceNumber?: string;
  insuranceExpiry?: string;
  createdAt: string;
}

interface VehicleModalData {
  vehicleId?: number;
  licensePlate: string;
  vehicleType: string;
  typeId: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  insuranceNumber?: string;
  insuranceExpiry?: string;
  notes?: string;
}

// Mock vehicle types
const vehicleTypes: VehicleType[] = [
  { typeId: 1, typeName: "Limousine", capacity: 34 },
  { typeId: 2, typeName: "Giường nằm", capacity: 40 },
  { typeId: 3, typeName: "Ghế ngồi", capacity: 45 },
  { typeId: 4, typeName: "Limousine 34 Phòng", capacity: 34 },
  { typeId: 5, typeName: "Xe buýt", capacity: 50 },
];

const getVehicleTypeInfo = (typeId: number) => {
  return (
    vehicleTypes.find((type) => type.typeId === typeId) || {
      typeName: "Unknown",
      capacity: 0,
    }
  );
};

const convertToTableData = (vehicle: Vehicle): VehicleTableData => {
  const typeInfo = getVehicleTypeInfo(vehicle.typeId);
  return {
    vehicleId: vehicle.vehicleid,
    licensePlate: vehicle.licenseplate,
    vehicleType: vehicle.vehicletype || typeInfo.typeName,
    capacity: vehicle.totalseats || typeInfo.capacity,
    status: mapApiStatusToComponentStatus(vehicle.status),
    insuranceNumber: vehicle.insuranceNumber,
    insuranceExpiry: vehicle.insuranceExpiry,
    createdAt: new Date().toISOString(),
  };
};

const convertToModalData = (vehicle: Vehicle): VehicleModalData => {
  const typeInfo = getVehicleTypeInfo(vehicle.typeId);
  return {
    vehicleId: vehicle.vehicleid,
    licensePlate: vehicle.licenseplate,
    vehicleType: vehicle.vehicletype || typeInfo.typeName,
    typeId: vehicle.typeId,
    capacity: vehicle.totalseats || typeInfo.capacity,
    status: mapApiStatusToComponentStatus(vehicle.status),
    insuranceNumber: vehicle.insuranceNumber,
    insuranceExpiry: vehicle.insuranceExpiry,
    notes: undefined,
  };
};

interface ConfirmDeleteVehicleData {
  vehicleId: number;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

const convertToDeleteModalData = (
  vehicle: Vehicle,
): ConfirmDeleteVehicleData => {
  const typeInfo = getVehicleTypeInfo(vehicle.typeId);
  return {
    vehicleId: vehicle.vehicleid,
    licensePlate: vehicle.licenseplate,
    vehicleType: vehicle.vehicletype || typeInfo.typeName,
    capacity: vehicle.totalseats || typeInfo.capacity,
    status: mapApiStatusToComponentStatus(vehicle.status),
  };
};

const convertToApiRequest = (data: VehicleModalData): VehicleRequest => ({
  licensePlate: data.licensePlate,
  typeId: data.typeId,
  insuranceNumber: data.insuranceNumber,
  insuranceExpiry: data.insuranceExpiry,
  status: mapComponentStatusToApiStatus(data.status),
});

const mapApiStatusToComponentStatus = (
  apiStatus: string,
): "ACTIVE" | "INACTIVE" | "MAINTENANCE" => {
  switch (apiStatus.toLowerCase()) {
    case "operational":
      return "ACTIVE";
    case "maintenance":
      return "MAINTENANCE";
    case "inactive":
      return "INACTIVE";
    case "hoàn thiện":
      return "ACTIVE"; // Fallback Vietnamese
    case "hư hại":
      return "MAINTENANCE";
    case "phế liệu":
      return "INACTIVE";
    default:
      return "ACTIVE";
  }
};

const mapComponentStatusToApiStatus = (
  componentStatus: "ACTIVE" | "INACTIVE" | "MAINTENANCE",
): string => {
  switch (componentStatus) {
    case "ACTIVE":
      return "Operational";
    case "MAINTENANCE":
      return "Maintenance";
    case "INACTIVE":
      return "Inactive";
    default:
      return "Operational";
  }
};

// --- COMPONENT ---

export default function VehiclePage() {
  const {
    vehicles,
    loading,
    error,
    isModalOpen,
    isDeleteModalOpen,
    selectedVehicle,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleSaveVehicle,
    handleDeleteConfirm,
  } = useVehicles();

  // --- LOGIC ASSIGNMENT (Của bạn bạn) ---
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedVehicleForAssignment, setSelectedVehicleForAssignment] =
    useState<{ vehicleId: number; licensePlate: string } | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  // Filter logic
  useEffect(() => {
    let cancelled = false;
    const filterVehiclesByRoute = async () => {
      if (!selectedRouteId) return;
      try {
        const assignments =
          await vehicleRouteAssignmentApi.getByRoute(selectedRouteId);
        const vehicleIds = assignments.map((a) => a.vehicleId);
        const filtered = vehicles.filter((v) =>
          vehicleIds.includes(v.vehicleid),
        );
        if (!cancelled) setFilteredVehicles(filtered);
      } catch (error) {
        console.error("Error filtering vehicles:", error);
        if (!cancelled) setFilteredVehicles([]);
      }
    };

    if (selectedRouteId) {
      filterVehiclesByRoute();
    }
    return () => {
      cancelled = true;
    };
  }, [selectedRouteId, vehicles]);

  // Determine display list
  const displayVehicles = selectedRouteId ? filteredVehicles : vehicles;
  const tableVehicles = displayVehicles.map(convertToTableData);

  // Handlers
  const handleEditClick = (tableVehicle: VehicleTableData) => {
    const originalVehicle = vehicles.find(
      (v) => v.vehicleid === tableVehicle.vehicleId,
    );
    if (originalVehicle) {
      openEditModal(tableVehicle.vehicleId);
    }
  };

  const handleDeleteClick = (vehicleId: number) => {
    openDeleteModal(vehicleId);
  };

  const handleModalSave = async (modalData: VehicleModalData) => {
    const apiData = convertToApiRequest(modalData);
    await handleSaveVehicle(apiData);
  };

  const handleAssignRouteClick = (vehicleId: number) => {
    const vehicle = tableVehicles.find((v) => v.vehicleId === vehicleId);
    if (vehicle) {
      setSelectedVehicleForAssignment({
        vehicleId: vehicle.vehicleId,
        licensePlate: vehicle.licensePlate,
      });
      setShowAssignmentModal(true);
    }
  };

  const handleAssignmentSuccess = () => {
    // Refresh logic if needed
  };

  // Error State
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <PageHeader
          title="Quản lý xe"
          subtitle="Quản lý thông tin xe và tài xế"
        />
        <div className={styles.errorBox}>
          <svg
            className={styles.errorIcon}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className={styles.errorTitle}>Lỗi tải dữ liệu</h3>
            <p className={styles.errorText}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <PageHeader
        title="Quản lý xe"
        subtitle="Quản lý thông tin xe và tài xế trong hệ thống"
        actionLabel="Thêm xe mới"
        onAction={openAddModal}
      />

      {/* --- FILTER SECTION (Mới - CSS Module) --- */}
      <div className={styles.filterSection}>
        <RouteFilter
          onRouteSelect={setSelectedRouteId}
          selectedRouteId={selectedRouteId}
          placeholder="Lọc theo tuyến đường"
        />
      </div>

      {/* Statistics (Hiển thị khi lọc) */}
      {selectedRouteId && (
        <div className={styles.statsBox}>
          <p className={styles.statsText}>
            Hiển thị{" "}
            <span className={styles.statsHighlight}>
              {displayVehicles.length}
            </span>{" "}
            xe được gắn vào tuyến đã chọn
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {/* Card 1: Tổng số xe (Blue) */}
            <div className={`${styles.statCard} ${styles.cardBlue}`}>
              <div className={styles.statContent}>
                <div
                  className={`${styles.statIconWrapper} ${styles.iconWrapperBlue}`}
                >
                  <svg
                    className={`${styles.statIcon} ${styles.iconBlue}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z"
                    />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <p className={`${styles.statLabel} ${styles.labelBlue}`}>
                    Tổng số xe
                  </p>
                  <p className={`${styles.statValue} ${styles.valueBlue}`}>
                    {vehicles.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Đang hoạt động (Green) */}
            <div className={`${styles.statCard} ${styles.cardGreen}`}>
              <div className={styles.statContent}>
                <div
                  className={`${styles.statIconWrapper} ${styles.iconWrapperGreen}`}
                >
                  <svg
                    className={`${styles.statIcon} ${styles.iconGreen}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <p className={`${styles.statLabel} ${styles.labelGreen}`}>
                    Đang hoạt động
                  </p>
                  <p className={`${styles.statValue} ${styles.valueGreen}`}>
                    {
                      vehicles.filter(
                        (v) => v.status.toLowerCase() === "operational",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Bảo trì (Yellow) */}
            <div className={`${styles.statCard} ${styles.cardYellow}`}>
              <div className={styles.statContent}>
                <div
                  className={`${styles.statIconWrapper} ${styles.iconWrapperYellow}`}
                >
                  <svg
                    className={`${styles.statIcon} ${styles.iconYellow}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <p className={`${styles.statLabel} ${styles.labelYellow}`}>
                    Bảo trì
                  </p>
                  <p className={`${styles.statValue} ${styles.valueYellow}`}>
                    {
                      vehicles.filter(
                        (v) => v.status.toLowerCase() === "maintenance",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Không hoạt động (Red) */}
            <div className={`${styles.statCard} ${styles.cardRed}`}>
              <div className={styles.statContent}>
                <div
                  className={`${styles.statIconWrapper} ${styles.iconWrapperRed}`}
                >
                  <svg
                    className={`${styles.statIcon} ${styles.iconRed}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <p className={`${styles.statLabel} ${styles.labelRed}`}>
                    Không hoạt động
                  </p>
                  <p className={`${styles.statValue} ${styles.valueRed}`}>
                    {
                      vehicles.filter(
                        (v) => v.status.toLowerCase() === "inactive",
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className="py-6">
          <VehicleTable
            vehicles={tableVehicles}
            loading={loading}
            onEditVehicle={handleEditClick}
            onDeleteVehicle={handleDeleteClick}
            // [NEW] Truyền prop để bật nút Gán tuyến
            onAssignRoute={handleAssignRouteClick}
            currentPage={1}
            totalPages={1}
            totalElements={displayVehicles.length}
            onPageChange={(page) => console.log("Page change:", page)}
          />
        </div>
      </div>

      {/* Vehicle Add/Edit Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        vehicle={selectedVehicle ? convertToModalData(selectedVehicle) : null}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        vehicle={
          selectedVehicle ? convertToDeleteModalData(selectedVehicle) : null
        }
        loading={loading}
      />

      {/* Route Assignment Modal */}
      {selectedVehicleForAssignment && (
        <VehicleRouteAssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedVehicleForAssignment(null);
          }}
          vehicleId={selectedVehicleForAssignment.vehicleId}
          vehicleName={selectedVehicleForAssignment.licensePlate}
          onSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
}
