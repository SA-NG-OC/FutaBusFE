"use client";

import DriverCard from "@/feature/driver/components/DriverCard";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
import DriverRouteAssignmentModal from "@/feature/driver/components/DriverRouteAssignmentModal/DriverRouteAssignmentModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
import { driverRouteAssignmentApi } from "@/feature/driver/api/driverRouteAssignmentApi";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";
import { useState, useEffect } from "react";
import { Driver } from "@/feature/driver/api/driverApi";

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
    fetchDrivers
  } = useDrivers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] = useState<{id: number, name: string} | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [driversWithRoutes, setDriversWithRoutes] = useState<Driver[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Fetch assigned routes for all drivers
  useEffect(() => {
    const fetchAssignedRoutes = async () => {
      if (!drivers.length) return;
      
      setLoadingRoutes(true);
      try {
        const driversWithRoutesData = await Promise.all(
          drivers.map(async (driver) => {
            try {
              const assignments = await driverRouteAssignmentApi.getByDriver(driver.driverId);
              const activeRoutes = assignments
                .filter(a => {
                  // Check if assignment is active (between start and end date)
                  const startDate = new Date(a.startDate);
                  const endDate = a.endDate ? new Date(a.endDate) : null;
                  const today = new Date();
                  return startDate <= today && (!endDate || endDate >= today);
                })
                .map(a => ({
                  assignmentId: a.assignmentId,
                  routeId: a.routeId,
                  routeName: a.routeName,
                  origin: a.origin,
                  destination: a.destination,
                  preferredRole: a.preferredRole,
                  priority: a.priority,
                  startDate: a.startDate,
                  endDate: a.endDate
                }));
              return { ...driver, activeRoutes };
            } catch (error) {
              console.error(`Error fetching routes for driver ${driver.driverId}:`, error);
              return { ...driver, activeRoutes: [] };
            }
          })
        );
        setDriversWithRoutes(driversWithRoutesData);
      } catch (error) {
        console.error('Error fetching driver routes:', error);
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchAssignedRoutes();
  }, [drivers]);

  // Only filter when route selection changes or when explicitly needed
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
      const assignments = await driverRouteAssignmentApi.getByRoute(selectedRouteId);
      const driverIds = assignments.map(a => a.driverId);
      const filtered = driversWithRoutes.filter(d => driverIds.includes(d.driverId));
      setFilteredDrivers(filtered);
    } catch (error) {
      console.error('Error filtering drivers:', error);
      setFilteredDrivers([]);
    }
  };

  const handleAssignRoute = (driverId: number, driverName: string) => {
    setSelectedDriverForAssignment({ id: driverId, name: driverName });
    setShowAssignmentModal(true);
  };

  const handleAssignmentSuccess = async () => {
    // Re-filter after assignment is created
    if (selectedRouteId) {
      await filterDriversByRoute();
    }
  };

  const displayDrivers = selectedRouteId ? filteredDrivers : driversWithRoutes;

  return (
    <div>
      <PageHeader
        title="Driver Management"
        subtitle="Manage your drivers and route assignments"
        actionLabel="Add Driver"
        onAction={() => setShowCreateModal(true)}
      />

      {/* Filters Row */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, license, email, or phone..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Route Filter */}
        <RouteFilter
          onRouteSelect={setSelectedRouteId}
          selectedRouteId={selectedRouteId}
          placeholder="Tất cả tuyến đường"
        />
      </div>

      {/* Statistics */}
      {selectedRouteId && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Hiển thị <span className="font-bold">{displayDrivers.length}</span> tài xế được gắn vào tuyến đã chọn
          </p>
        </div>
      )}

      {loading && <p className="text-center py-8">Loading drivers...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {/* Driver Cards Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {displayDrivers.map((driver) => (
              <div key={driver.driverId} className="relative">
                <DriverCard
                  driver={driver}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
                <button
                  onClick={() => handleAssignRoute(driver.driverId, driver.fullName)}
                  className="absolute top-2 right-2 px-3 py-1 text-xs bg-primary hover:bg-primary/90 
                           text-white rounded-lg shadow-md transition-colors"
                >
                  Gắn tuyến
                </button>
              </div>
            ))}
          </div>

          {displayDrivers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {selectedRouteId ? 'Không có tài xế nào được gắn vào tuyến này' : 'No drivers found'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {keyword ? 'Try adjusting your search terms' : selectedRouteId ? 'Hãy gắn tài xế vào tuyến này' : 'Click "Add Driver" to create one'}
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

      {/* Route Assignment Modal */}
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