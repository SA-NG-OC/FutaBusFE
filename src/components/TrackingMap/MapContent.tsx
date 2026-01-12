"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// --- Xử lý Icon Leaflet trong Next.js ---
if (typeof window !== 'undefined') {
    const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
    const iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
    const shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl: iconUrl,
        iconRetinaUrl: iconRetinaUrl,
        shadowUrl: shadowUrl,
    });
}

// Icon xe
const carIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Component: Di chuyển camera theo xe
function MapUpdater({ position }: { position: L.LatLngExpression }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position as L.LatLngExpression, map.getZoom(), { duration: 1.5 });
    }, [position, map]);
    return null;
}

interface LocationData {
    tripId: number;
    latitude: number;
    longitude: number;
    speed: number;
    direction: string;
}

interface MapContentProps {
    tripId: number;
    initialLat?: number;
    initialLng?: number;
}

const MapContent = ({ tripId, initialLat = 10.7769, initialLng = 106.7009 }: MapContentProps) => {
    const [position, setPosition] = useState<L.LatLngExpression>([initialLat, initialLng]);
    const [routeHistory, setRouteHistory] = useState<L.LatLngExpression[]>([[initialLat, initialLng]]);
    const [details, setDetails] = useState<Partial<LocationData>>({});

    // Tạm thời bỏ isConnected ra khỏi UI để map gọn hơn (nhưng vẫn giữ logic)
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";
        const client = new Client({
            webSocketFactory: () => new SockJS(`${socketUrl}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/trip/${tripId}`, (message) => {
                    if (message.body) {
                        try {
                            const data: LocationData = JSON.parse(message.body);
                            const newPoint: L.LatLngExpression = [data.latitude, data.longitude];
                            setPosition(newPoint);
                            setDetails(data);
                            setRouteHistory(prev => [...prev, newPoint]);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, [tripId]);

    return (
        <div className="w-full h-full bg-gray-50">
            <MapContainer
                center={position}
                zoom={13} // Zoom vừa phải
                scrollWheelZoom={false} // Tắt lăn chuột
                zoomControl={false} // Tắt nút +/- để giao diện sạch sẽ
                dragging={true}
                style={{ height: "100%", width: "100%" }}
            >
                {/* Dùng CartoDB Voyager cho giao diện đẹp, sáng, hiện đại */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Vẽ đường đi màu xanh dương */}
                <Polyline
                    positions={routeHistory}
                    pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                />

                <Marker position={position} icon={carIcon}>
                    <Popup>
                        <div className="text-sm font-sans">
                            <p className="font-bold text-gray-700">Trip #{tripId}</p>
                            <p>Speed: {details.speed ? details.speed.toFixed(1) : 0} km/h</p>
                        </div>
                    </Popup>
                </Marker>

                <MapUpdater position={position} />
            </MapContainer>
        </div>
    );
};

export default MapContent;