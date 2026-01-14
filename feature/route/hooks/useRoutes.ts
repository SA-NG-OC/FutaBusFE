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

    // ===== SEARCH STATE (Mới) =====
    const [keyword, setKeyword] = useState<string>("");

    // ===== MODAL STATE =====
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

    // ===== FETCH ROUTES (Cập nhật nhận thêm keyword) =====
    const fetchRoutes = useCallback(async (page: number, searchKw: string) => {
        try {
            setLoading(true);
            setError(null);

            // Gọi API với keyword (nếu có)
            // Lưu ý: Đảm bảo routeApi.getAll đã được sửa để nhận tham số thứ 3 là keyword
            const pageData = await routeApi.getAll(page, 10, searchKw);

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

    // ===== SEARCH HANDLER (Mới) =====
    const handleSearch = (value: string) => {
        setKeyword(value);
        setCurrentPage(0); // Reset về trang đầu tiên khi tìm kiếm
        // Lưu ý: Nếu muốn tối ưu, bạn có thể dùng debounce ở đây để tránh gọi API liên tục
    };

    // ===== MODAL CONTROLS (Giữ nguyên) =====
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

    // ===== SAVE (CREATE / UPDATE) (Giữ nguyên) =====
    const handleSaveRoute = async (formData: RouteRequest) => {
        try {
            setLoading(true);
            setError(null);
            if (selectedRoute) {
                const updatedRoute = await routeApi.update(selectedRoute.routeId, formData);
                setRoutes(prev => prev.map(r => r.routeId === selectedRoute.routeId ? updatedRoute : r));
            } else {
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

    // ===== DELETE (Giữ nguyên) =====
    const handleDeleteConfirm = async () => {
        if (!selectedRoute) return;
        try {
            setLoading(true);
            setError(null);
            await routeApi.delete(selectedRoute.routeId);
            setRoutes(prev => prev.filter(r => r.routeId !== selectedRoute.routeId));
            closeModal();
        } catch (err: any) {
            console.error("Delete route failed", err);
            setError(err.message || "Failed to delete route");
        } finally {
            setLoading(false);
        }
    };

    // ===== INITIAL LOAD & PAGE CHANGE & SEARCH =====
    // useEffect sẽ chạy khi currentPage HOẶC keyword thay đổi
    useEffect(() => {
        // Có thể thêm setTimeout (debounce) ở đây nếu muốn đợi user gõ xong mới search
        const timer = setTimeout(() => {
            fetchRoutes(currentPage, keyword);
        }, 300); // Delay 300ms để tránh spam API khi gõ phím

        return () => clearTimeout(timer);
    }, [currentPage, keyword, fetchRoutes]);

    return {
        // data
        routes,
        loading,
        error,

        // pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // search (Mới)
        keyword,
        handleSearch,

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