import { useEffect, useState } from 'react';
import { Driver, DriverRequest } from '../api/driverApi';
import styles from './DriverModal.module.css';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverRequest) => Promise<void>;
  initialData: Driver | null;
  title: string;
}

export default function DriverModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: DriverModalProps) {
  const [formData, setFormData] = useState<DriverRequest>({
    userId: 0,
    driverLicense: '',
    licenseExpiry: '',
    dateOfBirth: '',
    salary: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        driverLicense: initialData.driverLicense,
        licenseExpiry: initialData.licenseExpiry.split('T')[0],
        dateOfBirth: initialData.dateOfBirth.split('T')[0],
        salary: initialData.salary,
      });
    } else {
      setFormData({
        userId: 0,
        driverLicense: '',
        licenseExpiry: '',
        dateOfBirth: '',
        salary: 0,
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'userId' || name === 'salary' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save driver');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                User ID <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={styles.input}
                required
                disabled={!!initialData}
                min="1"
              />
              <small className={styles.hint}>
                {initialData ? 'Cannot change user ID' : 'Enter the user ID to associate with this driver'}
              </small>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Driver License <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="driverLicense"
                value={formData.driverLicense}
                onChange={handleChange}
                className={styles.input}
                placeholder="B2-12345"
                required
                maxLength={50}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                License Expiry <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Date of Birth <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={styles.input}
                required
                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              <small className={styles.hint}>Must be at least 18 years old</small>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Salary (VND)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={styles.input}
              placeholder="10000000"
              min="0"
              step="100000"
            />
          </div>

          {initialData && (
            <div className={styles.driverInfo}>
              <p><strong>Full Name:</strong> {initialData.fullName}</p>
              <p><strong>Email:</strong> {initialData.email}</p>
              <p><strong>Phone:</strong> {initialData.phoneNumber}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : initialData ? 'Update Driver' : 'Create Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
