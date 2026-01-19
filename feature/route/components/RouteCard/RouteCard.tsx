'use client';

import React, { useState, useEffect } from 'react';
import styles from './RouteCard.module.css';
import { RouteData } from '../../types';
import { vehicleRouteAssignmentApi } from '@/feature/vehicle/api/vehicleRouteAssignmentApi';
import { driverRouteAssignmentApi } from '@/feature/driver/api/driverRouteAssignmentApi';

interface RouteCardProps {
    data: RouteData;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const RouteCard = ({ data, onEdit, onDelete }: RouteCardProps) => {
    const [vehicleCount, setVehicleCount] = useState<number>(0);
    const [driverCount, setDriverCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, [data.routeId]);

    const fetchAssignments = async () => {
        try {
            const [vehicles, drivers] = await Promise.all([
                vehicleRouteAssignmentApi.getByRoute(data.routeId),
                driverRouteAssignmentApi.getByRoute(data.routeId),
            ]);
            setVehicleCount(vehicles.length);
            setDriverCount(drivers.length);
        } catch (error) {
            console.error('Lỗi khi tải phân công:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format phút → giờ phút
    const formatDuration = (minutes: number) => {
        if (minutes === undefined || minutes === null) return 'Không xác định';

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
        if (h > 0) return `${h} giờ`;
        return `${m} phút`;
    };

    return (
        <div className={styles.card}>
            {/* Header */}
            <div className={styles['card-header']}>
                <div className={styles['route-info']}>
                    <p className={styles['route-title']}>{data.routeName}</p>

                    <div className={styles['route-location']}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M13.3333 6.66667C13.3333 11.3333 8 14.6667 8 14.6667C8 14.6667 2.66667 11.3333 2.66667 6.66667C2.66667 5.25218 3.22857 3.89562 4.22876 2.89543C5.22896 1.89524 6.58551 1.33333 8 1.33333C9.41449 1.33333 10.771 1.89524 11.7712 2.89543C12.7714 3.89562 13.3333 5.25218 13.3333 6.66667Z"
                                stroke="currentColor"
                                strokeWidth="1.33"
                            />
                            <path
                                d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z"
                                stroke="currentColor"
                                strokeWidth="1.33"
                            />
                        </svg>
                        <span className={styles['location-text']}>
                            {data.originName} → {data.destinationName}
                        </span>
                    </div>
                </div>

                {/* Trạng thái */}
                <div className={styles['badge-active']}>
                    {data.status === 'Hoạt động' ? 'Đang hoạt động' : data.status}
                </div>
            </div>

            {/* Nội dung */}
            <div className={styles['card-content']}>
                <div className={styles['info-row']}>
                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Khoảng cách</p>
                        <p className={styles['info-value']}>{data.distance} km</p>
                    </div>

                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Thời gian ước tính</p>
                        <p className={styles['info-value']}>
                            {formatDuration(data.estimatedDuration)}
                        </p>
                    </div>

                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Điểm dừng</p>
                        <p className={styles['info-value']}>
                            {data.totalStops > 0
                                ? `${data.totalStops} điểm`
                                : 'Chạy thẳng'}
                        </p>
                    </div>
                </div>

                {/* Tài nguyên */}
                <div
                    className={styles['info-row']}
                    style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color, #e5e7eb)',
                    }}
                >
                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Xe</p>
                        <p className={styles['info-value']} style={{ color: 'var(--primary)' }}>
                            {loading ? '...' : `${vehicleCount} xe`}
                        </p>
                    </div>

                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Tài xế</p>
                        <p className={styles['info-value']} style={{ color: 'var(--primary)' }}>
                            {loading ? '...' : `${driverCount} tài xế`}
                        </p>
                    </div>
                </div>

                {/* Các điểm dừng */}
                {data.stopNames && data.stopNames.length > 0 && (
                    <div className={styles['stops-section']}>
                        <p className={styles['info-label']}>Các điểm trên tuyến:</p>
                        <div className={styles['stops-badges']}>
                            {data.stopNames.map((stop, index) => {
                                const isHighlight =
                                    index === 0 || index === data.stopNames.length - 1;

                                return (
                                    <div
                                        key={index}
                                        className={
                                            isHighlight
                                                ? `${styles.badge} ${styles['badge-highlight']}`
                                                : styles.badge
                                        }
                                    >
                                        {stop}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Hành động */}
                <div className={styles['action-buttons']}>
                    <button className={styles.btn} onClick={() => onEdit?.(data.routeId)}>
                        <span className={styles['btn-text']}>Chỉnh sửa</span>
                    </button>

                    <button className={styles.btn} onClick={() => onDelete?.(data.routeId)}>
                        <span className={styles['btn-text']} style={{ color: 'var(--primary)' }}>
                            Xóa
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteCard;
