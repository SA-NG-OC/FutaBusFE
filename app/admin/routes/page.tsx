'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/src/components/PageHeader/PageHeader';
import RouteCard from '@/feature/route/components/RouteCard/RouteCard';
import Pagination from '@/src/components/Pagination/Pagination';
// Components & Logic riêng của Feature Routes
import { useRoutes } from '@/feature/route/hooks/useRoutes';
import styles from './page.module.css';
// Import Modal
import RouteModal from '@/feature/route/components/RouteModal/RouteModal';
import ConfirmDeleteModal from '@/feature/route/components/ConfirmDeleteModal/ConfirmDeleteModal';

export default function RoutesPage() {
    const {
        routes, loading, error, currentPage, totalPages, setCurrentPage,
        // Lấy state từ hook
        isModalOpen, isDeleteModalOpen, selectedRoute,
        openAddModal, openEditModal, openDeleteModal, closeModal,
        handleSaveRoute, handleDeleteConfirm
    } = useRoutes();
    console.log('RoutesPage render with routes:', routes);
    return (
        <div className={styles.container}>
            <PageHeader
                title="Route Management"
                subtitle="Manage bus routes and stops"
                actionLabel="Add Route"
                onAction={openAddModal} // Mở modal thêm
            />

            {error && <div className={styles['error-message']}>{error}</div>}

            {loading ? (
                <div className={styles.loading}>Loading routes...</div>
            ) : (
                <>
                    <div className={styles['grid-list']}>
                        {routes.map((route) => (
                            <RouteCard
                                key={route.routeId}
                                data={route}
                                onEdit={openEditModal} // Mở modal sửa
                                onDelete={openDeleteModal} // Mở modal xóa
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            {/* --- MODALS --- */}

            {/* Modal Add/Edit */}
            <RouteModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSaveRoute}
                initialData={selectedRoute}
                title={selectedRoute ? 'Edit Route' : 'Add New Route'}
            />

            {/* Modal Delete Confirm */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeModal}
                onConfirm={handleDeleteConfirm}
                itemName={selectedRoute?.routeName}
            />
        </div>
    );
}