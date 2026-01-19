"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/shared/utils/apiClient";
import { CreateDriverRouteAssignmentRequest } from "@/feature/route/types/routeAssignment";
import { driverRouteAssignmentApi } from "@/feature/driver/api/driverRouteAssignmentApi";
import { toast } from "react-toastify";
// Import CSS Module
import styles from "./DriverRouteAssignmentModal.module.css";

interface DriverRouteAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: number;
  driverName: string;
  onSuccess?: () => void;
}

interface RouteOption {
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
}

export default function DriverRouteAssignmentModal({
  isOpen,
  onClose,
  driverId,
  driverName,
  onSuccess,
}: DriverRouteAssignmentModalProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDriverRouteAssignmentRequest>({
    driverId,
    routeId: 0,
    preferredRole: "Main", // Mặc định là tài xế chính
    priority: 1,
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchRoutes();
      setFormData((prev) => ({ ...prev, driverId }));
    }
  }, [isOpen, driverId]);

  const fetchRoutes = async () => {
    try {
      const response = await api.get<RouteOption[]>("/routes/selection");
      setRoutes(response);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Không thể tải danh sách tuyến đường");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.routeId) {
      toast.warning("Vui lòng chọn tuyến đường");
      return;
    }

    setLoading(true);
    try {
      await driverRouteAssignmentApi.create(formData);
      toast.success("Gắn tuyến thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating assignment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi gắn tuyến";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Gắn tuyến cho tài xế</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Driver Info */}
        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            Tài xế: <span className={styles.highlight}>{driverName}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Route Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tuyến đường <span className={styles.required}>*</span>
            </label>
            <select
              value={formData.routeId}
              onChange={(e) =>
                setFormData({ ...formData, routeId: Number(e.target.value) })
              }
              required
              className={styles.select}
            >
              <option value="">-- Chọn tuyến --</option>
              {routes.map((route) => (
                <option key={route.routeId} value={route.routeId}>
                  {route.routeName} ({route.origin} → {route.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Role (Riêng cho Driver) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Vai trò</label>
            <select
              value={formData.preferredRole}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredRole: e.target.value as "Main" | "Backup",
                })
              }
              className={styles.select}
            >
              <option value="Main">Tài xế chính (Main)</option>
              <option value="Backup">Tài xế phụ (Backup)</option>
            </select>
          </div>

          {/* Priority */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Độ ưu tiên</label>
            <input
              type="number"
              min="1"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
              className={styles.input}
            />
          </div>

          {/* Start Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Ngày bắt đầu <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
              className={styles.input}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={styles.btnCancel}
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.btnSubmit}
            >
              {loading ? "Đang xử lý..." : "Gắn tuyến"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
