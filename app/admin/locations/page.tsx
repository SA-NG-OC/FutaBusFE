'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Location, CreateLocationRequest, LocationSearchParams, GeocodeResult } from '@/feature/location/types';
import { locationApi } from '@/feature/location/api';
import LocationPicker from '@/feature/location/components/LocationPicker';
import LocationMap from '@/feature/location/components/LocationMap';
import styles from './page.module.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateLocationRequest>({
    locationName: '',
    address: '',
    latitude: 0,
    longitude: 0,
    province: '',
    isActive: true
  });

  // Search and filter state
  const [searchParams, setSearchParams] = useState<LocationSearchParams>({
    page: 0,
    size: 20,
    search: '',
    isActive: true
  });

  // Load initial data
  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationApi.getLocations(searchParams);
      setLocations(data);
    } catch (err) {
      setError('Không thể tải danh sách điểm đón/trả');
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadLocations();
    loadProvinces();
  }, [loadLocations]);

  const loadProvinces = async () => {
    try {
      const data = await locationApi.getProvinces();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProvinces(data);
      } else {
        console.error('Provinces data is not an array:', data);
        setProvinces([]);
      }
    } catch (err) {
      console.error('Error loading provinces:', err);
      setProvinces([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.latitude === 0 || formData.longitude === 0) {
      setError('Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (selectedLocation) {
        // Update existing location
        await locationApi.updateLocation({
          locationId: selectedLocation.locationId,
          ...formData
        });
      } else {
        // Create new location
        await locationApi.createLocation(formData);
      }
      
      setShowModal(false);
      resetForm();
      loadLocations();
    } catch (err) {
      setError(selectedLocation ? 'Không thể cập nhật điểm đón/trả' : 'Không thể tạo điểm đón/trả mới');
      console.error('Error saving location:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      locationName: location.locationName,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      province: location.province,
      isActive: location.isActive || true
    });
    setShowModal(true);
  };

  const handleDelete = async (locationId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa điểm đón/trả này?')) {
      return;
    }

    setLoading(true);
    try {
      await locationApi.deleteLocation(locationId);
      loadLocations();
    } catch (err) {
      setError('Không thể xóa điểm đón/trả');
      console.error('Error deleting location:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (geocodeResult: GeocodeResult) => {
    setFormData(prev => ({
      ...prev,
      locationName: geocodeResult.name,
      address: geocodeResult.address,
      latitude: geocodeResult.latitude,
      longitude: geocodeResult.longitude,
      province: geocodeResult.province || prev.province // Tự động điền tỉnh/thành phố
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Try to get address and province from coordinates
    locationApi.reverseGeocode(lat, lng)
      .then(result => {
        setFormData(prev => ({
          ...prev,
          address: result.address,
          province: result.province || prev.province // Tự động điền tỉnh/thành phố
        }));
      })
      .catch(err => {
        console.error('Reverse geocoding failed:', err);
      });
  };

  const resetForm = () => {
    setFormData({
      locationName: '',
      address: '',
      latitude: 0,
      longitude: 0,
      province: '',
      isActive: true
    });
    setSelectedLocation(null);
  };

  const handleSearchChange = (field: keyof LocationSearchParams, value: string | boolean | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 0 // Reset to first page when filtering
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <FaMapMarkerAlt className={styles.titleIcon} />
            Quản lý điểm đón/trả
          </h1>
          <p className={styles.subtitle}>
            Quản lý các điểm đón và trả khách với tích hợp bản đồ
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            onClick={() => setShowMap(!showMap)}
            className={`${styles.mapToggle} ${showMap ? styles.active : ''}`}
          >
            <FaMapMarkerAlt />
            {showMap ? 'Ẩn bản đồ' : 'Hiển thị bản đồ'}
          </button>
          <button 
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className={styles.addButton}
          >
            <FaPlus />
            Thêm điểm mới
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchParams.search || ''}
            onChange={(e) => handleSearchChange('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={searchParams.province || ''}
            onChange={(e) => handleSearchChange('province', e.target.value || undefined)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả tỉnh/thành</option>
            {provinces.map(province => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>

          <select
            value={searchParams.isActive !== undefined ? searchParams.isActive.toString() : ''}
            onChange={(e) => handleSearchChange('isActive', e.target.value ? e.target.value === 'true' : undefined)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Ngưng hoạt động</option>
          </select>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className={styles.mapContainer}>
          <LocationMap
            latitude={locations.length > 0 ? locations[0].latitude : undefined}
            longitude={locations.length > 0 ? locations[0].longitude : undefined}
            locations={locations.map(loc => ({
              id: loc.locationId,
              name: loc.locationName,
              latitude: loc.latitude,
              longitude: loc.longitude,
              type: 'BOTH' // Default type
            }))}
            height="400px"
            onMapClick={handleMapClick}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={styles.errorAlert}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Locations Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Đang tải...</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên địa điểm</th>
                <th>Địa chỉ</th>
                <th>Tỉnh/Thành</th>
                <th>Tọa độ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location.locationId}>
                  <td className={styles.nameCell}>{location.locationName}</td>
                  <td className={styles.addressCell}>{location.address}</td>
                  <td>{location.province}</td>
                  <td className={styles.coordsCell}>
                    {location.latitude.toFixed(6)}<br />
                    {location.longitude.toFixed(6)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${(location.isActive ?? true) ? styles.active : styles.inactive}`}>
                      {(location.isActive ?? true) ? 'Hoạt động' : 'Ngưng'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(location)}
                        className={styles.editButton}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(location.locationId)}
                        className={styles.deleteButton}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && locations.length === 0 && (
          <div className={styles.emptyState}>
            <FaMapMarkerAlt className={styles.emptyIcon} />
            <h3>Chưa có điểm đón/trả nào</h3>
            <p>Thêm điểm đón/trả đầu tiên để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedLocation ? 'Chỉnh sửa điểm đón/trả' : 'Thêm điểm đón/trả mới'}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tên địa điểm *</label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                    required
                    placeholder="Ví dụ: Bến xe Miền Đông"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Tỉnh/Thành phố *</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                    required
                    placeholder="Ví dụ: Hồ Chí Minh"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tìm kiếm địa điểm *</label>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  placeholder="Nhập tên địa điểm hoặc địa chỉ..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Địa chỉ chi tiết *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                  placeholder="Địa chỉ đầy đủ..."
                  rows={3}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Vĩ độ *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                    required
                    placeholder="10.762622"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Kinh độ *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                    required
                    placeholder="106.660172"
                  />
                </div>
              </div>

              {/* Mini Map for location preview */}
              {formData.latitude !== 0 && formData.longitude !== 0 && (
                <div className={styles.formGroup}>
                  <label>Vị trí trên bản đồ</label>
                  <LocationMap
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onMapClick={handleMapClick}
                    locations={[{
                      id: 0,
                      name: formData.locationName || 'Vị trí mới',
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                      type: 'BOTH'
                    }]}
                    height="250px"
                  />
                  <p className={styles.mapHint}>💡 Nhấp vào bản đồ để chọn vị trí chính xác</p>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitButton}
                >
                  {loading ? 'Đang lưu...' : (selectedLocation ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}