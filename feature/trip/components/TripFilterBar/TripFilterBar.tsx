'use client';

import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
// THÊM: startOfWeek, endOfWeek
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import styles from './TripFilterBar.module.css';
import { FaCalendarAlt, FaClock, FaChevronDown, FaTimes } from 'react-icons/fa';
import { tripApi } from '../../api/tripApi';

interface TripFilterBarProps {
    onFilterChange: (date: Date | null, status: string) => void;
    initialStatus?: string;
    initialDate?: Date | null;
}

const TripFilterBar = ({
    onFilterChange,
    initialStatus = '',
    initialDate = new Date()
}: TripFilterBarProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState<Date | null>(initialDate);
    const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
    const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
    const calendarRef = useRef<HTMLDivElement>(null);

    // --- SỬA ĐOẠN NÀY ---
    const fetchTripDates = async (currentDate: Date) => {
        try {
            // Xác định phạm vi hiển thị thực tế trên lịch (Grid view)
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(currentDate);

            // Lấy rộng ra đầu tuần và cuối tuần để bao phủ cả những ngày mờ của tháng trước/sau
            // weekStartsOn: 1 tương ứng với Thứ Hai (phù hợp locale="vi-VN")
            const visibleStart = startOfWeek(monthStart, { weekStartsOn: 1 });
            const visibleEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

            const start = format(visibleStart, 'yyyy-MM-dd');
            const end = format(visibleEnd, 'yyyy-MM-dd');

            console.log(`Fetching dots from ${start} to ${end}`); // Debug xem range đúng chưa

            const response = await tripApi.getTripDates(start, end);
            if (response.success) {
                setHighlightedDates(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch calendar dates", error);
        }
    };
    // --------------------

    useEffect(() => {
        fetchTripDates(new Date());

        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const triggerFilterChange = (newDate: Date | null, newStatus: string) => {
        if (onFilterChange) {
            onFilterChange(newDate, newStatus);
        }
    };

    const handleDateChange = (value: any) => {
        const selectedDate = value as Date;
        setDate(selectedDate);
        setShowCalendar(false);
        triggerFilterChange(selectedDate, selectedStatus);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setDate(today);
        triggerFilterChange(today, selectedStatus);
    };

    const handleClearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDate(null);
        triggerFilterChange(null, selectedStatus);
    };

    const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        triggerFilterChange(date, newStatus);
    };

    const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
        if (activeStartDate) fetchTripDates(activeStartDate);
    };

    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (highlightedDates.includes(dateStr)) {
                return (
                    <div className={styles['dot-container']}>
                        <div className={styles['dot']}></div>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className={styles.container}>
            <div className={styles['trip-scheduling']}>
                <div className={styles['calendar-wrapper']} ref={calendarRef}>
                    <button
                        className={`${styles.btn} ${showCalendar ? styles.active : ''}`}
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        <div className={styles['btn-icon']}>
                            <FaCalendarAlt />
                        </div>
                        <span className={styles['btn-text']}>
                            {date ? format(date, 'dd/MM/yyyy') : 'All Dates'}
                        </span>
                        {date && (
                            <div
                                className={styles['clear-date-btn']}
                                onClick={handleClearDate}
                                title="Clear date filter"
                            >
                                <FaTimes />
                            </div>
                        )}
                    </button>

                    {showCalendar && (
                        <div className={styles['calendar-popup']}>
                            <Calendar
                                onChange={handleDateChange}
                                value={date || new Date()}
                                tileContent={tileContent}
                                onActiveStartDateChange={handleActiveStartDateChange}
                                locale="vi-VN"
                                next2Label={null}
                                prev2Label={null}
                            />
                        </div>
                    )}
                </div>

                <button className={styles.btn} onClick={handleTodayClick}>
                    <div className={styles['btn-icon']}>
                        <FaClock />
                    </div>
                    <span className={styles['btn-text']}>Today</span>
                </button>

                <div className={styles['select-wrapper']}>
                    <select
                        className={styles['status-select']}
                        onChange={handleStatusSelect}
                        value={selectedStatus}
                    >
                        <option value="">All Statuses</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Running">Running</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                        <option value="Delay">Delay</option>
                    </select>
                    <div className={styles['select-icon']}>
                        <FaChevronDown size={12} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripFilterBar;