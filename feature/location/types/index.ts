export interface Location {
  locationId: number;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  province: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLocationRequest {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  province: string;
  isActive?: boolean;
}

export interface UpdateLocationRequest {
  locationId: number;
  locationName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  province?: string;
  isActive?: boolean;
}

export interface LocationSearchParams {
  page?: number;
  size?: number;
  search?: string;
  province?: string;
  isActive?: boolean;
}

export interface GeocodeResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  province?: string; // Tỉnh/Thành phố
}

export interface Province {
  provinceName: string;
}