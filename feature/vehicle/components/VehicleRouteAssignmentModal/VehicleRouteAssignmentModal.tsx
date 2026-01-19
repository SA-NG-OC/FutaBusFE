"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/shared/utils/apiClient";
import { CreateVehicleRouteAssignmentRequest } from "@/feature/route/types/routeAssignment";
import { vehicleRouteAssignmentApi } from "@/feature/vehicle/api/vehicleRouteAssignmentApi";
import { toast } from "react-toastify";
// Import CSS Module
import styles from "./VehicleRouteAssignmentModal.module.css";

interface VehicleRouteAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
  vehicleName: string;
  onSuccess?: () => void;
}

interface RouteOption {
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
}

export default function VehicleRouteAssignmentModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
  onSuccess,
}: VehicleRouteAssignmentModalProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleRouteAssignmentRequest>(
    {
      vehicleId,
      routeId: 0,
      priority: 1,
      startDate: new Date().toISOString().split("T")[0],
      maintenanceSchedule: "",
      notes: "",
    },
  );

  useEffect(() => {
    if (isOpen) {
      fetchRoutes();
      setFormData((prev) => ({ ...prev, vehicleId }));
    }
  }, [isOpen, vehicleId]);

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

    const payload: CreateVehicleRouteAssignmentRequest = {
      vehicleId: vehicleId,
      routeId: formData.routeId,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate ?? undefined,
      maintenanceSchedule: formData.maintenanceSchedule?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    setLoading(true);
    try {
      await vehicleRouteAssignmentApi.create(payload);
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
          <h2 className={styles.title}>Gắn tuyến cho xe</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Vehicle Info */}
        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            Xe: <span className={styles.highlight}>{vehicleName}</span>
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
            <p className={styles.hint}>Số nhỏ = ưu tiên cao hơn</p>
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

          {/* End Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ngày kết thúc (tuỳ chọn)</label>
            <input
              type="date"
              value={formData.endDate || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endDate: e.target.value || undefined,
                })
              }
              className={styles.input}
            />
          </div>

          {/* Maintenance Schedule */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Lịch bảo trì</label>
            <select
              value={formData.maintenanceSchedule || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maintenanceSchedule: e.target.value,
                })
              }
              className={styles.select}
            >
              <option value="">-- Không bảo trì định kỳ --</option>
              <option value="Weekly">Hàng tuần (Weekly)</option>
              <option value="Bi-weekly">Hai tuần một lần (Bi-weekly)</option>
              <option value="Monthly">Hàng tháng (Monthly)</option>
              <option value="Quarterly">Hàng quý (Quarterly)</option>
            </select>
            <p className={styles.hint}>
              Chỉ định kỳ bảo trì nếu xe cần bảo trì định kỳ
            </p>
          </div>

          {/* Notes */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ghi chú</label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className={styles.textarea}
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
