import apiClient from '@/shared/utils/apiClient';
import { 
  Location, 
  CreateLocationRequest, 
  UpdateLocationRequest, 
  LocationSearchParams,
  GeocodeResult 
} from '../types';

export const locationApi = {
  // Get all locations with pagination and filters
  getLocations: async (params?: LocationSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.province) queryParams.append('province', params.province);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await apiClient.get(
      `/locations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
    return response.data.data as Location[];
  },

  // Get location by ID
  getLocationById: async (id: number) => {
    const response = await apiClient.get(`/locations/${id}`);
    return response.data.data as Location;
  },

  // Create new location
  createLocation: async (data: CreateLocationRequest) => {
    const response = await apiClient.post('/locations', data);
    return response.data.data as Location;
  },

  // Update location
  updateLocation: async (data: UpdateLocationRequest) => {
    const response = await apiClient.put(`/locations/${data.locationId}`, data);
    return response.data.data as Location;
  },

  // Delete location
  deleteLocation: async (id: number) => {
    await apiClient.delete(`/locations/${id}`);
  },

  // Get provinces for dropdown
  getProvinces: async () => {
    const response = await apiClient.get('/locations/provinces');
    return response.data.data as string[];
  },

  // Geocoding service - search places
  searchPlaces: async (query: string): Promise<GeocodeResult[]> => {
    try {
      // Using OpenStreetMap Nominatim as free alternative to Google Maps
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Vietnam')}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      interface NominatimResult {
        display_name: string;
        lat: string;
        lon: string;
        place_id?: number;
        address?: {
          city?: string;
          state?: string;
          province?: string;
          city_district?: string;
          town?: string;
          village?: string;
        };
      }
      
      return (data as NominatimResult[]).map((item) => {
        // Extract province from address details
        // OpenStreetMap uses 'state' or 'province' for Vietnamese provinces/cities
        let province = '';
        if (item.address) {
          province = item.address.city || 
                    item.address.state || 
                    item.address.province || 
                    item.address.city_district || 
                    item.address.town || 
                    '';
          
          // Clean up province name (remove 'Thành phố' or 'Tỉnh' prefix if exists)
          province = province
            .replace(/^(Thành phố|Tỉnh)\s*/i, '')
            .replace(/\s*City$/i, '')
            .trim();
        }

        return {
          name: item.display_name.split(',')[0],
          address: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          placeId: item.place_id?.toString(),
          province: province
        };
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  },

  // Reverse geocoding - get address from coordinates
  reverseGeocode: async (latitude: number, longitude: number): Promise<{ address: string; province?: string }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      let province = '';
      if (data.address) {
        province = data.address.city || 
                  data.address.state || 
                  data.address.province || 
                  data.address.city_district || 
                  data.address.town || 
                  '';
        
        // Clean up province name
        province = province
          .replace(/^(Thành phố|Tỉnh)\s*/i, '')
          .replace(/\s*City$/i, '')
          .trim();
      }
      
      return {
        address: data.display_name || `${latitude}, ${longitude}`,
        province: province
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        address: `${latitude}, ${longitude}`,
        province: ''
      };
    }
  }
};