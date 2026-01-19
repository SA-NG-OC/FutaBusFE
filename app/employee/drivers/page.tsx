"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DriverModal from "@/feature/driver/components/DriverModal";
import CreateDriverModal from "@/feature/driver/components/CreateDriverModal";
import ConfirmDeleteModal from "@/feature/driver/components/ConfirmDeleteModal";
// [NEW] Import Modal gán tuyến
import DriverRouteAssignmentModal from "@/feature/driver/components/DriverRouteAssignmentModal/DriverRouteAssignmentModal";
import { useDrivers } from "@/feature/driver/hooks/useDrivers";
// [NEW] Import API và Filter
import { driverRouteAssignmentApi } from "@/feature/driver/api/driverRouteAssignmentApi";
import RouteFilter from "@/src/components/RouteFilter/RouteFilter";
import { Driver } from "@/feature/driver/api/driverApi";

import PageHeader from "@/src/components/PageHeader/PageHeader";
import Pagination from "@/src/components/Pagination/Pagination";
import styles from "./AdminDriversPage.module.css";

// --- Helper Functions (Mang từ DriverCard sang) ---
const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

const isLicenseExpiringSoon = (expiryDateString: string) => {
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
};

const isLicenseExpired = (expiryDateString: string) => {
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    return expiryDate < today;
};

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

    // --- STATE CHO TÍNH NĂNG GÁN TUYẾN ---
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedDriverForAssignment, setSelectedDriverForAssignment] =
        useState<{ id: number; name: string } | null>(null);
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

    // State quản lý danh sách filter
    const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
    const [driversWithRoutes, setDriversWithRoutes] = useState<Driver[]>([]);
    const [loadingRoutes, setLoadingRoutes] = useState(false);

    // --- LOGIC FETCH ROUTE & FILTER ---
    useEffect(() => {
        const fetchAssignedRoutes = async () => {
            if (!drivers.length) return;

            setLoadingRoutes(true);
            try {
                const driversWithRoutesData = await Promise.all(
                    drivers.map(async (driver) => {
                        try {
                            const assignments = await driverRouteAssignmentApi.getByDriver(
                                driver.driverId
                            );
                            const activeRoutes = assignments
                                .filter((a) => {
                                    const startDate = new Date(a.startDate);
                                    const endDate = a.endDate ? new Date(a.endDate) : null;
                                    const today = new Date();
                                    return startDate <= today && (!endDate || endDate >= today);
                                })
                                .map((a) => ({
                                    assignmentId: a.assignmentId,
                                    routeId: a.routeId,
                                    routeName: a.routeName,
                                    origin: a.origin,
                                    destination: a.destination,
                                    preferredRole: a.preferredRole,
                                    priority: a.priority,
                                    startDate: a.startDate,
                                    endDate: a.endDate,
                                }));
                            return { ...driver, activeRoutes };
                        } catch (error) {
                            console.error(
                                `Error fetching routes for driver ${driver.driverId}:`,
                                error
                            );
                            return { ...driver, activeRoutes: [] };
                        }
                    })
                );
                setDriversWithRoutes(driversWithRoutesData);
            } catch (error) {
                console.error("Error fetching driver routes:", error);
            } finally {
                setLoadingRoutes(false);
            }
        };

        fetchAssignedRoutes();
    }, [drivers]);

    // Filter logic
    useEffect(() => {
        if (selectedRouteId) {
            filterDriversByRoute();
        } else {
            setFilteredDrivers(driversWithRoutes);
        }
    }, [selectedRouteId, driversWithRoutes]);

    const filterDriversByRoute = async () => {
        if (!selectedRouteId) {
            setFilteredDrivers(driversWithRoutes);
            return;
        }
        try {
            const assignments = await driverRouteAssignmentApi.getByRoute(
                selectedRouteId
            );
            const driverIds = assignments.map((a) => a.driverId);
            const filtered = driversWithRoutes.filter((d) =>
                driverIds.includes(d.driverId)
            );
            setFilteredDrivers(filtered);
        } catch (error) {
            console.error("Error filtering drivers:", error);
            setFilteredDrivers([]);
        }
    };

    const handleAssignRoute = (driverId: number, driverName: string) => {
        setSelectedDriverForAssignment({ id: driverId, name: driverName });
        setShowAssignmentModal(true);
    };

    const handleAssignmentSuccess = async () => {
        if (selectedRouteId) {
            await filterDriversByRoute();
        }
    };

    // Quyết định danh sách hiển thị
    const displayDrivers = selectedRouteId ? filteredDrivers : driversWithRoutes;

    // Render Status Badge Function
    const renderStatusBadge = (status: string) => {
        let bgClass = "bg-[var(--bg-secondary)] text-[var(--text-secondary)]";
        const s = status.toLowerCase();

        if (s === "active") {
            bgClass = "bg-[var(--status-active-bg)] text-[var(--status-active-text)]";
        } else if (s === "on leave") {
            bgClass = "bg-[var(--stat-orange-bg)] text-[var(--stat-orange-text)]";
        } else if (s === "inactive") {
            bgClass = "bg-[var(--badge-cancelled-bg)] text-[var(--badge-cancelled-text)]";
        }

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${bgClass}`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className={styles.pageContainer}>
            <PageHeader
                title="Quản lý tài xế"
                subtitle="Quản lý thông tin tài xế và phân công tuyến"
                actionLabel="Thêm tài xế"
                onAction={() => setShowCreateModal(true)}
            />

            {/* --- FILTER SECTION --- */}
            <div className={styles.filterContainer}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, bằng lái, email hoặc SĐT..."
                        value={keyword}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.routeFilterBox}>
                    <RouteFilter
                        onRouteSelect={setSelectedRouteId}
                        selectedRouteId={selectedRouteId}
                        placeholder="Tất cả tuyến đường"
                    />
                </div>
            </div>

            {/* --- STATISTICS --- */}
            {selectedRouteId && (
                <div className={styles.statsBox}>
                    <p className={styles.statsText}>
                        Hiển thị{" "}
                        <span className={styles.statsHighlight}>
                            {displayDrivers.length}
                        </span>{" "}
                        tài xế thuộc tuyến đang chọn
                    </p>
                </div>
            )}

            {loading && <p className={styles.loadingText}>Đang tải danh sách...</p>}
            {error && <p className={styles.errorText}>{error}</p>}

            {/* --- DRIVER TABLE (Thay thế Grid Card) --- */}
            {!loading && !error && (
                <div className="w-full">
                    {/* Table Container với border và background từ variable */}
                    <div className="overflow-x-auto rounded-lg border border-[var(--border-gray)] bg-[var(--background-paper)] shadow-sm">
                        <table className="w-full border-collapse text-sm text-left">
                            <thead>
                                <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] uppercase tracking-wider text-xs border-b border-[var(--border-gray)]">
                                    <th className="px-4 py-3 font-semibold">Tài xế</th>
                                    <th className="px-4 py-3 font-semibold">Liên hệ</th>
                                    <th className="px-4 py-3 font-semibold">Bằng lái</th>
                                    <th className="px-4 py-3 font-semibold">Tuyến đang chạy</th>
                                    <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-gray)]">
                                {displayDrivers.map((driver) => {
                                    const expired = isLicenseExpired(driver.licenseExpiry);
                                    const expiringSoon = isLicenseExpiringSoon(
                                        driver.licenseExpiry
                                    );

                                    return (
                                        <tr
                                            key={driver.driverId}
                                            className="hover:bg-[var(--bg-hover)] transition-colors duration-150"
                                        >
                                            {/* Cột 1: Thông tin tài xế & Avatar */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-[var(--avatar-yellow)] flex items-center justify-center text-[var(--badge-text)] font-bold border border-[var(--border-gray)]">
                                                        {driver.avatar ? (
                                                            <Image
                                                                src={driver.avatar}
                                                                alt={driver.fullName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <span>{getInitials(driver.fullName)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[var(--text-primary)] text-base">
                                                            {driver.fullName}
                                                        </p>
                                                        <div className="mt-1">
                                                            {renderStatusBadge(driver.status)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 2: Liên hệ */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex flex-col gap-1 text-[var(--text-secondary)]">
                                                    <div className="flex items-center gap-2">
                                                        <span>📞</span>
                                                        <span className="text-[var(--text-primary)]">
                                                            {driver.phoneNumber}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span>📧</span>
                                                        <span className="truncate max-w-[180px]" title={driver.email}>
                                                            {driver.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 3: Bằng lái */}
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-[var(--text-primary)]">
                                                        {driver.driverLicense}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-secondary)]">
                                                        Hết hạn:{" "}
                                                        {new Date(driver.licenseExpiry).toLocaleDateString()}
                                                    </span>
                                                    {expired ? (
                                                        <span className="text-xs font-bold text-[var(--warning-text)] bg-[var(--warning-bg)] px-1.5 py-0.5 rounded w-fit">
                                                            Đã hết hạn
                                                        </span>
                                                    ) : expiringSoon ? (
                                                        <span className="text-xs font-bold text-[var(--stat-orange-text)] bg-[var(--stat-orange-bg)] px-1.5 py-0.5 rounded w-fit">
                                                            Sắp hết hạn
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>

                                            {/* Cột 4: Tuyến (Active Routes) */}
                                            <td className="px-4 py-4 align-top">
                                                {driver.activeRoutes && driver.activeRoutes.length > 0 ? (
                                                    <div className="flex flex-col gap-2">
                                                        {driver.activeRoutes.map((route) => (
                                                            <div
                                                                key={route.assignmentId}
                                                                className="p-2 rounded border border-[var(--border-gray)] bg-[var(--bg-secondary)]"
                                                            >
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="font-medium text-[var(--primary)] text-xs">
                                                                        {route.routeName}
                                                                    </span>
                                                                    <span
                                                                        className={`text-[10px] px-1.5 py-0.5 rounded border ${route.preferredRole === "Main"
                                                                                ? "border-[var(--stat-green-text)] text-[var(--stat-green-text)] bg-[var(--stat-green-bg)]"
                                                                                : "border-[var(--stat-blue-text)] text-[var(--stat-blue-text)] bg-[var(--stat-blue-bg)]"
                                                                            }`}
                                                                    >
                                                                        {route.preferredRole}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-[var(--text-secondary)] truncate max-w-[200px]">
                                                                    {route.origin} → {route.destination}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-[var(--text-secondary)] flex items-center gap-1">
                                                        <span className="grayscale opacity-50">🚌</span> Chưa
                                                        có tuyến
                                                    </span>
                                                )}
                                            </td>

                                            {/* Cột 5: Thao tác (Actions) */}
                                            <td className="px-4 py-4 align-top text-right">
                                                <div className="flex flex-col items-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleAssignRoute(driver.driverId, driver.fullName)
                                                        }
                                                        className="text-xs px-3 py-1.5 rounded bg-[var(--stat-green-bg)] text-[var(--stat-green-text)] font-medium hover:brightness-95 transition-all"
                                                    >
                                                        + Gắn tuyến
                                                    </button>

                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button
                                                            onClick={() => openEditModal(driver)}
                                                            className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--stat-blue-text)] transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(driver)}
                                                            className="p-1.5 rounded-full hover:bg-[var(--warning-bg)] text-[var(--primary)] transition-colors"
                                                            title="Xóa"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {displayDrivers.length === 0 && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>
                                {selectedRouteId
                                    ? "Không có tài xế nào chạy tuyến này"
                                    : "Không tìm thấy tài xế"}
                            </p>
                            <p className={styles.emptySubtitle}>
                                {keyword
                                    ? "Thử thay đổi từ khóa tìm kiếm"
                                    : selectedRouteId
                                        ? "Hãy thử chọn tuyến khác hoặc thêm mới"
                                        : 'Nhấn "Thêm tài xế" để tạo mới'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* --- MODALS --- */}
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

            {selectedDriverForAssignment && (
                <DriverRouteAssignmentModal
                    isOpen={showAssignmentModal}
                    onClose={() => {
                        setShowAssignmentModal(false);
                        setSelectedDriverForAssignment(null);
                    }}
                    driverId={selectedDriverForAssignment.id}
                    driverName={selectedDriverForAssignment.name}
                    onSuccess={handleAssignmentSuccess}
                />
            )}
        </div>
    );
}