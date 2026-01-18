import { useState } from 'react';
import { CreateEmployeeRequest } from '../api/employeeApi';
import { validateImageFile } from '@/shared/utils/imageUpload';
import styles from './EmployeeModal.module.css';

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
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    avatarUrl: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setError(err instanceof Error ? err.message : 'Invalid file');
      setSelectedFile(null);
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Submit form with file directly (no separate upload)
      await onSubmit(formData, selectedFile || undefined);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        avatarUrl: '',
        address: '',
      });
      setAvatarPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Employee Account</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* Account Information */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#D83E3E' }}>
              👤 Account Information
            </h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Full Name <span className={styles.required}>*</span>
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
                  Password <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Phone Number <span className={styles.required}>*</span>
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
                <small className={styles.hint}>10-11 digits</small>
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#D83E3E' }}>
              🖼️ Avatar Image
            </h3>

            <div className={styles.field}>
              <label className={styles.label}>Upload Avatar Image</label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className={styles.input}
              />
              <small className={styles.hint}>Max 5MB - JPG, PNG, GIF, WEBP</small>
              {avatarPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '3px solid #D83E3E' 
                    }}
                    onError={() => setAvatarPreview(null)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setSelectedFile(null);
                      setFormData((prev) => ({ ...prev, avatarUrl: '' }));
                    }}
                    style={{
                      display: 'block',
                      margin: '8px auto 0',
                      padding: '4px 12px',
                      fontSize: '12px',
                      color: '#991b1b',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Avatar URL</label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleAvatarChange}
                className={styles.input}
                placeholder="https://example.com/avatar.jpg"
              />
              {avatarPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: '2px solid #D83E3E' 
                    }}
                    onError={() => setAvatarPreview(null)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#D83E3E' }}>
              📋 Additional Information
            </h3>

            <div className={styles.field}>
              <label className={styles.label}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="123 Street, Ward, District, City"
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
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Employee Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
