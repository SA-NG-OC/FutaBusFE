'use client';

import React from 'react';
import styles from './TripTable.module.css';
import { TripData } from '../../types';

interface TripTableProps {
    trips: TripData[];
    onStatusUpdate: (id: number, newStatus: string) => void;
}

// Helper format tiền tệ
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper format ngày giờ
const formatDateTime = (dateStr: string, timeStr: string) => {
    // Cắt chuỗi time để lấy HH:mm (bỏ giây và mili giây nếu có)
    const time = timeStr.split('.')[0].substring(0, 5);
    return `${time} - ${dateStr}`;
};

// Helper lấy class badge theo status
const getStatusBadgeClass = (status: string | null) => {
    if (!status) return styles['badge-cho'];

    // Normalize string để so sánh
    const s = status.toLowerCase();
    if (s.includes('chờ') || s.includes('waiting')) return styles['badge-cho'];
    if (s.includes('hoạt động') || s.includes('running')) return styles['badge-hoatdong'];
    if (s.includes('hủy') || s.includes('cancelled')) return styles['badge-huy'];
    if (s.includes('hoàn thành') || s.includes('completed')) return styles['badge-hoanthanh'];

    return styles['badge-cho']; // Default
};

const TripTable = ({ trips, onStatusUpdate }: TripTableProps) => {

    // List các status có thể chọn để đổi
    const statusOptions = ["Waiting", "Running", "Delayed", "Completed", "Cancelled"];

    return (
        <div className={styles.card}>
            <h2 className={styles['card-title']}>Scheduled Trips</h2>

            <div className={styles['table-container']}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Route</th>
                            <th>Vehicle Info</th>
                            <th>Driver</th>
                            <th>Departure</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.length > 0 ? (
                            trips.map((trip) => (
                                <tr key={trip.tripId}>
                                    <td className={styles['trip-id']}>#{trip.tripId}</td>
                                    <td>{trip.routeName}</td>
                                    <td className={styles['col-vehicle']}>
                                        <div className={styles['vehicle-text']}>
                                            {trip.vehicleInfo}
                                            {/* Bạn có thể tách chuỗi để hiển thị loại xe xuống dòng nếu muốn */}
                                        </div>
                                    </td>
                                    <td>{trip.driverName}</td>
                                    <td>{formatDateTime(trip.date, trip.departureTime)}</td>
                                    <td className={styles['price-text']}>{formatCurrency(trip.price)}</td>

                                    {/* Cột hiển thị Badge Status hiện tại */}
                                    <td>
                                        <span className={`${styles.badge} ${getStatusBadgeClass(trip.status)}`}>
                                            {trip.status || 'Unknown'}
                                        </span>
                                    </td>

                                    {/* Cột Action: Dropdown để đổi status */}
                                    <td>
                                        <select
                                            className={styles['status-select']}
                                            value={trip.status || ''}
                                            onChange={(e) => onStatusUpdate(trip.tripId, e.target.value)}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>
                                                    Set {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                    No trips found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TripTable;