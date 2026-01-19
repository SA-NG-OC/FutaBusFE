"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import RegisterModal from "@/src/components/RegisterModal/RegisterModal";
import styles from "./PassengerForm.module.css";

interface PassengerFormProps {
  onFormChange?: (isValid: boolean, data: PassengerData) => void;
}

export interface PassengerData {
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  specialNote: string;
}

export default function PassengerForm({ onFormChange }: PassengerFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [formData, setFormData] = useState<PassengerData>({
    name: "",
    phone: "",
    email: "",
    pickupAddress: "",
    dropoffAddress: "",
    specialNote: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    pickupAddress: "",
    dropoffAddress: "",
    specialNote: "",
  });

  // Auto-fill user info if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const autoFilledData = {
        name: user.fullName || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
        pickupAddress: "",
        dropoffAddress: "",
        specialNote: "",
      };
      setFormData(autoFilledData);
      validateForm(autoFilledData);
    }
  }, [isAuthenticated, user]);

  const validateForm = (data: PassengerData) => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      pickupAddress: "",
      dropoffAddress: "",
      specialNote: "",
    };

    if (!data.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[+\d\s()-]+$/.test(data.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!data.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // pickupAddress, dropoffAddress, and specialNote are optional - no validation needed

    setErrors(newErrors);

    const isValid = !newErrors.name && !newErrors.phone && !newErrors.email;

    if (onFormChange) {
      console.log("🔄 PassengerForm - Calling onFormChange with:", {
        isValid,
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          pickupAddress: data.pickupAddress,
          dropoffAddress: data.dropoffAddress,
          specialNote: data.specialNote,
        },
      });
      onFormChange(isValid, data);
    }

    return isValid;
  };

  const handleChange = (field: keyof PassengerData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Debug log to verify data updates
    console.log(`📝 PassengerForm - ${field} changed:`, value);

    validateForm(newData);
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Thông tin hành khách</h3>

      {isAuthenticated && (
        <div className={styles.autoFillNote}>
          ✅ Thông tin đã được tự động điền từ tài khoản của bạn
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Họ và tên</label>
        <input
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="Nguyễn Văn A"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Số điện thoại</label>
        <input
          type="tel"
          className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
          placeholder="0901 234 567"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa chỉ đón (tùy chọn)</label>
        <input
          type="text"
          className={`${styles.input} ${errors.pickupAddress ? styles.inputError : ""}`}
          placeholder="Nhập địa chỉ đón"
          value={formData.pickupAddress}
          onChange={(e) => handleChange("pickupAddress", e.target.value)}
        />
        {errors.pickupAddress && (
          <span className={styles.error}>{errors.pickupAddress}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa chỉ trả (tùy chọn)</label>
        <input
          type="text"
          className={`${styles.input} ${errors.dropoffAddress ? styles.inputError : ""}`}
          placeholder="Nhập địa chỉ trả"
          value={formData.dropoffAddress}
          onChange={(e) => handleChange("dropoffAddress", e.target.value)}
        />
        {errors.dropoffAddress && (
          <span className={styles.error}>{errors.dropoffAddress}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Ghi chú đặc biệt (tùy chọn)</label>
        <textarea
          className={`${styles.input} ${styles.textarea} ${errors.specialNote ? styles.inputError : ""}`}
          placeholder="Nhập ghi chú nếu có (ví dụ: cần trợ giúp với hành lý, yêu cầu ghế đặc biệt...)"
          value={formData.specialNote}
          onChange={(e) => handleChange("specialNote", e.target.value)}
          rows={3}
        />
        {errors.specialNote && (
          <span className={styles.error}>{errors.specialNote}</span>
        )}
      </div>

      {/* Register prompt for guests */}
      {!isAuthenticated && (
        <div className={styles.registerPrompt}>
          <span className={styles.giftIcon}>🎁</span>
          <button
            type="button"
            className={styles.registerLink}
            onClick={handleOpenRegisterModal}
          >
            Nhấp vào đây để đăng ký tài khoản và nhận nhiều ưu đãi!
          </button>
        </div>
      )}

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        prefillData={{
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
        }}
      />
    </div>
  );
}
