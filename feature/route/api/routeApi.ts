// src/feature/routes/api/routeApi.ts
import { ApiResponse as Res, RouteData, RouteRequest } from "../types";
import axios from "axios";
import { ApiResponse, PageResponse } from "@/shared/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5230';
const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const routeApi = {

    // ===== Locations =====
    getLocations: async (): Promise<any[]> => {
        const response = await axiosClient.get<ApiResponse<any[]>>("/locations");

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch locations");
        }

        return response.data.data;
    },

    // ===== Route Stops =====
    getRouteStops: async (): Promise<any[]> => {
        const response = await axiosClient.get<ApiResponse<any[]>>(
            "/routes/route-stop"
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch route stops");
        }

        return response.data.data;
    },

    // 1. Lấy danh sách (GET)
    getAll: async (page: number, size: number = 10): Promise<Res> => {
        const res = await fetch(`${API_URL}/routes?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
    },

    // ===== Create route =====
    create: async (data: RouteRequest): Promise<RouteData> => {
        const response = await axiosClient.post<ApiResponse<RouteData>>(
            "/routes",
            data
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to create route");
        }

        return response.data.data;
    },

    // ===== Update route =====
    update: async (id: number, data: RouteRequest): Promise<RouteData> => {
        const response = await axiosClient.put<ApiResponse<RouteData>>(
            `/routes/${id}`,
            data
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to update route");
        }

        return response.data.data;
    },

    // ===== Delete route =====
    delete: async (id: number): Promise<boolean> => {
        const response = await axiosClient.delete<ApiResponse<null>>(
            `/routes/${id}`
        );

        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to delete route");
        }

        return true;
    },
};