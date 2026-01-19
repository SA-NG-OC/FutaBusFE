// Types for Audit Log Management

export interface AuditLogData {
  logId: number;
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  tableName: string;
  recordId: number;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string;
  createdAt: string;
}

export interface AuditLogPageResponse {
  logs: AuditLogData[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface AuditLogFilters {
  userId?: number;
  action?: string;
  tableName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
