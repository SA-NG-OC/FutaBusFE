import { useState, useCallback, useEffect } from 'react';
import { employeeApi, Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../api/employeeApi';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search
  const [keyword, setKeyword] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Fetch employees
  const fetchEmployees = useCallback(async (page: number, searchKw: string) => {
    try {
      setLoading(true);
      setError(null);

      const pageData = await employeeApi.getAll(page, 20, searchKw);

      setEmployees(pageData.content);
      setTotalPages(pageData.totalPages);
      setCurrentPage(pageData.number);
    } catch (err) {
      console.error('Fetch employees failed', err);
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(currentPage, keyword);
  }, [currentPage, keyword, fetchEmployees]);

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
  const openCreateModal = () => {
    setSelectedEmployee(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedEmployee(null);
  };

  // Create employee with account
  const handleCreate = async (data: CreateEmployeeRequest, avatarFile?: File) => {
    try {
      await employeeApi.create(data, avatarFile);
      closeModal();
      fetchEmployees(currentPage, keyword);
    } catch (err) {
      console.error('Create employee failed', err);
      throw err;
    }
  };

  // Update employee
  const handleUpdate = async (data: UpdateEmployeeRequest) => {
    if (!selectedEmployee) return;

    try {
      await employeeApi.update(selectedEmployee.userId, data);
      closeModal();
      fetchEmployees(currentPage, keyword);
    } catch (err) {
      console.error('Update employee failed', err);
      throw err;
    }
  };

  // Delete employee
  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    try {
      await employeeApi.delete(selectedEmployee.userId);
      closeModal();
      fetchEmployees(currentPage, keyword);
    } catch (err) {
      console.error('Delete employee failed', err);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    currentPage,
    totalPages,
    keyword,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedEmployee,
    handleSearch,
    handlePageChange,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModal,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
  };
};
