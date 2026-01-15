export type Vehicle = {
  vehicleid: number;
  licenseplate: string;
  vehicletype: string;
  totalseats: number;
  status: 'Operational' | 'Inactive' | string;
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
      licenseplate: string;
  vehicletype: string;
  totalseats: number;
  status: string;
}


