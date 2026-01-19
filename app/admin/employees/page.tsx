"use client";

import { useEmployees } from "@/feature/employee/hooks/useEmployees";
import CreateEmployeeModal from "@/feature/employee/components/CreateEmployeeModal";
import EmployeeCard from "@/feature/employee/components/EmployeeCard";
import ConfirmDeleteModal from "@/feature/employee/components/ConfirmDeleteModal";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";

export default function AdminEmployeesPage() {
  const {
    employees,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    keyword,
    isCreateModalOpen,
    isDeleteModalOpen,
    selectedEmployee,
    handleSearch,
    handlePageChange,
    openCreateModal,
    openDeleteModal,
    closeModal,
    handleCreate,
    handleDeleteConfirm,
  } = useEmployees();

  return (
    <div className="p-4 min-h-screen bg-(--background) text-(--foreground)">
      <PageHeader
        title="Employee Management"
        subtitle="Manage staff accounts and permissions"
        actionLabel="Add Employee"
        onAction={openCreateModal}
      />

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Total employees count */}
      {!loading && employees.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
          Tổng số: <strong>{totalElements}</strong> nhân viên
        </div>
      )}

      {loading && <p className="text-center py-8">Loading employees...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {/* Employee Cards Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.userId}
                employee={employee}
                onEdit={() => {}} // TODO: Implement edit functionality
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {employees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No employees found</p>
              <p className="text-gray-400 text-sm mt-2">
                {keyword ? 'Try adjusting your search terms' : 'Click "Add Employee" to create one'}
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
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        onSubmit={handleCreate}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        employee={selectedEmployee}
      />
    </div>
  );
}