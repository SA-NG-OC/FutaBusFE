// src/components/TripModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./TripModal.module.css";
import {
  FaTimes,
  FaChevronDown,
  FaSearch,
  FaBus,
  FaUser,
  FaRegMoneyBillAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  RouteSelection,
  VehicleSelection,
  DriverSelection,
  TripFormData,
  TripModalProps,
} from "@/feature/trip/types";

// --- INTERNAL CUSTOM SELECT COMPONENT ---
interface CustomSelectProps<T> {
  options: T[];
  value: string | number | undefined | null; // [FIX] Cho phép null
  onChange: (value: string | number) => void;
  placeholder: string;
  icon: React.ReactNode;
  renderOption: (option: T) => React.ReactNode;
  renderSelected: (option: T) => React.ReactNode;
  keyExtractor: (option: T) => string | number;
  searchKeys?: (keyof T)[];
}

function CustomSelect<T>({
  options,
  value,
  onChange,
  placeholder,
  icon,
  renderOption,
  renderSelected,
  keyExtractor,
  searchKeys = [],
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(
    (opt) => keyExtractor(opt).toString() === value?.toString(),
  );

  const filteredOptions = options.filter((opt) => {
    if (!searchQuery) return true;
    if (searchKeys.length === 0) return true;
    const query = searchQuery.toLowerCase();
    return searchKeys.some((key) =>
      String(opt[key]).toLowerCase().includes(query),
    );
  });

  return (
    <div className={styles["custom-select-container"]} ref={containerRef}>
      <div
        className={`${styles["select-trigger"]} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles["trigger-content"]}>
          <span className={styles["trigger-icon"]}>{icon}</span>
          {selectedOption ? (
            <span className={styles["trigger-text"]}>
              {renderSelected(selectedOption)}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <FaChevronDown className={styles["chevron-icon"]} />
      </div>

      {isOpen && (
        <div className={styles["select-dropdown"]}>
          {searchKeys.length > 0 && (
            <div className={styles["search-container"]}>
              <FaSearch className={styles["search-icon"]} />
              <input
                type="text"
                className={styles["search-input"]}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className={styles["options-list"]}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const key = keyExtractor(opt);
                const isSelected = key.toString() === value?.toString();
                return (
                  <div
                    key={key}
                    className={`${styles["option-item"]} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => {
                      onChange(key);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    {renderOption(opt)}
                  </div>
                );
              })
            ) : (
              <div
                className={styles["option-item"]}
                style={{
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN COMPONENT ---
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
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>();

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data: TripFormData) => {
    const selectedDateTime = new Date(`${data.date}T${data.departureTime}`);
    const now = new Date();
    if (selectedDateTime < now) {
      alert("Thời gian khởi hành không được ở trong quá khứ!");
      return;
    }
    if (data.subDriverId && data.driverId === data.subDriverId) {
      alert("Tài xế chính và Phụ xe không được trùng nhau!");
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
          <h2 className={styles["modal-title"]}>Tạo Chuyến Mới</h2>
        </div>

        <form
          className={styles["form-content"]}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          {/* Select Route */}
          <div className={styles["form-field"]}>
            <label className={styles["form-label"]}>
              Chọn Tuyến <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <Controller
              name="routeId"
              control={control}
              rules={{ required: "Vui lòng chọn tuyến đường" }}
              render={({ field }) => (
                <CustomSelect
                  options={routes}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Chọn tuyến đường..."
                  icon={<FaMapMarkerAlt />}
                  keyExtractor={(r) => r.routeId}
                  searchKeys={["routeName"]}
                  renderSelected={(r) => r.routeName}
                  renderOption={(r) => (
                    <>
                      <div className={styles["option-icon"]}>
                        <FaMapMarkerAlt />
                      </div>
                      <div className={styles["option-content"]}>
                        <span className={styles["option-primary-text"]}>
                          {r.routeName}
                        </span>
                      </div>
                    </>
                  )}
                />
              )}
            />
            {errors.routeId && (
              <span className={styles["error-text"]}>
                {errors.routeId.message}
              </span>
            )}
          </div>

          {/* Select Vehicle & Driver */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Chọn Xe <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <Controller
                name="vehicleId"
                control={control}
                rules={{ required: "Vui lòng chọn xe" }}
                render={({ field }) => (
                  <CustomSelect
                    options={vehicles}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chọn xe..."
                    icon={<FaBus />}
                    keyExtractor={(v) => v.vehicleId}
                    searchKeys={["licensePlate", "vehicleTypeName"]}
                    renderSelected={(v) =>
                      `${v.licensePlate} (${v.vehicleTypeName})`
                    }
                    renderOption={(v) => (
                      <>
                        <div className={styles["option-icon"]}>
                          <FaBus />
                        </div>
                        <div className={styles["option-content"]}>
                          <span className={styles["option-primary-text"]}>
                            {v.licensePlate}
                          </span>
                          <span className={styles["option-secondary-text"]}>
                            {v.vehicleTypeName}
                          </span>
                        </div>
                      </>
                    )}
                  />
                )}
              />
              {errors.vehicleId && (
                <span className={styles["error-text"]}>
                  {errors.vehicleId.message}
                </span>
              )}
            </div>

            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Chọn Tài Xế <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <Controller
                name="driverId"
                control={control}
                rules={{ required: "Vui lòng chọn tài xế" }}
                render={({ field }) => (
                  <CustomSelect
                    options={drivers}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chọn tài xế..."
                    icon={<FaUser />}
                    keyExtractor={(d) => d.driverId}
                    searchKeys={["driverName", "driverLicense"]}
                    renderSelected={(d) => d.driverName}
                    renderOption={(d) => (
                      <>
                        <div className={styles["option-icon"]}>
                          <FaUser />
                        </div>
                        <div className={styles["option-content"]}>
                          <span className={styles["option-primary-text"]}>
                            {d.driverName}
                          </span>
                          <span className={styles["option-secondary-text"]}>
                            GPLX: {d.driverLicense}
                          </span>
                        </div>
                      </>
                    )}
                  />
                )}
              />
              {errors.driverId && (
                <span className={styles["error-text"]}>
                  {errors.driverId.message}
                </span>
              )}
            </div>
          </div>

          {/* Sub-Driver & Price */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Chọn Phụ Xe (Tùy chọn)
              </label>
              <Controller
                name="subDriverId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={subDrivers}
                    value={field.value ?? ""} // [FIX] Fix lỗi Type null
                    onChange={field.onChange}
                    placeholder="Không có (Tùy chọn)..."
                    icon={<FaUser style={{ opacity: 0.7 }} />}
                    keyExtractor={(d) => d.driverId}
                    searchKeys={["driverName", "driverLicense"]}
                    renderSelected={(d) => d.driverName}
                    renderOption={(d) => (
                      <>
                        <div className={styles["option-icon"]}>
                          <FaUser style={{ opacity: 0.7 }} />
                        </div>
                        <div className={styles["option-content"]}>
                          <span className={styles["option-primary-text"]}>
                            {d.driverName}
                          </span>
                          <span className={styles["option-secondary-text"]}>
                            GPLX: {d.driverLicense}
                          </span>
                        </div>
                      </>
                    )}
                  />
                )}
              />
            </div>

            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Giá Vé (₫) <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <FaRegMoneyBillAlt
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                    fontSize: "1.1rem",
                  }}
                />
                <input
                  type="number"
                  className={styles["form-input"]}
                  style={{ paddingLeft: "48px", width: "100%" }}
                  placeholder="VD: 250000"
                  {...register("price", {
                    required: "Vui lòng nhập giá vé",
                    min: { value: 0, message: "Giá vé phải lớn hơn 0" },
                  })}
                />
              </div>
              {errors.price && (
                <span className={styles["error-text"]}>
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <label className={styles["form-label"]}>
                Ngày Khởi Hành{" "}
                <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="date"
                className={styles["form-input"]}
                {...register("date", { required: "Vui lòng chọn ngày" })}
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
                Giờ Khởi Hành <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <input
                type="time"
                className={styles["form-input"]}
                {...register("departureTime", { required: "Bắt buộc" })}
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
            {isLoading ? "Đang lưu..." : "Tạo Chuyến"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TripModal;
