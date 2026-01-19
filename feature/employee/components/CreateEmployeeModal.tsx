import { useState } from "react";
import { CreateEmployeeRequest } from "../api/employeeApi";
import { validateImageFile } from "@/shared/utils/imageUpload";
import styles from "./EmployeeModal.module.css";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmployeeRequest, avatarFile?: File) => Promise<void>;
}

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    avatarUrl: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, avatarUrl: url }));
    setAvatarPreview(url);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file
      validateImageFile(file);

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "File không hợp lệ");
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
        avatarUrl: "",
        address: "",
      });
      setAvatarPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo nhân viên thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "650px" }}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Tạo tài khoản nhân viên</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Account Information */}
          <div className={styles.section}>
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
                  placeholder="Nguyễn Thị B"
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
                  placeholder="employee@example.com"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Mật khẩu <span className={styles.required}>*</span>
                </label>
                <div style={{ position: "relative" }}>
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
                    className={styles.togglePasswordBtn}
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
                <small className={styles.hint}>10-11 chữ số</small>
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>🖼️ Ảnh đại diện</h3>

            <div className={styles.field}>
              <label className={styles.label}>Tải ảnh lên</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
                    className={styles.avatarImg}
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

            <div className={styles.field}>
              <label className={styles.label}>Hoặc nhập URL ảnh</label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleAvatarChange}
                className={styles.input}
                placeholder="https://example.com/avatar.jpg"
              />
              {/* Nếu có preview từ URL thì cũng hiện ở đây */}
              {formData.avatarUrl && !selectedFile && (
                <div className={styles.avatarPreviewContainer}>
                  <img
                    src={formData.avatarUrl}
                    alt="URL Preview"
                    className={styles.avatarImg}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ marginBottom: "20px" }}>
            <h3 className={styles.sectionTitle}>📋 Thông tin bổ sung</h3>

            <div className={styles.field}>
              <label className={styles.label}>Địa chỉ</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                rows={3}
                maxLength={255}
              />
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
              {loading ? "Đang tạo..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
