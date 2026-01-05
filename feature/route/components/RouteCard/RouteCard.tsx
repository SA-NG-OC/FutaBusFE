'use client';

import React from 'react';
import styles from './RouteCard.module.css';
import { RouteData } from '../../types';

interface RouteCardProps {
    data: RouteData;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const RouteCard = ({ data, onEdit, onDelete }: RouteCardProps) => {

    // --- Helper: Format số phút thành giờ phút (ví dụ: 150 -> 2h 30m) ---
    const formatDuration = (minutes: number) => {
        // Kiểm tra null/undefined hoặc 0
        if (minutes === undefined || minutes === null) return 'N/A';

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h}h`;
        return `${m}m`;
    };

    return (
        <div className={styles.card}>
            {/* --- Header Section --- */}
            <div className={styles['card-header']}>
                <div className={styles['route-info']}>
                    <p className={styles['route-title']}>{data.routeName}</p>
                    <div className={styles['route-location']}>
                        {/* Icon Location */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3333 6.66667C13.3333 11.3333 8 14.6667 8 14.6667C8 14.6667 2.66667 11.3333 2.66667 6.66667C2.66667 5.25218 3.22857 3.89562 4.22876 2.89543C5.22896 1.89524 6.58551 1.33333 8 1.33333C9.41449 1.33333 10.771 1.89524 11.7712 2.89543C12.7714 3.89562 13.3333 5.25218 13.3333 6.66667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                        </svg>
                        <span className={styles['location-text']}>
                            {data.originName} → {data.destinationName}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={styles['badge-active']}>
                    {data.status === 'Hoạt động' ? 'Active' : data.status}
                </div>
            </div>

            {/* --- Content Info --- */}
            <div className={styles['card-content']}>
                <div className={styles['info-row']}>
                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Distance</p>
                        <p className={styles['info-value']}>{data.distance} km</p>
                    </div>

                    {/* CẬP NHẬT PHẦN EST. TIME TẠI ĐÂY */}
                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Est. Time</p>
                        <p className={styles['info-value']}>
                            {formatDuration(data.estimatedDuration)}
                        </p>
                    </div>

                    <div className={styles['info-item']}>
                        <p className={styles['info-label']}>Stops</p>
                        <p className={styles['info-value']}>
                            {data.totalStops > 0 ? `${data.totalStops} stops` : 'Direct'}
                        </p>
                    </div>
                </div>

                {/* --- Stops Badges --- */}
                {data.stopNames && data.stopNames.length > 0 && (
                    <div className={styles['stops-section']}>
                        <p className={styles['info-label']}>Route Stops:</p>
                        <div className={styles['stops-badges']}>
                            {data.stopNames.map((stop, index) => {
                                const isHighlight = index === 0 || index === data.stopNames.length - 1;
                                const badgeClass = isHighlight
                                    ? `${styles.badge} ${styles['badge-highlight']}`
                                    : styles.badge;

                                return (
                                    <div key={index} className={badgeClass}>
                                        {stop}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- Actions --- */}
                <div className={styles['action-buttons']}>
                    <button className={styles.btn} onClick={() => onEdit?.(data.routeId)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7.33333 2.66667H2.66667C2.48986 2.66667 2.32029 2.7369 2.19526 2.86193C2.07024 2.98695 2 3.15652 2 3.33333V13.3333C2 13.5101 2.07024 13.6797 2.19526 13.8047C2.32029 13.9298 2.48986 14 2.66667 14H12.6667C12.8435 14 13.013 13.9298 13.1381 13.8047C13.2631 13.6797 13.3333 13.5101 13.3333 13.3333V8.66667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M12.3333 1.66665C12.5085 1.49148 12.7455 1.39282 12.9933 1.39282C13.2412 1.39282 13.4781 1.49148 13.6533 1.66665C13.8285 1.84183 13.9272 2.07879 13.9272 2.32665C13.9272 2.57451 13.8285 2.81148 13.6533 2.98665L7.99998 8.63998L5.33331 9.33332L6.02665 6.66665L12.3333 1.66665Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                        </svg>
                        <span className={styles['btn-text']}>Edit</span>
                    </button>

                    <button className={styles.btn} onClick={() => onDelete?.(data.routeId)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6.66667 7.33333V11.3333" stroke="#d83e3e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M9.33333 7.33333V11.3333" stroke="#d83e3e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M2.66667 4H13.3333V13.3333C13.3333 13.5101 13.2631 13.6797 13.1381 13.8047C13.013 13.9298 12.8435 14 12.6667 14H3.33333C3.15652 14 2.98695 13.9298 2.86193 13.8047C2.7369 13.6797 2.66667 13.5101 2.66667 13.3333V4Z" stroke="#d83e3e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M2 4H14" stroke="#d83e3e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                            <path d="M10.6667 4V2.66667C10.6667 2.48986 10.5964 2.32029 10.4714 2.19526C10.3464 2.07024 10.1768 2 10 2H6C5.82319 2 5.65362 2.07024 5.5286 2.19526C5.40357 2.32029 5.33333 2.48986 5.33333 2.66667V4" stroke="#d83e3e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
                        </svg>
                        <span className={styles['btn-text']} style={{ color: 'var(--primary)' }}>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteCard;