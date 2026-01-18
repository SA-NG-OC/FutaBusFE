import { useState } from 'react';
import { Employee } from '../api/employeeApi';
import styles from './ConfirmDeleteModal.module.css';

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
      console.error('Delete failed:', error);
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
          <h2 className={styles.title}>Delete Employee</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Are you sure you want to delete employee <strong>{employee.fullName}</strong>?
          </p>
          <div className={styles.details}>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phoneNumber}</p>
          </div>
          <p className={styles.warning}>
            This action cannot be undone. The employee will be permanently removed from the system.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={styles.btnCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={styles.btnDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
