"use client";

import VehicleTable from "@/feature/vehicle/components/VehicleTable";
import { useVehicles } from "@/feature/vehicle/hooks/useVehicle";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import VehicleModal from "@/feature/vehicle/components/VehicleModal";
import ConfirmDeleteModal from "@/feature/vehicle/components/ConfirmDeleteModal";

export default function AdminVehiclesPage() {
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

  return (
    <div className="p-4 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="Vehicle Management"
        subtitle="Manage your bus fleet"
        actionLabel="Add Vehicle"
        onAction={openAddModal}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <VehicleTable
        vehicleList={vehicles}
        handleUpdate={openEditModal}
        handleDelete={openDeleteModal}
      />

      <VehicleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveVehicle}
        initialData={selectedVehicle}
        title={selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        vehiclePlate={selectedVehicle?.licenseplate || ""}
      />
    </div>
  );
}
