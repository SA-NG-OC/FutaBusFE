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
  FaRegMoneyBillAlt,
  FaTrash,
} from "react-icons/fa";
// Import modal xác nhận xóa
import DeleteTripModal from "../DeleteTripModal/DeleteTripModal";
// [NEW] Import Map Component
import TripMap from "@/src/components/TrackingMap/index";

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData | null;
  vehicles: VehicleSelection[];
  drivers: DriverSelection[];
  subDrivers: DriverSelection[];
  onDelete: (id: number) => Promise<boolean>;
  onUpdate: (id: number, data: any) => Promise<boolean>;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    vehicleId: number;
    driverId: number;
    subDriverId?: number;
    price: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    if (isOpen && trip) {
      setIsEditing(false);

      const foundVehicle = vehicles.find((v: VehicleSelection) =>
        trip.vehicleInfo?.includes(v.licensePlate)
      );
      const foundDriver = drivers.find(
        (d: DriverSelection) => trip.driverName === d.driverName
      );

      setEditData({
        vehicleId: foundVehicle ? foundVehicle.vehicleId : 0,
        driverId: foundDriver ? foundDriver.driverId : 0,
        subDriverId: 0,
        price: trip.price,
      });
    }
  }, [isOpen, trip, vehicles, drivers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDeleteConfirm) setShowDeleteConfirm(false);
        else if (isEditing) setIsEditing(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, showDeleteConfirm]);

  if (!isOpen || !trip) return null;

  // --- LOGIC TÍNH TOÁN ---
  const totalSeats = trip.totalSeats ?? 0;
  const bookedSeats = trip.bookedSeats ?? 0;
  const checkedInSeats = trip.checkedInSeats ?? 0;

  const hasBookings = bookedSeats > 0;
  const canEdit = ["Waiting", "Delayed"].includes(trip.status);

  // [NEW] Xử lý thông tin Route cho Map
  // Giả sử routeName dạng "HCM -> Da Lat" hoặc "HCM - Da Lat"
  const routeParts = trip.routeName
    ? trip.routeName.split(/->|-/).map((s) => s.trim())
    : [];
  const origin = routeParts[0] || "Origin";
  const destination = routeParts[1] || "Destination";

  // --- HANDLERS ---
  const handleSave = async () => {
    if (!editData) return;
    setIsSaving(true);
    const success = await onUpdate(trip.tripId, editData);
    setIsSaving(false);
    if (success) setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const success = await onDelete(trip.tripId);
    if (success) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const formatDateTimePretty = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "N/A";
    const dateObj = new Date(dateStr);
    const datePart = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const timePart = timeStr?.substring(0, 5) || "--:--";
    return (
      <span>
        {datePart} <span style={{ margin: "0 6px", color: "#ccc" }}>•</span>{" "}
        <b>{timePart}</b>
      </span>
    );
  };

  const renderInfoCard = (
    icon: React.ReactNode,
    label: string,
    displayValue: React.ReactNode,
    fieldKey: "vehicleId" | "driverId" | "price",
    isCurrency = false
  ) => {
    return (
      <div
        className={`${styles.infoCard} ${
          canEdit && isEditing ? styles.editable : ""
        }`}
        onClick={() => {
          /* Focus logic */
        }}
      >
        <div className={styles.infoLabel}>
          {icon} {label}
        </div>

        {isEditing && canEdit && editData ? (
          fieldKey === "price" ? (
            <input
              type="number"
              className={styles.editInput}
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: Number(e.target.value) })
              }
              autoFocus
            />
          ) : fieldKey === "vehicleId" ? (
            <select
              className={styles.editSelect}
              value={editData.vehicleId}
              onChange={(e) =>
                setEditData({ ...editData, vehicleId: Number(e.target.value) })
              }
            >
              <option value={0}>Select Vehicle</option>
              {vehicles.map((v: VehicleSelection) => (
                <option key={v.vehicleId} value={v.vehicleId}>
                  {v.licensePlate} ({v.vehicleTypeName})
                </option>
              ))}
            </select>
          ) : (
            <select
              className={styles.editSelect}
              value={editData.driverId}
              onChange={(e) =>
                setEditData({ ...editData, driverId: Number(e.target.value) })
              }
            >
              <option value={0}>Select Driver</option>
              {drivers.map((d: DriverSelection) => (
                <option key={d.driverId} value={d.driverId}>
                  {d.driverName}
                </option>
              ))}
            </select>
          )
        ) : (
          <div
            className={`${styles.infoValue} ${isCurrency ? styles.price : ""}`}
          >
            {isCurrency && typeof displayValue === "number"
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(displayValue)
              : displayValue}
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
              <h2>Trip Details</h2>
              <div className={styles.routeRow}>
                <span className={styles.routeName}>{trip.routeName}</span>
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor:
                      trip.status === "Waiting"
                        ? "var(--badge-waiting-bg)"
                        : "var(--badge-completed-bg)",
                    color:
                      trip.status === "Waiting"
                        ? "var(--badge-waiting-text)"
                        : "var(--text-secondary)",
                  }}
                >
                  {trip.status}
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
                    <span className={styles.statLabel}>Total Seats</span>
                    <span className={styles.statValue}>{totalSeats}</span>
                  </div>
                  <div className={`${styles.statIcon} ${styles.iconBlue}`}>
                    <FaUsers />
                  </div>
                </div>
                <div className={`${styles.statCard} ${styles.cardRed}`}>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Booked</span>
                    <span className={styles.statValue}>{bookedSeats}</span>
                  </div>
                  <div className={`${styles.statIcon} ${styles.iconRed}`}>
                    <FaShoppingCart />
                  </div>
                </div>
                <div className={`${styles.statCard} ${styles.cardGreen}`}>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Checked In</span>
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
                  "Vehicle",
                  trip.vehicleInfo,
                  "vehicleId"
                )}
                {renderInfoCard(
                  <FaUser />,
                  "Driver",
                  trip.driverName,
                  "driverId"
                )}
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>
                    <FaCalendarAlt /> Date & Time
                  </div>
                  <div className={styles.infoValue}>
                    {formatDateTimePretty(trip.date, trip.departureTime)}
                  </div>
                </div>
                {renderInfoCard(
                  <FaRegMoneyBillAlt />,
                  "Price",
                  trip.price,
                  "price",
                  true
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - [UPDATED] Map Only */}
            <div className={styles.rightColumn}>
              {/* Component TripMap mới */}
              <TripMap
                tripId={trip.tripId}
                routeInfo={{
                  origin: origin,
                  destination: destination,
                  startTime: trip.departureTime?.substring(0, 5) || "--:--",
                  endTime: trip.arrivalTime?.substring(0, 5) || "--:--",
                }}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.footer}>
            {hasBookings ? (
              <button
                className={styles.deleteBtn}
                style={{
                  opacity: 0.6,
                  cursor: "not-allowed",
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-gray)",
                  boxShadow: "none",
                }}
                title="Cannot delete trip with active bookings."
                disabled
              >
                <FaTrash /> Delete (Has Bookings)
              </button>
            ) : (
              <button className={styles.deleteBtn} onClick={handleDeleteClick}>
                <FaTrash /> Delete
              </button>
            )}

            <div className={styles.rightActions}>
              {isEditing ? (
                <>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.cancelBtn} onClick={onClose}>
                    Close
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() =>
                      canEdit
                        ? setIsEditing(true)
                        : alert("Cannot edit this trip status")
                    }
                    style={{
                      opacity: canEdit ? 1 : 0.5,
                      cursor: canEdit ? "pointer" : "not-allowed",
                    }}
                  >
                    Edit Trip
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
        trip={trip}
      />
    </>
  );
};

export default TripDetailsModal;
