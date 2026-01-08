import { useState, useCallback, useEffect } from "react";
import { routeApi } from "../api/routeApi";
import { RouteData, RouteRequest } from "../types";

export const useRoutes = () => {
    // ===== DATA STATE =====
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ===== PAGINATION =====
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // ===== MODAL STATE =====
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

    // ===== FETCH ROUTES =====
    const fetchRoutes = useCallback(async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const pageData = await routeApi.getAll(page, 10);

            setRoutes(pageData.data.content);
            setTotalPages(pageData.data.totalPages);
            setCurrentPage(pageData.data.number);

        } catch (err: any) {
            console.error("Fetch routes failed", err);
            setError(err.message || "Failed to load routes");
        } finally {
            setLoading(false);
        }
    }, []);

    // ===== MODAL CONTROLS =====
    const openAddModal = () => {
        setSelectedRoute(null);
        setIsModalOpen(true);
    };

    const openEditModal = (routeId: number) => {
        const route = routes.find(r => r.routeId === routeId) || null;
        setSelectedRoute(route);
        setIsModalOpen(true);
    };

    const openDeleteModal = (routeId: number) => {
        const route = routes.find(r => r.routeId === routeId) || null;
        setSelectedRoute(route);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedRoute(null);
    };

    // ===== SAVE (CREATE / UPDATE) =====
    const handleSaveRoute = async (formData: RouteRequest) => {
        try {
            setLoading(true);
            setError(null);

            if (selectedRoute) {
                // === UPDATE ===
                const updatedRoute = await routeApi.update(
                    selectedRoute.routeId,
                    formData
                );

                setRoutes(prev =>
                    prev.map(route =>
                        route.routeId === selectedRoute.routeId
                            ? updatedRoute
                            : route
                    )
                );
            } else {
                // === CREATE ===
                const newRoute = await routeApi.create(formData);

                setRoutes(prev => [newRoute, ...prev]);
            }

            closeModal();
        } catch (err: any) {
            console.error("Save route failed", err);
            setError(err.message || "Failed to save route");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ===== DELETE =====
    const handleDeleteConfirm = async () => {
        if (!selectedRoute) return;

        try {
            setLoading(true);
            setError(null);

            await routeApi.delete(selectedRoute.routeId);

            setRoutes(prev =>
                prev.filter(route => route.routeId !== selectedRoute.routeId)
            );

            closeModal();
        } catch (err: any) {
            console.error("Delete route failed", err);
            setError(err.message || "Failed to delete route");
        } finally {
            setLoading(false);
        }
    };

    // ===== INITIAL LOAD & PAGE CHANGE =====
    useEffect(() => {
        fetchRoutes(currentPage);
    }, [currentPage, fetchRoutes]);

    return {
        // data
        routes,
        loading,
        error,

        // pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // modal state
        isModalOpen,
        isDeleteModalOpen,
        selectedRoute,

        // actions
        openAddModal,
        openEditModal,
        openDeleteModal,
        closeModal,
        handleSaveRoute,
        handleDeleteConfirm,
        fetchRoutes,
    };
};
