"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from "./TripFilterBar.module.css";

// Status options for filtering
const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "Waiting", label: "Waiting" },
  { value: "Running", label: "Running" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Delayed", label: "Delayed" },
];

interface TripFilterBarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSearch: (term: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
}

const TripFilterBar = ({
  currentDate,
  onDateChange,
  onSearch,
  selectedStatus = "",
  onStatusChange,
}: TripFilterBarProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (value: any) => {
    onDateChange(value as Date);
    setShowCalendar(false);
  };

  const handlePrevDay = () => onDateChange(subDays(currentDate, 1));
  const handleNextDay = () => onDateChange(addDays(currentDate, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className={styles.filterContainer}>
      {/* Top Bar: Search */}
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm chuyến..."
            className={styles.searchInput}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button className={styles.clearBtn} onClick={handleToday}>
          Hôm nay
        </button>
      </div>

      {/* Date Navigation Bar */}
      <div className={styles.dateNav}>
        <button className={styles.navBtn} onClick={handlePrevDay}>
          <FaChevronLeft />
        </button>

        {/* Khu vực hiển thị ngày + Click mở lịch */}
        <div className={styles.calendarWrapper} ref={calendarRef}>
          <div
            className={`${styles.dateDisplay} ${
              showCalendar ? styles.active : ""
            }`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <FaCalendarAlt className={styles.iconCalendar} />
            <span className={styles.dateText}>
              {format(currentDate, "EEEE, d 'Tháng' M, yyyy", { locale: vi })}
            </span>
          </div>

          {/* POPUP CALENDAR */}
          {showCalendar && (
            <div className={styles.calendarPopup}>
              <Calendar
                onChange={handleDateChange}
                value={currentDate}
                locale="vi-VN"
                className={styles.reactCalendar}
              />
            </div>
          )}
        </div>

        <button className={styles.navBtn} onClick={handleNextDay}>
          <FaChevronRight />
        </button>
      </div>

      {/* Status Filter Buttons */}
      {onStatusChange && (
        <div className={styles.statusFilter}>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.statusBtn} ${
                selectedStatus === option.value ? styles.statusBtnActive : ""
              }`}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripFilterBar;
