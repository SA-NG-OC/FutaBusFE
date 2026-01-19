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
    // [FIX] Dùng bg-[var(--background)] để đồng bộ với globals.css
    <div className="min-h-screen text-[var(--foreground)] transition-colors duration-200">
      {/* PageHeader bây giờ trong suốt nên sẽ hiện màu nền của thẻ div cha */}
      <PageHeader
        title="Quản lý nhân viên"
        subtitle="Quản lý tài khoản và phân quyền nhân viên"
        actionLabel="Thêm nhân viên"
        onAction={openCreateModal}
      />

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[var(--border-gray)] bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder-[var(--text-secondary)] transition-colors"
        />
      </div>

      {loading && (
        <p className="text-center py-12 text-[var(--text-secondary)]">
          Đang tải dữ liệu...
        </p>
      )}
      {error && (
        <p className="text-[var(--primary)] text-center py-4">{error}</p>
      )}

      {/* Employee Cards Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.userId}
                employee={employee}
                onEdit={() => { }}
                onDelete={openDeleteModal}
              />
            ))}
          </div>

          {employees.length === 0 && (
            <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-gray)] border-dashed">
              <p className="text-[var(--text-secondary)] text-lg">
                Không tìm thấy nhân viên nào
              </p>
              <p className="text-[var(--text-secondary)] opacity-70 text-sm mt-2">
                {keyword
                  ? "Hãy thử thay đổi từ khóa tìm kiếm"
                  : 'Nhấn "Thêm nhân viên" để tạo tài khoản mới'}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center pb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
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
