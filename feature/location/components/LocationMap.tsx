'use client';

import React, { useEffect, useRef } from 'react';
import type * as L from 'leaflet';
import styles from './LocationMap.module.css';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  onMapClick?: (lat: number, lng: number) => void;
  locations?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: 'PICKUP' | 'DROPOFF' | 'BOTH';
  }>;
  height?: string;
}

export default function LocationMap({ 
  latitude = 10.762622, 
  longitude = 106.660172, // Default to Ho Chi Minh City
  onMapClick,
  locations = [],
  height = '400px'
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS dynamically
    const loadLeafletCSS = () => {
      const existingLink = document.querySelector('link[href*="leaflet"]');
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(link);
      }
    };

    // Initialize Leaflet map
    const initMap = async () => {
      // Load CSS first
      loadLeafletCSS();
      
      const L = await import('leaflet');
      
      // Fix for default markers
      type IconDefaultPrototype = typeof L.Icon.Default.prototype & {
        _getIconUrl?: () => string;
      };
      delete (L.Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create map
      const map = L.map(mapRef.current!).setView([latitude, longitude], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add click handler
      if (onMapClick) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onMapClick(lat, lng);
        });
      }

      // Custom icons for different location types
      const pickupIcon = L.divIcon({
        html: '<div class="custom-marker pickup-marker">📍</div>',
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const dropoffIcon = L.divIcon({
        html: '<div class="custom-marker dropoff-marker">🎯</div>',
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const bothIcon = L.divIcon({
        html: '<div class="custom-marker both-marker">🚌</div>',
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Add location markers
      locations.forEach(location => {
        let icon;
        switch (location.type) {
          case 'PICKUP':
            icon = pickupIcon;
            break;
          case 'DROPOFF':
            icon = dropoffIcon;
            break;
          case 'BOTH':
            icon = bothIcon;
            break;
          default:
            icon = pickupIcon;
        }

        L.marker([location.latitude, location.longitude], { icon })
          .bindPopup(`
            <div style="text-align: center; font-family: system-ui, -apple-system, sans-serif;">
              <strong style="color: #D83E3E;">${location.name}</strong><br>
              <span style="font-size: 12px; color: #666;">${location.type}</span><br>
              <span style="font-size: 11px; color: #999;">${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</span>
            </div>
          `)
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

  return (
    <>
      {/* Add custom CSS for markers */}
      <style jsx global>{`
        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 16px;
          width: 30px;
          height: 30px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .pickup-marker {
          background: #22c55e;
        }
        
        .dropoff-marker {
          background: #ef4444;
        }
        
        .both-marker {
          background: #D83E3E;
        }
        
        .custom-div-icon {
          background: none;
          border: none;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
      
      <div 
        ref={mapRef} 
        className={styles.map} 
        style={{ height }}
      />
    </>
  );
}