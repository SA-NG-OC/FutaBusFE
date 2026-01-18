"use client";

import React, { useEffect, useRef } from "react";
import type * as L from "leaflet";
// Import styles
import styles from "./LocationMap.module.css";

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  onMapClick?: (lat: number, lng: number) => void;
  locations?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: "PICKUP" | "DROPOFF" | "BOTH";
  }>;
  height?: string;
}

export default function LocationMap({
  latitude = 10.762622,
  longitude = 106.660172, // Default to Ho Chi Minh City
  onMapClick,
  locations = [],
  height = "400px",
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS dynamically
    const loadLeafletCSS = () => {
      const existingLink = document.querySelector('link[href*="leaflet"]');
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
        document.head.appendChild(link);
      }
    };

    // Initialize Leaflet map
    const initMap = async () => {
      loadLeafletCSS();
      const L = await import("leaflet");

      // Fix for default markers
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Create map
      const map = L.map(mapRef.current!).setView([latitude, longitude], 13);

      // Add OpenStreetMap tiles (Dark mode supported via CSS filter if needed, but standard is fine)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add click handler
      if (onMapClick) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onMapClick(lat, lng);
        });
      }

      // Helper create icon
      const createIcon = (className: string, icon: string) =>
        L.divIcon({
          html: `<div class="${styles.customMarker} ${className}">${icon}</div>`,
          className: styles.customDivIcon, // Class rỗng để reset style mặc định của Leaflet
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

      const pickupIcon = createIcon(styles.pickupMarker, "📍");
      const dropoffIcon = createIcon(styles.dropoffMarker, "🎯");
      const bothIcon = createIcon(styles.bothMarker, "🚌");

      // Add location markers
      locations.forEach((location) => {
        let icon;
        switch (location.type) {
          case "PICKUP":
            icon = pickupIcon;
            break;
          case "DROPOFF":
            icon = dropoffIcon;
            break;
          case "BOTH":
            icon = bothIcon;
            break;
          default:
            icon = pickupIcon;
        }

        // Popup HTML sử dụng class từ module (Lưu ý: Leaflet render HTML string nên ta dùng string template bình thường,
        // nhưng style nên được inject global hoặc inline nhẹ. Ở đây mình dùng style inline nhẹ nhưng map với variable css)
        const popupContent = `
          <div class="${styles.popupContent}">
            <strong class="${styles.popupTitle}">${location.name}</strong><br>
            <span class="${styles.popupType}">${location.type}</span><br>
            <span class="${styles.popupCoords}">${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</span>
          </div>
        `;

        L.marker([location.latitude, location.longitude], { icon })
          .bindPopup(popupContent)
          .addTo(map);
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, onMapClick, locations]);

  return <div ref={mapRef} className={styles.map} style={{ height }} />;
}
