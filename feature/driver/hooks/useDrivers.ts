import { useState, useCallback, useEffect } from 'react';
import { driverApi, Driver, DriverRequest, CreateDriverWithAccountRequest } from '../api/driverApi';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search
  const [keyword, setKeyword] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [routeFilter, setRouteFilter] = useState<number | undefined>(undefined);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Fetch drivers
  const fetchDrivers = useCallback(async (
    page: number, 
    searchKw: string,
    status?: string,
    routeId?: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const pageData = await driverApi.getAll(page, 20, searchKw, status, routeId);

      setDrivers(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
      setCurrentPage(pageData.number);
    } catch (err) {
      console.error('Fetch drivers failed', err);
      setError(err instanceof Error ? err.message : 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage, keyword, statusFilter, routeFilter);
  }, [currentPage, keyword, statusFilter, routeFilter]); // Remove fetchDrivers from deps

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
      fetchDrivers(currentPage, keyword, statusFilter, routeFilter);
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
      fetchDrivers(currentPage, keyword, statusFilter, routeFilter);
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
      fetchDrivers(currentPage, keyword, statusFilter, routeFilter);
    } catch (err) {
      console.error('Create driver with account failed', err);
      throw err;
    }
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
    drivers,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    keyword,
    
    // Filters
    statusFilter,
    routeFilter,
    handleStatusFilter,
    handleRouteFilter,
    
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
    fetchDrivers,
  };
};
