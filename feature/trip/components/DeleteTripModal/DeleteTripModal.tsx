"use client";

import React, { useState } from "react";
import styles from "./DeleteTripModal.module.css";
import { TripData } from "@/feature/trip/types";
import {
  FaTimes,
  FaExclamationTriangle,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaBus,
  FaUser,
  FaTag,
} from "react-icons/fa";

interface DeleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  trip: TripData | null;
}

const DeleteTripModal = ({
  isOpen,
  onClose,
  onConfirm,
  trip,
}: DeleteTripModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !trip) return null;

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Modal sẽ được đóng bởi parent sau khi xóa thành công
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  // Format tiền tệ
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <FaExclamationTriangle className={styles.warningIcon} />
          </div>
          <div className={styles.headerText}>
            <h3>Confirm Delete</h3>
            <p>This action cannot be undo</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <p className={styles.confirmText}>
            Are you sure you want to delete trip{" "}
            <strong>{trip.routeName}</strong> (#{trip.tripId})?
          </p>

          {/* Summary Info Box */}
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <FaCalendarAlt className={styles.summaryIcon} />
              {trip.date}
            </div>
            <div className={styles.summaryRow}>
              <FaClock className={styles.summaryIcon} />
              {trip.departureTime?.substring(0, 5)}
            </div>
            <div className={styles.summaryRow}>
              <FaBus className={styles.summaryIcon} />
              {trip.vehicleInfo}
            </div>
            <div className={styles.summaryRow}>
              <FaUser className={styles.summaryIcon} />
              {trip.driverName}
            </div>
            <div className={styles.summaryRow}>
              <FaTag className={styles.summaryIcon} />
              <span className={styles.summaryPrice}>
                {formatCurrency(trip.price)}
              </span>
            </div>
          </div>

          {/* Warning Box */}
          <div className={styles.warningBox}>
            <strong>Warning:</strong> This will permanently delete the trip
            schedule. Any passengers who have booked this trip will need to be
            notified.
          </div>
        </div>

        {/* Footer Buttons */}
        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleConfirmClick}
            disabled={isDeleting}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <FaTrash /> Delete Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTripModal;
