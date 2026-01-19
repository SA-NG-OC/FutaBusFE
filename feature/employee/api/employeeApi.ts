import { api, PageResponse } from "@/shared/utils/apiClient";

// ========== TYPES ==========
export interface Employee {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avt?: string;
  status: string;
  roleId: number;
  roleName: string;
  createdAt?: string;
  address?: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatarUrl?: string;
  address?: string;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
}

// ========== API METHODS ==========
export const employeeApi = {
  /**
   * Get all employees (users with STAFF role) with pagination and search
   */
  getAll: async (
    page: number = 0,
    size: number = 20,
    keyword?: string,
  ): Promise<PageResponse<Employee>> => {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    if (keyword) {
      params.keyword = keyword;
    }

    // Filter by STAFF role (roleId = 8)
    return api.get<PageResponse<Employee>>("/users", {
      params: { ...params, roleId: "8" },
    });
  },

  /**
   * Get employee by ID
   */
  getById: async (id: number): Promise<Employee> => {
    return api.get<Employee>(`/users/${id}`);
  },

  /**
   * Create new employee with account (STAFF role)
   * Now accepts FormData with avatar file
   */
  create: async (
    data: CreateEmployeeRequest,
    avatarFile?: File,
  ): Promise<Employee> => {
    const formData = new FormData();

    // Append all form fields
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.address) {
      formData.append("address", data.address);
    }

    // Append avatar file if provided
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    return api.post<Employee>("/users/employees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update existing employee
   */
  update: async (
    id: number,
    data: UpdateEmployeeRequest,
  ): Promise<Employee> => {
    return api.put<Employee>(`/users/${id}`, data);
  },

  /**
   * Delete employee (soft delete by changing status)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
