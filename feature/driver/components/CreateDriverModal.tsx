import { useState } from 'react';
import { CreateDriverWithAccountRequest } from '../api/driverApi';
import { validateImageFile } from '@/shared/utils/imageUpload';
import styles from './DriverModal.module.css';

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDriverWithAccountRequest, avatarFile?: File) => Promise<void>;
}

export default function CreateDriverModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDriverModalProps) {
  const [formData, setFormData] = useState<CreateDriverWithAccountRequest>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    driverLicense: '',
    licenseExpiry: '',
    dateOfBirth: '',
    salary: 0,
    avatarUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
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
        driverLicense: '',
        licenseExpiry: '',
        dateOfBirth: '',
        salary: 0,
        avatarUrl: '',
      });
      setAvatarPreview(null);
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Driver with Account</h2>
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
          </div>

          {/* Driver Information */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#D83E3E' }}>
              🚗 Driver Information
            </h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Driver License <span className={styles.required}>*</span>
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
                  License Expiry <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Date of Birth <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
                <small className={styles.hint}>Must be at least 18 years old</small>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Salary (VND)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="10,000,000"
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
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Driver & Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
