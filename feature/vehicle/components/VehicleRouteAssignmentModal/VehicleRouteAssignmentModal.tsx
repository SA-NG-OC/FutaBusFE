'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/shared/utils/apiClient';
import { CreateVehicleRouteAssignmentRequest } from '@/feature/route/types/routeAssignment';
import { vehicleRouteAssignmentApi } from '@/feature/vehicle/api/vehicleRouteAssignmentApi';
import { toast } from 'react-toastify';

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
  onSuccess
}: VehicleRouteAssignmentModalProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleRouteAssignmentRequest>({
    vehicleId,
    routeId: 0,
    priority: 1,
    startDate: new Date().toISOString().split('T')[0],
    maintenanceSchedule: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened for vehicle:', vehicleId, vehicleName);
      fetchRoutes();
      setFormData(prev => ({ ...prev, vehicleId }));
    }
  }, [isOpen, vehicleId]);

  const fetchRoutes = async () => {
    try {
      const response = await api.get<RouteOption[]>('/routes/selection');
      console.log('Fetched routes:', response);
      setRoutes(response);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('Không thể tải danh sách tuyến đường');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.routeId) {
      toast.warning('Vui lòng chọn tuyến đường');
      return;
    }

    // Remove empty optional fields to avoid backend validation errors
    const payload: any = {
      vehicleId: formData.vehicleId,
      routeId: formData.routeId,
      priority: formData.priority,
      startDate: formData.startDate
    };

    // Only add optional fields if they have values
    if (formData.maintenanceSchedule && formData.maintenanceSchedule.trim()) {
      payload.maintenanceSchedule = formData.maintenanceSchedule.trim();
    }
    if (formData.notes && formData.notes.trim()) {
      payload.notes = formData.notes.trim();
    }
    if (formData.endDate) {
      payload.endDate = formData.endDate;
    }

    console.log('Submitting vehicle-route assignment:', payload);
    
    setLoading(true);
    try {
      const result = await vehicleRouteAssignmentApi.create(payload);
      console.log('Assignment created successfully:', result);
      toast.success('Gắn tuyến thành công!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating assignment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gắn tuyến';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gắn tuyến cho xe
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Vehicle Info */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Xe: <span className="font-bold">{vehicleName}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Route Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tuyến đường <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: Number(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ ưu tiên
              </label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Số nhỏ = ưu tiên cao hơn
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ngày kết thúc (tuỳ chọn)
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Maintenance Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lịch bảo trì
              </label>
              <select
                value={formData.maintenanceSchedule || ''}
                onChange={(e) => setFormData({ ...formData, maintenanceSchedule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Không bảo trì định kỳ --</option>
                <option value="Weekly">Hàng tuần (Weekly)</option>
                <option value="Bi-weekly">Hai tuần một lần (Bi-weekly)</option>
                <option value="Monthly">Hàng tháng (Monthly)</option>
                <option value="Quarterly">Hàng quý (Quarterly)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Chỉ định kỳ bảo trì nếu xe cần bảo trì định kỳ
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Huỷ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Gắn tuyến'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
