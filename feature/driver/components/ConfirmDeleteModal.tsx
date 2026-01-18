import { Driver } from '../api/driverApi';
import styles from './ConfirmDeleteModal.module.css';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  driver: Driver | null;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  driver,
}: ConfirmDeleteModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  if (!isOpen || !driver) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Confirm Delete</h2>
        </div>

        <div className={styles.content}>
          <div className={styles.warning}>⚠️</div>
          <p className={styles.message}>
            Are you sure you want to delete driver <strong>{driver.fullName}</strong>?
          </p>
          <p className={styles.detail}>
            License: {driver.driverLicense}
          </p>
          <p className={styles.notice}>
            This action cannot be undone.
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.btnCancel}>
            Cancel
          </button>
          <button onClick={handleConfirm} className={styles.btnDelete}>
            Delete Driver
          </button>
        </div>
      </div>
    </div>
  );
}
