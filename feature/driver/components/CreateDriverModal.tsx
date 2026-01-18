import { useState } from "react";
import { CreateDriverWithAccountRequest } from "../api/driverApi";
import { validateImageFile } from "@/shared/utils/imageUpload";
import styles from "./CreateDriverModal.module.css";

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateDriverWithAccountRequest,
    avatarFile?: File,
  ) => Promise<void>;
}

export default function CreateDriverModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDriverModalProps) {
  const [formData, setFormData] = useState<CreateDriverWithAccountRequest>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    driverLicense: "",
    licenseExpiry: "",
    dateOfBirth: "",
    salary: 0,
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid file");
      setSelectedFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData, selectedFile || undefined);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        driverLicense: "",
        licenseExpiry: "",
        dateOfBirth: "",
        salary: 0,
        avatarUrl: "",
      });
      setAvatarPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create driver");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tạo tài xế mới (kèm tài khoản)</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Account Information */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>👤 Thông tin tài khoản</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nguyễn Văn A"
                  required
                  maxLength={100}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="driver@example.com"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Mật khẩu <span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Tối thiểu 8 ký tự"
                    required
                    minLength={8}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Số điện thoại <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="0912345678"
                  required
                  pattern="[0-9]{10,11}"
                />
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>🖼️ Ảnh đại diện</h3>
            <div className={styles.field}>
              <label className={styles.label}>Tải ảnh lên</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.input}
              />
              <small className={styles.hint}>
                Tối đa 5MB - JPG, PNG, GIF, WEBP
              </small>

              {avatarPreview && (
                <div className={styles.avatarPreviewContainer}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className={styles.avatarImage}
                    onError={() => setAvatarPreview(null)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setSelectedFile(null);
                      setFormData((prev) => ({ ...prev, avatarUrl: "" }));
                    }}
                    className={styles.btnRemoveAvatar}
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Driver Information */}
          <div style={{ marginBottom: "20px" }}>
            <h3 className={styles.sectionTitle}>
              🚗 Thông tin bằng lái & Hợp đồng
            </h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Số bằng lái <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="driverLicense"
                  value={formData.driverLicense}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="B2-123456"
                  required
                  maxLength={50}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Ngày hết hạn bằng <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Ngày sinh <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  max={
                    new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
                <small className={styles.hint}>Phải từ 18 tuổi trở lên</small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Lương cơ bản (VND)</label>
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
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo tài khoản & Tài xế"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
