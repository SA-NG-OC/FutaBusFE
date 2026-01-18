"use client";
import React, { useState, useEffect } from "react";
import { useVehicles } from "@/feature/vehicle/hooks/useVehicle";
import { Vehicle, VehicleRequest, VehicleType } from "@/feature/vehicle/types";
import VehicleTable from "@/feature/vehicle/components/VehicleTable/VehicleTable";
import VehicleModal from "@/feature/vehicle/components/VehicleModal/VehicleModal";
import ConfirmDeleteModal from "@/feature/vehicle/components/ConfirmDeleteModal/ConfirmDeleteModal";
import VehicleRouteAssignmentModal from "@/feature/vehicle/components/VehicleRouteAssignmentModal/VehicleRouteAssignmentModal";
import { vehicleRouteAssignmentApi } from "@/feature/vehicle/api/vehicleRouteAssignmentApi";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";

// Type adapters to bridge API types with component types
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

// Mock vehicle types - TODO: Fetch from API
const vehicleTypes: VehicleType[] = [
  { typeId: 1, typeName: "Limousine", capacity: 34 },
  { typeId: 2, typeName: "Giường nằm", capacity: 40 },
  { typeId: 3, typeName: "Ghế ngồi", capacity: 45 },
  { typeId: 4, typeName: "Limousine 34 Phòng", capacity: 34 },
  { typeId: 5, typeName: "Xe buýt", capacity: 50 },
];

// Helper function to get vehicle type info
const getVehicleTypeInfo = (typeId: number) => {
  return (
    vehicleTypes.find((type) => type.typeId === typeId) || {
      typeName: "Unknown",
      capacity: 0,
    }
  );
};

// Convert API Vehicle to VehicleTable format
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
    createdAt: new Date().toISOString(), // Fallback since API doesn't provide this
  };
};

// Convert API Vehicle to VehicleModal format
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

// Convert API Vehicle to ConfirmDeleteModal format (requires vehicleId)
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

// Convert VehicleModal data to API request format
const convertToApiRequest = (data: VehicleModalData): VehicleRequest => ({
  licensePlate: data.licensePlate,
  typeId: data.typeId,
  insuranceNumber: data.insuranceNumber,
  insuranceExpiry: data.insuranceExpiry,
  status: mapComponentStatusToApiStatus(data.status),
});

// Status mapping functions
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
    // Fallback for Vietnamese values
    case "hoàn thiện":
      return "ACTIVE";
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

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedVehicleForAssignment, setSelectedVehicleForAssignment] = useState<{ vehicleId: number; licensePlate: string } | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

  // Filter vehicles by route when selectedRouteId changes
  useEffect(() => {
    let cancelled = false;

    const filterVehiclesByRoute = async () => {
      if (!selectedRouteId) return;

      try {
        const assignments = await vehicleRouteAssignmentApi.getByRoute(selectedRouteId);
        const vehicleIds = assignments.map((a) => a.vehicleId);
        const filtered = vehicles.filter((v) => vehicleIds.includes(v.vehicleid));
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

  const displayVehicles = selectedRouteId ? filteredVehicles : vehicles;
  const tableVehicles = displayVehicles.map(convertToTableData);

  // Handle edit vehicle click
  const handleEditClick = (tableVehicle: VehicleTableData) => {
    openEditModal(tableVehicle.vehicleId);
  };

  // Handle delete vehicle click
  const handleDeleteClick = (vehicleId: number) => {
    openDeleteModal(vehicleId);
  };

  // Handle save vehicle from modal
  const handleModalSave = async (modalData: VehicleModalData) => {
    const apiData = convertToApiRequest(modalData);
    await handleSaveVehicle(apiData);
  };

  // Handle assign route click
  const handleAssignRouteClick = (vehicleId: number) => {
    const vehicle = tableVehicles.find(v => v.vehicleId === vehicleId);
    if (vehicle) {
      setSelectedVehicleForAssignment({ 
        vehicleId: vehicle.vehicleId, 
        licensePlate: vehicle.licensePlate 
      });
      setShowAssignmentModal(true);
    }
  };

  const handleAssignmentSuccess = () => {
    // Trigger re-fetch by updating a dependency
    // The useEffect will automatically re-run when vehicles change
  };

  // Error display component
  if (error) {
    return (
      <div>
        <PageHeader
          title="Quản lý xe"
          subtitle="Quản lý thông tin xe và tài xế"
        />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
          <div className="flex items-center">
            <div className="text-red-600 dark:text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Lỗi tải dữ liệu
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Quản lý xe"
        subtitle="Quản lý thông tin xe và tài xế trong hệ thống"
        actionLabel="Thêm xe mới"
        onAction={openAddModal}
      />

      {/* Route Filter */}
      <div className="px-6 mb-6">
        <RouteFilter
          onRouteSelect={setSelectedRouteId}
          selectedRouteId={selectedRouteId}
          placeholder="Tất cả tuyến đường"
        />
        {selectedRouteId && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Hiển thị <span className="font-bold">{displayVehicles.length}</span> xe được gắn vào tuyến đã chọn
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6">
        <div>
          {/* Statistics Cards */}
          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-600 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-600 dark:bg-blue-900/40 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-extrabold text-white dark:text-blue-300">
                      Tổng số xe
                    </p>
                    <p className="text-2xl font-extrabold text-white dark:text-blue-100">
                      {vehicles.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-700 dark:bg-green-900/40 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white dark:text-green-400"
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
                  <div className="ml-3">
                    <p className="text-sm font-extrabold text-white dark:text-green-300">
                      Đang hoạt động
                    </p>
                    <p className="text-2xl font-extrabold text-white dark:text-green-100">
                      {
                        vehicles.filter(
                          (v) => v.status.toLowerCase() === "operational",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-600 dark:bg-yellow-900/40 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white dark:text-yellow-400"
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
                  <div className="ml-3">
                    <p className="text-sm font-extrabold text-white dark:text-yellow-300">
                      Bảo trì
                    </p>
                    <p className="text-2xl font-extrabold text-white dark:text-yellow-100">
                      {
                        vehicles.filter(
                          (v) => v.status.toLowerCase() === "maintenance",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 dark:bg-red-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-700 dark:bg-red-900/40 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white dark:text-red-400"
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
                  <div className="ml-3">
                    <p className="text-sm font-extrabold text-white dark:text-red-300">
                      Không hoạt động
                    </p>
                    <p className="text-2xl font-extrabold text-white dark:text-red-100">
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
              onAssignRoute={handleAssignRouteClick}
              currentPage={1}
              totalPages={1}
              totalElements={displayVehicles.length}
              onPageChange={(page) => {
                console.log("Page change:", page);
              }}
            />
          </div>
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
