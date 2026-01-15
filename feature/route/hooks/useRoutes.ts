import { useState, useCallback, useEffect } from "react";
import { routeApi } from "../api/routeApi";
import { RouteData, RouteRequest } from "../types";
import { toast } from 'react-toastify';

export const useRoutes = () => {
    // ===== DATA STATE =====
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // Bỏ state 'error' text thuần túy vì giờ dùng Toast, 
    // nhưng nếu bạn muốn giữ để debug thì cứ giữ.
    const [error, setError] = useState<string | null>(null);

    // ===== PAGINATION & SEARCH =====
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>("");

    // ===== MODAL STATE =====
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

    // ===== FETCH ROUTES =====
    const fetchRoutes = useCallback(async (page: number, searchKw: string) => {
        try {
            setLoading(true);
            setError(null);

            const pageData = await routeApi.getAll(page, 10, searchKw);

            // Logic map dữ liệu giữ nguyên như cũ
            setRoutes(pageData.data.content);
            setTotalPages(pageData.data.totalPages);
            setCurrentPage(pageData.data.number);

        } catch (err: any) {
            console.error("Fetch routes failed", err);
            // Với lỗi load danh sách, có thể dùng toast hoặc hiện text đều được
            // Ở đây mình dùng text error để hiện ở giữa màn hình nếu list trống
            setError(err.message || "Failed to load routes");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSearch = (value: string) => {
        setKeyword(value);
        setCurrentPage(0);
    };

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

            if (selectedRoute) {
                // Update
                const updatedRoute = await routeApi.update(selectedRoute.routeId, formData);
                setRoutes(prev => prev.map(r => r.routeId === selectedRoute.routeId ? updatedRoute : r));
                toast.success("Route updated successfully!");
            } else {
                // Create
                const newRoute = await routeApi.create(formData);
                setRoutes(prev => [newRoute, ...prev]);
                toast.success("New route created successfully!");
            }

            closeModal();
        } catch (err: any) {
            console.error("Save route failed", err);

            // err.message lúc này đã chứa danh sách lỗi chi tiết từ hàm extractErrorMessage
            // Ví dụ: "Destination name must not be blank\nOrigin name must not be blank"
            toast.error(err.message);

            // Ném lỗi tiếp để Component Modal biết mà KHÔNG đóng cửa sổ
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

            await routeApi.delete(selectedRoute.routeId);
            setRoutes(prev => prev.filter(r => r.routeId !== selectedRoute.routeId));

            toast.success("Route deleted successfully!");
            closeModal();
        } catch (err: any) {
            console.error("Delete route failed", err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ===== EFFECT =====
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRoutes(currentPage, keyword);
        }, 300);

        return () => clearTimeout(timer);
    }, [currentPage, keyword, fetchRoutes]);

    return {
        routes,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        keyword,
        handleSearch,
        isModalOpen,
        isDeleteModalOpen,
        selectedRoute,
        openAddModal,
        openEditModal,
        openDeleteModal,
        closeModal,
        handleSaveRoute,
        handleDeleteConfirm,
        fetchRoutes,
    };
};