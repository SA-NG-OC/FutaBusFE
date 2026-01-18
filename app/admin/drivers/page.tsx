"use client";

import React, { useState } from "react";
import DriverCard from "@/feature/driver/components/DriverCard";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";
import styles from "./AdminDriversPage.module.css";

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
    <div className={styles.pageContainer}>
      <PageHeader
        title="Quản lý tài xế"
        subtitle="Quản lý thông tin tài xế và phân công tuyến"
        actionLabel="Thêm tài xế"
        onAction={() => setShowCreateModal(true)}
      />

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, bằng lái, email hoặc SĐT..."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading && <p className={styles.loadingText}>Đang tải danh sách...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {/* Driver Cards Grid */}
      {!loading && !error && (
        <>
          <div className={styles.grid}>
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
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Không tìm thấy tài xế nào</p>
              <p className={styles.emptySubtitle}>
                {keyword
                  ? "Thử thay đổi từ khóa tìm kiếm"
                  : 'Nhấn "Thêm tài xế" để tạo mới'}
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
      <CreateDriverModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWithAccount}
      />

      <DriverModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveDriver}
        initialData={selectedDriver}
        title={selectedDriver ? "Chỉnh sửa thông tin" : "Thêm tài xế mới"}
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
