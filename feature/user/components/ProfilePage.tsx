'use client';

import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaKey, FaCamera, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { userApi } from '@/feature/user/api';
import { ProfileData, UpdateProfileRequest, UpdatePasswordRequest } from '@/feature/user/types';
import styles from './ProfilePage.module.css';

interface ProfilePageProps {
  userRole: 'admin' | 'staff' | 'customer';
}

export default function ProfilePage({ userRole }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState<UpdateProfileRequest>({
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  
  const [passwordForm, setPasswordForm] = useState<UpdatePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getMyProfile();
      setProfile(data);
      setEditForm({
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await userApi.updateMyProfile(editForm);
      setProfile(updatedProfile);
      setIsEditingProfile(false);
      setSuccessMessage('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      await userApi.updateMyPassword(passwordForm);
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Đổi mật khẩu thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File ảnh không được vượt quá 5MB');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await userApi.uploadAvatar(file);
      setProfile(updatedProfile);
      setSuccessMessage('Cập nhật ảnh đại diện thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'staff': return 'Nhân viên';
      case 'customer': return 'Khách hàng';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Thông tin cá nhân</h1>
      
      {error && (
        <div className={styles.errorAlert}>
          <FaTimes className={styles.alertIcon} onClick={() => setError(null)} />
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className={styles.successAlert}>
          {successMessage}
        </div>
      )}

      <div className={styles.profileLayout}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <img 
              src={profile?.avatarUrl || '/images/default-avatar.png'} 
              alt="Avatar"
              className={styles.avatar}
            />
            <label className={styles.avatarUploadBtn}>
              <FaCamera />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <h2 className={styles.userName}>{profile?.fullName}</h2>
          <span className={`${styles.roleBadge} ${styles[userRole]}`}>
            {getRoleLabel(userRole)}
          </span>
        </div>

        {/* Profile Info Section */}
        <div className={styles.infoSection}>
          {!isEditingProfile ? (
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <h3>Thông tin tài khoản</h3>
                <button 
                  className={styles.editBtn}
                  onClick={() => setIsEditingProfile(true)}
                >
                  <FaEdit /> Chỉnh sửa
                </button>
              </div>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <FaUser /> Họ và tên
                  </span>
                  <span className={styles.infoValue}>{profile?.fullName || '-'}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <FaEnvelope /> Email
                  </span>
                  <span className={styles.infoValue}>{profile?.email || '-'}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <FaPhone /> Số điện thoại
                  </span>
                  <span className={styles.infoValue}>{profile?.phoneNumber || '-'}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <FaUser /> Địa chỉ
                  </span>
                  <span className={styles.infoValue}>{profile?.address || '-'}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className={styles.editForm}>
              <div className={styles.cardHeader}>
                <h3>Chỉnh sửa thông tin</h3>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                    placeholder="0xxx xxx xxx"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Nhập địa chỉ..."
                  />
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setIsEditingProfile(false);
                    setEditForm({
                      fullName: profile?.fullName || '',
                      phoneNumber: profile?.phoneNumber || '',
                      address: profile?.address || '',
                    });
                  }}
                  disabled={saving}
                >
                  <FaTimes /> Hủy
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? <FaSpinner className={styles.spinner} /> : <FaSave />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}

          {/* Password Change Section */}
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h3>Bảo mật</h3>
              {!isChangingPassword && (
                <button 
                  className={styles.editBtn}
                  onClick={() => setIsChangingPassword(true)}
                >
                  <FaKey /> Đổi mật khẩu
                </button>
              )}
            </div>
            
            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    disabled={saving}
                  >
                    <FaTimes /> Hủy
                  </button>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? <FaSpinner className={styles.spinner} /> : <FaKey />}
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            ) : (
              <p className={styles.securityNote}>
                Để bảo mật tài khoản, bạn nên đổi mật khẩu định kỳ và sử dụng mật khẩu mạnh.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
