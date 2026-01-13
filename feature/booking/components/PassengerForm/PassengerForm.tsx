"use client";
import React, { useState } from "react";
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

  const validateForm = (data: PassengerData) => {
    const newErrors = {
      name: "",
      phone: "",
      email: "",
    };

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+\d\s()-]+$/.test(data.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email address";
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

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Passenger Information</h3>

      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="John"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone Number</label>
        <input
          type="tel"
          className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
          placeholder="+84 123 456 789"
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
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>
    </div>
  );
}
