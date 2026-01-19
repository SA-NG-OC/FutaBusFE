import { api } from '@/shared/utils/apiClient';
import { AuditLogData, AuditLogPageResponse, AuditLogFilters } from '../types';

export const auditLogApi = {
  // Get all audit logs with filters
  getAuditLogs: async (filters: AuditLogFilters = {}): Promise<AuditLogPageResponse> => {
    const params: Record<string, string> = {
      page: (filters.page || 0).toString(),
      size: (filters.size || 20).toString(),
      sort: 'createdAt,desc',
    };

    if (filters.userId) params.userId = filters.userId.toString();
    if (filters.action) params.action = filters.action;
    if (filters.tableName) params.tableName = filters.tableName;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await api.get<{
      content: AuditLogData[];
      totalPages: number;
      totalElements: number;
      number: number;
      size: number;
      first: boolean;
      last: boolean;
    }>('/audit-logs', { params });

    return {
      logs: response.content,
      currentPage: response.number,
      pageSize: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      isFirst: response.first,
      isLast: response.last,
    };
  },

  // Get audit logs for a specific user
  getUserAuditLogs: async (userId: number, page: number = 0, size: number = 20): Promise<AuditLogPageResponse> => {
    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: 'createdAt,desc',
    };

    const response = await api.get<{
      content: AuditLogData[];
      totalPages: number;
      totalElements: number;
      number: number;
      size: number;
      first: boolean;
      last: boolean;
    }>(`/audit-logs/user/${userId}`, { params });

    return {
      logs: response.content,
      currentPage: response.number,
      pageSize: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      isFirst: response.first,
      isLast: response.last,
    };
  },

  // Get staff activity logs
  getStaffActivityLogs: async (
    action?: string,
    startDate?: string,
    endDate?: string,
    page: number = 0,
    size: number = 20
  ): Promise<AuditLogPageResponse> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
      sort: 'createdAt,desc',
    };

    if (action) params.action = action;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<{
      content: AuditLogData[];
      totalPages: number;
      totalElements: number;
      number: number;
      size: number;
      first: boolean;
      last: boolean;
    }>('/audit-logs/staff', { params });

    return {
      logs: response.content,
      currentPage: response.number,
      pageSize: response.size,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      isFirst: response.first,
      isLast: response.last,
    };
  },
};
