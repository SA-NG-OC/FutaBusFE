import { useState, useCallback, useEffect } from 'react';
import { routeApi } from '../api/routeApi';
// Giả sử types import đúng
import { RouteData, RouteRequest } from '../types';

export const useRoutes = () => {
    // ... State cũ (Giữ nguyên)
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // ... State Modal (Giữ nguyên)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

    // 1. Fetch data (Giữ nguyên)
    const fetchRoutes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const jsonData = await routeApi.getAll(page, 3);
            if (jsonData.success) {
                setRoutes(jsonData.data.content);
                setTotalPages(jsonData.data.totalPages);
                setCurrentPage(jsonData.data.number);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load routes");
        } finally {
            setLoading(false);
        }
    }, []);

    // ... Handlers cho Modal (Giữ nguyên: openAdd, openEdit, openDelete, closeModal) ...
    const openAddModal = () => {
        setSelectedRoute(null);
        setIsModalOpen(true);
    };

    const openEditModal = (id: number) => {
        const route = routes.find(r => r.routeId === id) || null;
        setSelectedRoute(route);
        setIsModalOpen(true);
    };

    const openDeleteModal = (id: number) => {
        const route = routes.find(r => r.routeId === id) || null;
        setSelectedRoute(route);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedRoute(null);
    };

    // --- 2. LOGIC SAVE ĐÃ TỐI ƯU ---
    const handleSaveRoute = async (formData: RouteRequest) => {
        try {
            if (selectedRoute) {
                // === UPDATE ===
                const response = await routeApi.update(selectedRoute.routeId, formData);

                const updatedItem = (response.data || response) as unknown as RouteData;

                setRoutes((prevRoutes) =>
                    prevRoutes.map((item) =>
                        item.routeId === selectedRoute.routeId ? updatedItem : item
                    )
                );
            } else {
                // === CREATE ===
                const response = await routeApi.create(formData);

                const newItem = (response.data || response) as unknown as RouteData;

                setRoutes((prevRoutes) => [newItem, ...prevRoutes]);
            }

            closeModal();
        } catch (err: any) {
            console.error("Save failed", err);
            alert(err.message || "Failed to save route");
        }
    };

    // --- 3. LOGIC DELETE ĐÃ TỐI ƯU ---
    const handleDeleteConfirm = async () => {
        if (!selectedRoute) return;
        try {
            await routeApi.delete(selectedRoute.routeId);

            // Cập nhật state trực tiếp: Lọc bỏ item vừa xóa
            setRoutes((prevRoutes) =>
                prevRoutes.filter((item) => item.routeId !== selectedRoute.routeId)
            );

            closeModal();
            // KHÔNG GỌI fetchRoutes(currentPage) NỮA
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete route");
        }
    };

    useEffect(() => {
        fetchRoutes(currentPage);
    }, [currentPage, fetchRoutes]);

    return {
        routes, loading, error, currentPage, totalPages, setCurrentPage,
        isModalOpen, isDeleteModalOpen, selectedRoute,
        openAddModal, openEditModal, openDeleteModal, closeModal,
        handleSaveRoute, handleDeleteConfirm
    };
};