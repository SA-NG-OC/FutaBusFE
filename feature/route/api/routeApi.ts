import { RouteData, RouteRequest } from "../types";
import { api } from '@/shared/utils/apiClient';

export const routeApi = {

    // ===== Locations =====
    getLocations: async (): Promise<any[]> => {
        return api.get<any[]>("/locations");
    },

    // ===== Route Stops =====
    getRouteStops: async (): Promise<any[]> => {
        return api.get<any[]>("/routes/route-stop");
    },

    // ===== Get All (List) =====
    getAll: async (page: number, size: number = 10, keyword?: string): Promise<any> => {
        const params: any = { page, size };
        if (keyword) {
            params.keyword = keyword;
        }

        return api.get('/routes', { params });
    },

    // ===== Create =====
    create: async (data: RouteRequest): Promise<RouteData> => {
        return api.post<RouteData>("/routes", data);
    },

    // ===== Update =====
    update: async (id: number, data: RouteRequest): Promise<RouteData> => {
        return api.put<RouteData>(`/routes/${id}`, data);
    },

    // ===== Delete =====
    delete: async (id: number): Promise<boolean> => {
        await api.delete(`/routes/${id}`);
        return true;
    },
};