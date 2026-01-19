"use client";

import React, { useState, useEffect } from "react";
import styles from "./TripDetailsModal.module.css";
import {
  TripData,
  VehicleSelection,
  DriverSelection,
} from "@/feature/trip/types";
import {
  FaTimes,
  FaUsers,
  FaShoppingCart,
  FaCheckCircle,
  FaCalendarAlt,
  FaBus,
  FaUser,
  FaUserTie, // Icon cho phụ xe
  FaRegMoneyBillAlt,
  FaTrash,
} from "react-icons/fa";
import DeleteTripModal from "../DeleteTripModal/DeleteTripModal";
import TripMap from "@/src/components/TrackingMap/index";

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData | null;
  vehicles: VehicleSelection[];
  drivers: DriverSelection[];
  subDrivers: DriverSelection[];
  onDelete: (id: number) => Promise<boolean>;
  // [IMPORTANT] Update return type để nhận object mới từ API
  onUpdate: (id: number, data: any) => Promise<TripData | null>;
}

const TripDetailsModal = ({
  isOpen,
  onClose,
  trip,
  vehicles,
  drivers,
  subDrivers,
  onDelete,
  onUpdate,
}: TripDetailsModalProps) => {
  // --- STATE ---
  // [FIX] Dùng local state để cập nhật UI ngay lập tức sau khi sửa thành công
  const [currentTrip, setCurrentTrip] = useState<TripData | null>(trip);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    vehicleId: number;
    driverId: number;
    subDriverId?: number | null;
    price: number;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync prop 'trip' vào state 'currentTrip' khi mở modal lần đầu hoặc đổi chuyến khác
  useEffect(() => {
    setCurrentTrip(trip);
  }, [trip]);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (isOpen && currentTrip) {
      setIsEditing(false);

      // Helper chuẩn hóa chuỗi để so sánh (tránh lỗi case sensitive hoặc khoảng trắng)
      const normalize = (str?: string) => (str ? str.trim().toLowerCase() : "");

      // 1. Tìm Xe
      const foundVehicle = vehicles.find((v) =>
        currentTrip.vehicleInfo?.includes(v.licensePlate),
      );

      // 2. Tìm Tài xế chính
      const tripDriverName = normalize(currentTrip.driverName);
      const foundDriver = drivers.find(
        (d) => normalize(d.driverName) === tripDriverName,
      );

      // 3. Tìm Phụ xe
      const tripSubDriverName = normalize(currentTrip.subDriverName || "");
      const foundSubDriver = currentTrip.subDriverName
        ? subDrivers.find((d) => normalize(d.driverName) === tripSubDriverName)
        : null;

      setEditData({
        vehicleId: foundVehicle ? foundVehicle.vehicleId : 0,
        driverId: foundDriver ? foundDriver.driverId : 0,
        subDriverId: foundSubDriver ? foundSubDriver.driverId : null,
        price: currentTrip.price,
      });
    }
  }, [isOpen, currentTrip, vehicles, drivers, subDrivers]);

  if (!isOpen || !currentTrip) return null;

  // --- LOGIC HIỂN THỊ (Dùng currentTrip) ---
  const totalSeats = currentTrip.totalSeats ?? 0;
  const bookedSeats = currentTrip.bookedSeats ?? 0;
  const checkedInSeats = currentTrip.checkedInSeats ?? 0;
  const hasBookings = bookedSeats > 0;

  const canEdit = ["Waiting", "Delayed"].includes(currentTrip.status);

  // Parse route name for Map
  const routeParts = currentTrip.routeName
    ? currentTrip.routeName.split(/->|-/).map((s) => s.trim())
    : [];
  const origin = routeParts[0] || "Origin";
  const destination = routeParts[1] || "Destination";

  // --- HANDLERS ---
  const handleSave = async () => {
    if (!editData || !currentTrip) return;
    setIsSaving(true);

    // Logic: Nếu subDriverId là 0 (do chọn "None"), gửi null lên BE
    const payload = {
      ...editData,
      subDriverId: editData.subDriverId === 0 ? null : editData.subDriverId,
    };

    // Gọi API update
    const updatedTrip = await onUpdate(currentTrip.tripId, payload);

    setIsSaving(false);

    // [FIX] Nếu update thành công, cập nhật ngay vào local state để UI đổi
    if (updatedTrip) {
      setCurrentTrip(updatedTrip);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleConfirmDelete = async () => {
    if (!currentTrip) return;
    const success = await onDelete(currentTrip.tripId);
    if (success) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const formatDateTimePretty = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "N/A";
    const dateObj = new Date(dateStr);
    const datePart = dateObj.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const timePart = timeStr?.substring(0, 5) || "--:--";
    return (
      <span>
        {datePart} <span style={{ margin: "0 6px", opacity: 0.5 }}>•</span>{" "}
        <b>{timePart}</b>
      </span>
    );
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Waiting":
        return styles.statusWaiting;
      case "Running":
        return styles.statusRunning;
      case "Completed":
        return styles.statusCompleted;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusWaiting;
    }
  };

  // Component render từng ô thông tin
  const renderInfoCard = (
    icon: React.ReactNode,
    label: string,
    displayValue: React.ReactNode,
    fieldKey: "vehicleId" | "driverId" | "subDriverId" | "price",
    isCurrency = false,
  ) => {
    return (
      <div
        className={`${styles.infoCard} ${canEdit && isEditing ? styles.editable : ""}`}
      >
        <div className={styles.infoLabel}>
          {icon} {label}
        </div>

        {isEditing && canEdit && editData ? (
          // --- EDIT MODE ---
          fieldKey === "price" ? (
            <input
              type="number"
              className={styles.editInput}
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: Number(e.target.value) })
              }
            />
          ) : fieldKey === "vehicleId" ? (
            <select
              className={styles.editSelect}
              value={editData.vehicleId}
              onChange={(e) =>
                setEditData({ ...editData, vehicleId: Number(e.target.value) })
              }
            >
              <option value={0}>Chọn xe</option>
              {vehicles.map((v) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.licensePlate} ({v.vehicleTypeName})
                </option>
              ))}
            </select>
          ) : fieldKey === "driverId" ? (
            <select
              className={styles.editSelect}
              value={editData.driverId}
              onChange={(e) =>
                setEditData({ ...editData, driverId: Number(e.target.value) })
              }
            >
              <option value={0}>Chọn tài xế</option>
              {drivers.map((d) => (
                <option key={d.driverId} value={d.driverId}>
                  {d.driverName}
                </option>
              ))}
            </select>
          ) : fieldKey === "subDriverId" ? (
            <select
              className={styles.editSelect}
              value={editData.subDriverId || 0}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  subDriverId: Number(e.target.value) || null,
                })
              }
            >
              <option value={0}>-- Không có --</option>
              {subDrivers.map((d) => (
                <option key={d.driverId} value={d.driverId}>
                  {d.driverName}
                </option>
              ))}
            </select>
          ) : null
        ) : (
          // --- VIEW MODE ---
          <div
            className={`${styles.infoValue} ${isCurrency ? styles.price : ""}`}
          >
            {isCurrency && typeof displayValue === "number"
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(displayValue)
              : displayValue || (
                  <span
                    style={{
                      fontStyle: "italic",
                      opacity: 0.6,
                      fontWeight: 400,
                    }}
                  >
                    Không có
                  </span>
                )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h2>Chi tiết chuyến đi</h2>
              <div className={styles.routeRow}>
                <span className={styles.routeName}>
                  {currentTrip.routeName}
                </span>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(currentTrip.status)}`}
                >
                  {currentTrip.status}
                </span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* BODY */}
          <div className={styles.modalBody}>
            {/* LEFT COLUMN */}
            <div className={styles.leftColumn}>
              <div className={styles.statsRow}>
                <div className={`${styles.statCard} ${styles.cardBlue}`}>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Tổng ghế</span>
                    <span className={styles.statValue}>{totalSeats}</span>
                  </div>
                  <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                    <FaUsers />
                  </div>
                </div>
                <div className={`${styles.statCard} ${styles.cardRed}`}>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Đã đặt</span>
                    <span className={styles.statValue}>{bookedSeats}</span>
                  </div>
                  <div className={`${styles.statIcon} ${styles.iconRed}`}>
                    <FaShoppingCart />
                  </div>
                </div>
                <div className={`${styles.statCard} ${styles.cardGreen}`}>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Đã lên xe</span>
                    <span className={styles.statValue}>{checkedInSeats}</span>
                  </div>
                  <div className={`${styles.statIcon} ${styles.iconGreen}`}>
                    <FaCheckCircle />
                  </div>
                </div>
              </div>

              <div className={styles.infoGrid}>
                {renderInfoCard(
                  <FaBus />,
                  "Xe",
                  currentTrip.vehicleInfo,
                  "vehicleId",
                )}
                {renderInfoCard(
                  <FaUser />,
                  "Tài xế",
                  currentTrip.driverName,
                  "driverId",
                )}
                {renderInfoCard(
                  <FaUserTie />,
                  "Phụ xe",
                  currentTrip.subDriverName,
                  "subDriverId",
                )}

                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>
                    <FaCalendarAlt /> Ngày & Giờ
                  </div>
                  <div className={styles.infoValue}>
                    {formatDateTimePretty(
                      currentTrip.date,
                      currentTrip.departureTime,
                    )}
                  </div>
                </div>

                {renderInfoCard(
                  <FaRegMoneyBillAlt />,
                  "Giá vé",
                  currentTrip.price,
                  "price",
                  true,
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className={styles.rightColumn}>
              <TripMap
                tripId={currentTrip.tripId}
                routeInfo={{
                  origin: origin,
                  destination: destination,
                  startTime:
                    currentTrip.departureTime?.substring(0, 5) || "--:--",
                  endTime: currentTrip.arrivalTime?.substring(0, 5) || "--:--",
                }}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.footer}>
            {hasBookings ? (
              <button
                className={styles.deleteBtn}
                title="Không thể xóa chuyến đi đã có vé đặt"
                disabled
              >
                <FaTrash /> Xóa (Có vé đặt)
              </button>
            ) : (
              <button className={styles.deleteBtn} onClick={handleDeleteClick}>
                <FaTrash /> Xóa chuyến
              </button>
            )}

            <div className={styles.rightActions}>
              {isEditing ? (
                <>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.cancelBtn} onClick={onClose}>
                    Đóng
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() =>
                      canEdit
                        ? setIsEditing(true)
                        : alert("Chỉ có thể sửa chuyến Waiting hoặc Delayed")
                    }
                    style={{
                      opacity: canEdit ? 1 : 0.5,
                      cursor: canEdit ? "pointer" : "not-allowed",
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteTripModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        trip={currentTrip}
      />
    </>
  );
};

export default TripDetailsModal;
