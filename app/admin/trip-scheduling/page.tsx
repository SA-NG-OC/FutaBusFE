// src/app/trip-scheduling/page.tsx (Ví dụ đường dẫn)
'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/src/components/PageHeader/PageHeader';
import TripFilterBar from '@/feature/trip/components/TripFilterBar/TripFilterBar';
import TripTable from '@/feature/trip/components/TripTable/TripTable';
import Pagination from '@/src/components/Pagination/Pagination';
import TripModal, { TripFormData } from '@/feature/trip/components/TripModal/TripModal';
import { useTrips } from '@/feature/trip/hooks/useTrips';
import { format } from 'date-fns';

export default function TripSchedulingPage() {
    // State bộ lọc
    const [filterState, setFilterState] = useState<{
        date: Date | null;
        status: string;
    }>({
        date: new Date(),
        status: ''
    });

    // State Modal (Chỉ quản lý việc đóng/mở)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sử dụng Hook
    const {
        trips,
        loading,
        currentPage,
        totalPages,
        setPage,
        updateTripStatus,
        fetchTrips,
        createTrip,          // Hàm tạo
        isCreating,          // Trạng thái loading khi tạo (Lấy từ hook)
        routes,
        vehicles,
        drivers,
        fetchSelectionData,
        loadingSelection
    } = useTrips();

    // Effect load danh sách
    useEffect(() => {
        const dateStr = filterState.date ? format(filterState.date, 'yyyy-MM-dd') : null;
        fetchTrips({
            page: currentPage,
            status: filterState.status,
            date: dateStr
        });
    }, [filterState, currentPage, fetchTrips]);

    // --- Handlers ---

    const handleScheduleTrip = () => {
        fetchSelectionData();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Xử lý Submit: Gọi hàm từ hook, hook trả về kết quả
    const handleCreateTripSubmit = async (data: TripFormData) => {
        const success = await createTrip(data);

        if (success) {
            setIsModalOpen(false);

            // ✅ RESET FILTER
            setFilterState({
                date: null,
                status: ''
            });

            setPage(0); // optional: quay về trang đầu
        } else {
            alert("Failed to create trip. Please try again.");
        }
    };


    const handleFilterChange = (newDate: Date | null, newStatus: string) => {
        setFilterState({ date: newDate, status: newStatus });
        setPage(0);
    };

    return (
        <div>
            <PageHeader
                title="Trip Scheduling"
                subtitle="Schedule and manage bus trips"
                actionLabel="Schedule Trip"
                onAction={handleScheduleTrip}
            />

            <TripFilterBar
                onFilterChange={handleFilterChange}
                initialDate={filterState.date}
                initialStatus={filterState.status}
            />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-gray)' }}>
                    Loading trips...
                </div>
            ) : (
                <>
                    <TripTable trips={trips} onStatusUpdate={updateTripStatus} />

                    {totalPages > 1 && (
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}

                    {trips.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                            No trips found.
                        </div>
                    )}
                </>
            )}

            <TripModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateTripSubmit}
                routes={routes}
                vehicles={vehicles}
                drivers={drivers}
                // isCreating (khi bấm Save) hoặc loadingSelection (khi mới mở modal) đều cần hiện loading
                isLoading={isCreating || loadingSelection}
            />
        </div>
    );
}