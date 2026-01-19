'use client';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PageHeader from '@/src/components/PageHeader/PageHeader';
import RouteCard from '@/feature/route/components/RouteCard/RouteCard';
import Pagination from '@/src/components/Pagination/Pagination';
import { useRoutes } from '@/feature/route/hooks/useRoutes';
import styles from './page.module.css';
import RouteModal from '@/feature/route/components/RouteModal/RouteModal';
import ConfirmDeleteModal from '@/feature/route/components/ConfirmDeleteModal/ConfirmDeleteModal';

export default function RoutesPage() {
    const {
        routes,
        loading,
        currentPage,
        totalPages,
        totalElements,
        setCurrentPage,
        handleSearch,
        isModalOpen,
        isDeleteModalOpen,
        selectedRoute,
        openAddModal,
        openEditModal,
        openDeleteModal,
        closeModal,
        handleSaveRoute,
        handleDeleteConfirm
    } = useRoutes();

    return (
        // 1. Dùng Fragment (<>...</>) bọc ngoài cùng
        <>
            {/* Đặt ToastContainer Ở ĐÂY - Nằm ngoài thẻ div style.container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Layout chính của trang bắt đầu từ đây */}
            <div className={styles.container}>

                {/* 2. Header trang */}
                <PageHeader
                    title="Quản lý Tuyến đường"
                    subtitle="Quản lý danh sách tuyến xe và các điểm dừng"
                    actionLabel="Thêm tuyến mới"
                    onAction={openAddModal}
                    showSearch={true}
                    searchPlaceholder="Tìm kiếm tuyến..."
                    onSearch={handleSearch}
                />

                {/* 3. Nội dung chính */}
                {loading ? (
                    <div className={styles.loading}>Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {/* Total routes count */}
                        {!loading && routes.length > 0 && (
                            <div style={{ 
                                padding: '12px 16px', 
                                marginBottom: '16px', 
                                backgroundColor: 'var(--background)', 
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}>
                                Tổng số: <strong>{totalElements}</strong> tuyến đường
                            </div>
                        )}

                        {routes.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                                Không tìm thấy tuyến đường nào.
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

                        {routes.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}

                {/* 4. Các Modals */}
                <RouteModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSaveRoute}
                    initialData={selectedRoute}
                    title={selectedRoute ? 'Cập nhật tuyến' : 'Thêm tuyến mới'}
                />

                <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeModal}
                    onConfirm={handleDeleteConfirm}
                    itemName={selectedRoute?.routeName}
                />
            </div>
        </>
    );
}