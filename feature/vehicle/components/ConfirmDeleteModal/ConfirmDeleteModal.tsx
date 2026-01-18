import React, { useEffect } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import styles from "./ConfirmDeleteModal.module.css";

interface VehicleData {
  vehicleId: number;
  licensePlate: string;
  vehicleType: string;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  vehicle: VehicleData | null;
  loading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
  loading = false,
}: ConfirmDeleteModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, loading]);

  // Handle backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Handle confirm deletion
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      // Error handling could be expanded here
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header with warning icon */}
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <FaExclamationTriangle className={styles.warningIcon} size={24} />
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={loading}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <h2 className={styles.title}>Xác nhận xóa xe</h2>

          <div className={styles.message}>
            <p className={styles.warningText}>
              Bạn có chắc chắn muốn xóa xe này không? Hành động này không thể
              hoàn tác.
            </p>
          </div>

          {/* Vehicle info */}
          <div className={styles.vehicleInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Biển số xe:</span>
              <span className={styles.infoValue}>{vehicle.licensePlate}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Loại xe:</span>
              <span className={styles.infoValue}>{vehicle.vehicleType}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Sức chứa:</span>
              <span className={styles.infoValue}>{vehicle.capacity} chỗ</span>
            </div>
          </div>

          {/* Warning note */}
          <div className={styles.warningNote}>
            <p className={styles.warningNoteText}>
              ⚠️ Xóa xe sẽ ảnh hưởng đến:
            </p>
            <ul className={styles.warningList}>
              <li>Các chuyến đi đã lên lịch sử dụng xe này</li>
              <li>Lịch sử bảo trì và hoạt động của xe</li>
              <li>Báo cáo thống kê liên quan</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`${styles.button} ${styles.buttonDanger}`}
            disabled={loading}
          >
            {loading && <div className={styles.loadingSpinner}></div>}
            Xóa xe
          </button>
        </div>
      </div>
    </div>
  );
}
