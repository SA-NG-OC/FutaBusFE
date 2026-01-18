import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./VehicleModal.module.css";
import { vehicleTypeApi, VehicleTypeResponse } from "@/feature/vehicle/api/vehicleTypeApi";

// Vehicle data interface
interface VehicleData {
  vehicleId?: number;
  licensePlate: string;
  vehicleType: string;
  typeId: number;
  capacity: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  insuranceNumber?: string;
  insuranceExpiry?: string;
  notes?: string;
}

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: VehicleData) => Promise<void>;
  vehicle?: VehicleData | null; // null = add mode, VehicleData = edit mode
  loading?: boolean;
}

// Form validation errors
interface FormErrors {
  licensePlate?: string;
  vehicleType?: string;
}

export default function VehicleModal({
  isOpen,
  onClose,
  onSave,
  vehicle = null,
  loading = false,
}: VehicleModalProps) {
  // Vehicle type options state - loaded from API
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState<VehicleTypeResponse[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Status options
  const statusOptions = [
    { value: "ACTIVE" as const, label: "Hoạt động" },
    { value: "INACTIVE" as const, label: "Không hoạt động" },
    { value: "MAINTENANCE" as const, label: "Bảo trì" },
  ];
  
  // Form state
  const [formData, setFormData] = useState<VehicleData>({
    licensePlate: "",
    vehicleType: "",
    typeId: 0,
    capacity: 0,
    status: "ACTIVE",
    insuranceNumber: "",
    insuranceExpiry: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vehicle types on component mount
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const fetchVehicleTypes = async () => {
    setLoadingTypes(true);
    try {
      const types = await vehicleTypeApi.getAllForSelection();
      setVehicleTypeOptions(types);
      
      // Set default typeId if not editing
      if (!vehicle && types.length > 0) {
        setFormData(prev => ({
          ...prev,
          typeId: types[0].typeId,
          vehicleType: types[0].typeName,
          capacity: types[0].totalSeats
        }));
      }
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  // Initialize form data when modal opens or vehicle changes
  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        // Edit mode - populate form with vehicle data
        setFormData({
          ...vehicle,
          insuranceNumber: vehicle.insuranceNumber || "",
          insuranceExpiry: vehicle.insuranceExpiry || "",
          notes: vehicle.notes || "",
        });
      } else {
        // Add mode - reset form with first vehicle type as default
        const firstType = vehicleTypeOptions.length > 0 ? vehicleTypeOptions[0] : null;
        setFormData({
          licensePlate: "",
          vehicleType: firstType?.typeName || "",
          typeId: firstType?.typeId || 0,
          capacity: firstType?.totalSeats || 0,
          status: "ACTIVE",
          insuranceNumber: "",
          insuranceExpiry: "",
          notes: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, vehicle, vehicleTypeOptions]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // License plate validation
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "Biển số xe là bắt buộc";
    } else if (
      !/^[0-9]{2}[A-Z]-[0-9]{3}\.[0-9]{2}$/.test(formData.licensePlate.trim())
    ) {
      // Vietnamese license plate format: 29A-123.45
      newErrors.licensePlate =
        "Biển số xe không đúng định dạng (VD: 29A-123.45)";
    }

    // Vehicle type validation
    if (!formData.typeId) {
      newErrors.vehicleType = "Loại xe là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof VehicleData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up form data
      const submitData: VehicleData = {
        ...formData,
        licensePlate: formData.licensePlate.trim().toUpperCase(),
        insuranceNumber: formData.insuranceNumber?.trim() || undefined,
        insuranceExpiry: formData.insuranceExpiry || undefined,
        notes: formData.notes?.trim() || undefined,
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      // Handle error (could set a general error state)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEditMode = !!vehicle;
  const modalTitle = isEditMode ? "Chỉnh sửa xe" : "Thêm xe mới";

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{modalTitle}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* License Plate & Vehicle Type */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Biển số xe <span className={styles.labelRequired}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) =>
                    handleInputChange("licensePlate", e.target.value)
                  }
                  placeholder="VD: 29A-123.45"
                  className={`${styles.input} ${
                    errors.licensePlate ? styles.inputError : ""
                  }`}
                  disabled={isSubmitting}
                />
                {errors.licensePlate && (
                  <span className={styles.errorText}>
                    {errors.licensePlate}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Loại xe <span className={styles.labelRequired}>*</span>
                </label>
                <select
                  value={formData.typeId}
                  onChange={(e) => {
                    const typeId = parseInt(e.target.value || "0", 10);
                    const selectedType = vehicleTypeOptions.find(
                      (t) => t.typeId === typeId,
                    );
                    handleInputChange("typeId", typeId);
                    if (selectedType) {
                      handleInputChange("vehicleType", selectedType.typeName);
                      handleInputChange("capacity", selectedType.totalSeats);
                    }
                  }}
                  className={`${styles.select} ${
                    errors.vehicleType ? styles.selectError : ""
                  }`}
                  disabled={isSubmitting || loadingTypes}
                >
                  <option value="">{loadingTypes ? "Đang tải..." : "Chọn loại xe"}</option>
                  {vehicleTypeOptions.map((option) => (
                    <option key={option.typeId} value={String(option.typeId)}>
                      {option.typeName} ({option.totalSeats} chỗ)
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <span className={styles.errorText}>{errors.vehicleType}</span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Trạng thái</label>
              <div className={styles.radioGroup}>
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`${styles.radioOption} ${
                      formData.status === option.value
                        ? styles.radioOptionSelected
                        : ""
                    }`}
                    onClick={() => handleInputChange("status", option.value)}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={() => handleInputChange("status", option.value)}
                      className={styles.radioInput}
                      disabled={isSubmitting}
                    />
                    <span className={styles.radioLabel}>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Information */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số bảo hiểm</label>
                <input
                  type="text"
                  value={formData.insuranceNumber || ""}
                  onChange={(e) =>
                    handleInputChange("insuranceNumber", e.target.value)
                  }
                  placeholder="Số bảo hiểm xe"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày hết hạn bảo hiểm</label>
                <input
                  type="date"
                  value={formData.insuranceExpiry || ""}
                  onChange={(e) =>
                    handleInputChange("insuranceExpiry", e.target.value)
                  }
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Ghi chú</label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Ghi chú thêm về xe..."
                className={styles.textarea}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isSubmitting}
          >
            {isSubmitting && <div className={styles.loadingSpinner}></div>}
            {isEditMode ? "Cập nhật" : "Thêm xe"}
          </button>
        </div>
      </div>
    </div>
  );
}
