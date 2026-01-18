"use client";

import DriverCard from "@/feature/driver/components/DriverCard";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";
import { useState } from "react";

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

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-(--background) text-(--foreground)">
      <PageHeader
        title="Driver Management"
        subtitle="Manage your drivers and route assignments"
        actionLabel="Add Driver"
        onAction={() => setShowCreateModal(true)}
      />

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by name, license, email, or phone..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading && <p className="text-center py-8">Loading drivers...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {/* Driver Cards Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {drivers.map((driver) => (
              <DriverCard
                key={driver.driverId}
                driver={driver}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {drivers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No drivers found</p>
              <p className="text-gray-400 text-sm mt-2">
                {keyword ? 'Try adjusting your search terms' : 'Click "Add Driver" to create one'}
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

      {/* Modals */}
      {/* Create Driver with Account Modal */}
      <CreateDriverModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWithAccount}
      />

      {/* Edit Driver Modal (for existing drivers) */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveDriver}
        initialData={selectedDriver}
        title={selectedDriver ? "Edit Driver" : "Add New Driver"}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        driver={selectedDriver}
      />
    </div>
  );
}