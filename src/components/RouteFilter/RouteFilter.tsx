'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/shared/utils/apiClient';

interface RouteOption {
  routeId: number;
  routeName: string;
  origin: string;
  destination: string;
}

interface RouteFilterProps {
  onRouteSelect: (routeId: number | null) => void;
  selectedRouteId?: number | null;
  label?: string;
  placeholder?: string;
}

export default function RouteFilter({
  onRouteSelect,
  selectedRouteId,
  label = "Lọc theo tuyến",
  placeholder = "Tất cả tuyến đường"
}: RouteFilterProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await api.get<RouteOption[]>('/routes/selection');
      setRoutes(response);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={selectedRouteId || ''}
        onChange={(e) => onRouteSelect(e.target.value ? Number(e.target.value) : null)}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          border: '1px solid var(--input-border)',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--input-bg)',
          color: 'var(--input-text)',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--input-focus)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--input-border)';
          e.target.style.boxShadow = 'none';
        }}
      >
        <option value="">{loading ? 'Đang tải...' : placeholder}</option>
        {routes.map((route) => (
          <option key={route.routeId} value={route.routeId}>
            {route.routeName} ({route.origin} → {route.destination})
          </option>
        ))}
      </select>
    </div>
  );
}
