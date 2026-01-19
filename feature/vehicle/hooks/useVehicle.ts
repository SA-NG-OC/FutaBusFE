import { useState, useCallback, useEffect } from "react";
import { vehicleApi } from "../api/vehicleApi";
import { Vehicle, VehicleRequest } from "../types";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [routeFilter, setRouteFilter] = useState<number | undefined>(undefined);

  const fetchVehicles = useCallback(async (
    page: number = currentPage, 
    size: number = pageSize,
    status?: string,
    routeId?: number
  ) => {
    try {
      setLoading(true);
      const res = await vehicleApi.getAll(page, size, status, routeId);
      setVehicles(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load vehicles";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchVehicles(currentPage, pageSize, statusFilter, routeFilter);
  }, [currentPage, statusFilter, routeFilter]); // Remove fetchVehicles from deps to avoid loop

  const openAddModal = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id: number) => {
    setSelectedVehicle(vehicles.find(v => v.vehicleid === id) || null);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setSelectedVehicle(vehicles.find(v => v.vehicleid === id) || null);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleSaveVehicle = async (data: VehicleRequest) => {
    try {
      setLoading(true);
      if (selectedVehicle) {
        const updated = await vehicleApi.update(selectedVehicle.vehicleid, data);
        setVehicles(vs =>
          vs.map(v => (v.vehicleid === updated.vehicleid ? updated : v))
        );
      } else {
        const created = await vehicleApi.create(data);
        // Refresh current page to show new vehicle
        await fetchVehicles(currentPage, pageSize);
      }
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    await vehicleApi.delete(selectedVehicle.vehicleid);
    // Refresh current page after delete
    await fetchVehicles(currentPage, pageSize);
    closeModal();
  };

  const handlePageChange = (page: number) => {
    fetchVehicles(page, pageSize, statusFilter, routeFilter);
  };

  const handleStatusFilter = (status: string | undefined) => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handleRouteFilter = (routeId: number | undefined) => {
    setRouteFilter(routeId);
    setCurrentPage(0);
  };

  return {
    vehicles,
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    handlePageChange,

    // Filters
    statusFilter,
    routeFilter,
    handleStatusFilter,
    handleRouteFilter,

    isModalOpen,
    isDeleteModalOpen,
    selectedVehicle,

    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleSaveVehicle,
    handleDeleteConfirm,
  };
};
