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
}

export default function PassengerForm({ onFormChange }: PassengerFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<PassengerData>({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Auto-fill user info if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const autoFilledData = {
        name: user.fullName || "",
        phone: user.phoneNumber || "",
        email: user.email || "",
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

    setErrors(newErrors);

    const isValid = !newErrors.name && !newErrors.phone && !newErrors.email;

    if (onFormChange) {
      onFormChange(isValid, data);
    }

    return isValid;
  };

  const handleChange = (field: keyof PassengerData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
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
