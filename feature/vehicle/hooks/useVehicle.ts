import { useState, useCallback, useEffect } from "react";
import { vehicleApi } from "../api/vehicleApi";
import { Vehicle, VehicleRequest } from "../types";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await vehicleApi.getAll(0, 20);
      setVehicles(res.data.content);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

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
        setVehicles(vs => [created, ...vs]);
      }
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVehicle) return;
    await vehicleApi.delete(selectedVehicle.vehicleid);
    setVehicles(vs => vs.filter(v => v.vehicleid !== selectedVehicle.vehicleid));
    closeModal();
  };

  return {
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
  };
};
