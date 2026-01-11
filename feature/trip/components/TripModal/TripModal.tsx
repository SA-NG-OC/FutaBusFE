// src/components/TripModal.tsx
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './TripModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { RouteSelection, VehicleSelection, DriverSelection } from '../../types';
import { TripFormData } from '../../types';

interface TripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TripFormData) => void;
    routes: RouteSelection[];
    vehicles: VehicleSelection[];
    drivers: DriverSelection[];
    subDrivers: DriverSelection[]; // <--- 1. Thêm props danh sách phụ xe
    isLoading?: boolean;
}

const TripModal = ({
    isOpen,
    onClose,
    onSubmit,
    routes = [],
    vehicles = [],
    drivers = [],
    subDrivers = [], // <--- 2. Nhận props
    isLoading = false
}: TripModalProps) => {

    // Đảm bảo TripFormData trong file types.ts đã có trường subDriverId
    const { register, handleSubmit, reset, formState: { errors } } = useForm<TripFormData>();

    useEffect(() => {
        if (!isOpen) reset();
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const onFormSubmit = (data: TripFormData) => {
        onSubmit(data);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles['close-button']} onClick={onClose} type="button">
                    <FaTimes />
                </button>

                <div className={styles['modal-header']}>
                    <h2 className={styles['modal-title']}>Schedule New Trip</h2>
                </div>

                <form className={styles['form-content']} onSubmit={handleSubmit(onFormSubmit)}>

                    {/* Select Route */}
                    <div className={styles['form-field']}>
                        <label className={styles['form-label']}>Select Route <span style={{ color: 'var(--primary)' }}>*</span></label>
                        <select
                            className={styles['form-select']}
                            {...register('routeId', { required: 'Please select a route' })}
                        >
                            <option value="">Choose route</option>
                            {routes.map(r => (
                                <option key={r.routeId} value={r.routeId}>{r.routeName}</option>
                            ))}
                        </select>
                        {errors.routeId && <span className={styles['error-text']}>{errors.routeId.message}</span>}
                    </div>

                    {/* Select Vehicle & Driver */}
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Select Vehicle <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <select
                                className={styles['form-select']}
                                {...register('vehicleId', { required: 'Please select a vehicle' })}
                            >
                                <option value="">Choose vehicle</option>
                                {vehicles.map(v => (
                                    <option key={v.vehicleId} value={v.vehicleId}>
                                        {v.licensePlate} - {v.vehicleTypeName}
                                    </option>
                                ))}
                            </select>
                            {errors.vehicleId && <span className={styles['error-text']}>{errors.vehicleId.message}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Assign Driver <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <select
                                className={styles['form-select']}
                                {...register('driverId', { required: 'Please select a driver' })}
                            >
                                <option value="">Choose driver</option>
                                {drivers.map(d => (
                                    <option key={d.driverId} value={d.driverId}>
                                        {d.driverName} ({d.driverLicense})
                                    </option>
                                ))}
                            </select>
                            {errors.driverId && <span className={styles['error-text']}>{errors.driverId.message}</span>}
                        </div>
                    </div>

                    {/* Select Sub-Driver & Price (Gộp chung hàng mới) */}
                    <div className={styles['form-row']}>
                        {/* 3. Thêm field Sub-Driver */}
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Assign Sub-Driver</label>
                            <select
                                className={styles['form-select']}
                                {...register('subDriverId')} // Không bắt buộc (required) nếu không cần
                            >
                                <option value="">No sub-driver</option>
                                {subDrivers.map(d => (
                                    <option key={d.driverId} value={d.driverId}>
                                        {d.driverName} ({d.driverLicense})
                                    </option>
                                ))}
                            </select>
                            {/* Nếu muốn bắt buộc thì thêm required và hiển thị lỗi ở đây */}
                        </div>

                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Ticket Price (₫) <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input
                                type="number"
                                className={styles['form-input']}
                                placeholder="250000"
                                {...register('price', {
                                    required: 'Please enter price',
                                    min: { value: 0, message: 'Price must be positive' }
                                })}
                            />
                            {errors.price && <span className={styles['error-text']}>{errors.price.message}</span>}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className={styles['form-row']}>
                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Date <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input
                                type="date"
                                className={styles['form-input']}
                                {...register('date', { required: 'Please select a date' })}
                            />
                            {errors.date && <span className={styles['error-text']}>{errors.date.message}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label className={styles['form-label']}>Departure Time <span style={{ color: 'var(--primary)' }}>*</span></label>
                            <input
                                type="time"
                                className={styles['form-input']}
                                {...register('departureTime', { required: 'Please select time' })}
                            />
                            {errors.departureTime && <span className={styles['error-text']}>{errors.departureTime.message}</span>}
                        </div>
                    </div>

                    <button type="submit" className={styles['submit-button']} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Schedule Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TripModal;