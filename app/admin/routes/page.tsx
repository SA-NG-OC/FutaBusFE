'use client';

import React from 'react';
import PageHeader from '@/src/components/PageHeader/PageHeader';
import RouteCard from '@/feature/route/components/RouteCard/RouteCard';
import Pagination from '@/src/components/Pagination/Pagination';
import { useRoutes } from '@/feature/route/hooks/useRoutes';
import styles from './page.module.css';
import RouteModal from '@/feature/route/components/RouteModal/RouteModal';
import ConfirmDeleteModal from '@/feature/route/components/ConfirmDeleteModal/ConfirmDeleteModal';

export default function RoutesPage() {
    const {
        routes, loading, error, currentPage, totalPages, setCurrentPage,
        handleSearch,
        isModalOpen, isDeleteModalOpen, selectedRoute,
        openAddModal, openEditModal, openDeleteModal, closeModal,
        handleSaveRoute, handleDeleteConfirm
    } = useRoutes();

    return (
        <div className={styles.container}>
            <PageHeader
                title="Route Management"
                subtitle="Manage bus routes and stops"
                actionLabel="Add Route"
                onAction={openAddModal}

                // --- Cấu hình Search ---
                showSearch={true} // Bật thanh tìm kiếm
                searchPlaceholder="Search routes..." // Placeholder tùy chỉnh
                onSearch={handleSearch} // Hàm xử lý khi gõ phím
            />

            {error && <div className={styles['error-message']}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading routes...</div>
            ) : (
                <>
                    {/* Kiểm tra nếu không có dữ liệu */}
                    {routes.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                            No routes found.
                        </div>
                    ) : (
                        <div className={styles['grid-list']}>
                            {routes.map((route) => (
                                <RouteCard
                                    key={route.routeId}
                                    data={route}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                />
                            ))}
                        </div>
                    )}

                    {/* Chỉ hiện phân trang nếu có dữ liệu */}
                    {routes.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            {/* --- MODALS --- */}
            <RouteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSaveRoute}
                initialData={selectedRoute}
                title={selectedRoute ? 'Edit Route' : 'Add New Route'}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteConfirm}
                itemName={selectedRoute?.routeName}
            />
        </div>
    );
}