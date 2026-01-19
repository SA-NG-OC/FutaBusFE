import { useState } from "react";
import { Employee } from "../api/employeeApi";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  employee: Employee | null;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  employee,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Xóa thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconWarning}>⚠️</div>
          <h2 className={styles.title}>Xóa Nhân Viên</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong>{employee.fullName}</strong> không?
          </p>
          <div className={styles.details}>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>SĐT:</strong> {employee.phoneNumber}
            </p>
          </div>
          <p className={styles.warning}>
            Hành động này không thể hoàn tác. Nhân viên sẽ bị xóa vĩnh viễn khỏi
            hệ thống.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={styles.btnCancel}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className={styles.btnDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
