"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./TripModal.module.css";
import { FaTimes } from "react-icons/fa";
import {
  RouteSelection,
  VehicleSelection,
  DriverSelection,
  TripFormData,
} from "@/feature/trip/types";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TripFormData) => void;
  routes: RouteSelection[];
  vehicles: VehicleSelection[];
  drivers: DriverSelection[];
  subDrivers: DriverSelection[];
  isLoading?: boolean;
}

const TripModal = ({
  isOpen,
  onClose,
  onSubmit,
  routes = [],
  vehicles = [],
  drivers = [],
  subDrivers = [],
  isLoading = false,
}: TripModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>();

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data: TripFormData) => {
    // 1. Validate Frontend: Không cho chọn ngày giờ quá khứ
    // (Lưu ý: Nếu chỉ chọn ngày, departureTime cần ghép vào để so sánh chính xác)
    const selectedDateTime = new Date(`${data.date}T${data.departureTime}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert(
        "Departure time cannot be in the past! Please choose a future time."
      );
      return;
    }

    // 2. Validate Frontend: Tài xế và Phụ xe không được trùng nhau
    if (data.subDriverId && data.driverId === data.subDriverId) {
      alert("Main Driver and Sub Driver cannot be the same person!");
      return;
    }

    onSubmit(data);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles["close-button"]}
          onClick={onClose}
          type="button"
        >
          <FaTimes />
        </button>

        <div className={styles["modal-header"]}>
          <h2 className={styles["modal-title"]}>Schedule New Trip</h2>
        </div>

        <form
          className={styles["form-content"]}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          {/* --- Select Route --- */}
          <div className={styles["form-field"]}>
            <label className={styles["form-label"]}>
              Select Route <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <select
              className={styles["form-select"]}
              {...register("routeId", { required: "Please select a route" })}
            >
              <option value="">Choose route</option>
              {routes.map((r) => (
                <option key={r.routeId} value={r.routeId}>
                  {r.routeName}
                </option>
              ))}
            </select>
            {errors.routeId && (
              <span className={styles["error-text"]}>
                {errors.routeId.message}
              </span>
            )}
          </div>

          {/* --- Select Vehicle & Driver --- */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Select Vehicle{" "}
                <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <select
                className={styles["form-select"]}
                {...register("vehicleId", {
                  required: "Please select a vehicle",
                })}
              >
                <option value="">Choose vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleId} value={v.vehicleId}>
                    {v.licensePlate} - {v.vehicleTypeName}
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <span className={styles["error-text"]}>
                  {errors.vehicleId.message}
                </span>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Assign Driver <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <select
                className={styles["form-select"]}
                {...register("driverId", {
                  required: "Please select a driver",
                })}
              >
                <option value="">Choose driver</option>
                {drivers.map((d) => (
                  <option key={d.driverId} value={d.driverId}>
                    {d.driverName} ({d.driverLicense})
                  </option>
                ))}
              </select>
              {errors.driverId && (
                <span className={styles["error-text"]}>
                  {errors.driverId.message}
                </span>
              )}
            </div>
          </div>

          {/* --- Sub-Driver & Price --- */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>Assign Sub-Driver</label>
              <select
                className={styles["form-select"]}
                {...register("subDriverId")}
              >
                <option value="">No sub-driver</option>
                {subDrivers.map((d) => (
                  <option key={d.driverId} value={d.driverId}>
                    {d.driverName} ({d.driverLicense})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Ticket Price (₫){" "}
                <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="number"
                className={styles["form-input"]}
                placeholder="e.g. 250000"
                {...register("price", {
                  required: "Please enter ticket price",
                  min: { value: 0, message: "Price must be positive" },
                })}
              />
              {errors.price && (
                <span className={styles["error-text"]}>
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          {/* --- Date & Time --- */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Date <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="date"
                className={styles["form-input"]}
                {...register("date", { required: "Please select a date" })}
                // Validate chặn chọn ngày cũ trên UI
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <span className={styles["error-text"]}>
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Departure Time{" "}
                <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="time"
                className={styles["form-input"]}
                {...register("departureTime", { required: "Required" })}
              />
              {errors.departureTime && (
                <span className={styles["error-text"]}>
                  {errors.departureTime.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles["submit-button"]}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Schedule Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripModal;
