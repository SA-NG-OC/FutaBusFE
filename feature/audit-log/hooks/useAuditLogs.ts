import { useState, useEffect } from 'react';
import { auditLogApi } from '../api/auditLogApi';
import { AuditLogData, AuditLogFilters } from '../types';

export const useAuditLogs = (initialFilters: AuditLogFilters = {}) => {
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 0);
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auditLogApi.getAuditLogs({ ...filters, page: currentPage });
      setLogs(response.logs);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, filters]);

  const updateFilters = (newFilters: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(0);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshLogs = () => {
    fetchLogs();
  };

  return {
    logs,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    filters,
    updateFilters,
    goToPage,
    refreshLogs,
  };
};
