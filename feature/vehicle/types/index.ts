export type Vehicle = {
  vehicleid: number;
  licenseplate: string;
  typeId: number;
  vehicletype?: string; // Will be resolved from typeId
  totalseats?: number; // Will be resolved from typeId  
  insuranceNumber?: string;
  insuranceExpiry?: string; // ISO date string
  status: 'Operational' | 'Inactive' | 'Maintenance' | string;
};

export type VehicleStats = {
  total: number;
  operational: number;
  maintenance: number;
  inactive: number;
};

export type VehicleType = {
  typeId: number;
  typeName: string;
  capacity: number;
  description?: string;
};

export type SortInfo = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortInfo;
};

export type Page<T> = {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: SortInfo;
  totalElements: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type VehicleRequest = {
  licensePlate: string;
  typeId: number;
  insuranceNumber?: string;
  insuranceExpiry?: string; // ISO date string (YYYY-MM-DD)
  status: string;
}


