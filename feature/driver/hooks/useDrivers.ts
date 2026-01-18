import { useState, useCallback, useEffect } from 'react';
import { driverApi, Driver, DriverRequest, CreateDriverWithAccountRequest } from '../api/driverApi';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [keyword, setKeyword] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Fetch drivers
  const fetchDrivers = useCallback(async (page: number, searchKw: string) => {
    try {
      setLoading(true);
      setError(null);

      const pageData = await driverApi.getAll(page, 20, searchKw);

      setDrivers(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
    } catch (err) {
      console.error('Fetch drivers failed', err);
      setError(err instanceof Error ? err.message : 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage, keyword);
  }, [currentPage, keyword, fetchDrivers]);

  // Search
  const handleSearch = (value: string) => {
    setKeyword(value);
    setCurrentPage(0);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Modal actions
  const openAddModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const openDeleteModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedDriver(null);
  };

  // Save driver (create or update)
  const handleSaveDriver = async (data: DriverRequest) => {
    try {
      if (selectedDriver) {
        await driverApi.update(selectedDriver.driverId, data);
      } else {
        await driverApi.create(data);
      }

      closeModal();
      fetchDrivers(currentPage, keyword);
    } catch (err) {
      console.error('Save driver failed', err);
      throw err;
    }
  };

  // Delete driver
  const handleDeleteConfirm = async () => {
    if (!selectedDriver) return;

    try {
      await driverApi.delete(selectedDriver.driverId);
      closeModal();
      fetchDrivers(currentPage, keyword);
    } catch (err) {
      console.error('Delete driver failed', err);
      throw err;
    }
  };

  // Create driver with account
  const handleCreateWithAccount = async (data: CreateDriverWithAccountRequest, avatarFile?: File) => {
    try {
      await driverApi.createWithAccount(data, avatarFile);
      closeModal();
      fetchDrivers(currentPage, keyword);
    } catch (err) {
      console.error('Create driver with account failed', err);
      throw err;
    }
  };

  return {
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
  };
};
