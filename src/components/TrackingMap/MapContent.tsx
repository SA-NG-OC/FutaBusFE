"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaLocationArrow } from "react-icons/fa";

// --- GOOGLE MAPS COLORS ---
const GOOGLE_BLUE = '#4285F4';        // Google Maps primary blue
const GOOGLE_BLUE_DARK = '#1a73e8';   // Darker blue for traveled path
const ROUTE_OUTLINE = '#1557b0';       // Dark outline for route
const WHITE = '#FFFFFF';

// --- 1. CONFIG ICON ---
const busIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -25],
});

// Custom Google Maps style markers
const createGoogleStyleIcon = (color: string, label: string) => {
    return L.divIcon({
        className: 'custom-google-marker',
        html: `
            <div style="
                position: relative;
                width: 28px;
                height: 40px;
            ">
                <svg viewBox="0 0 28 40" width="28" height="40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="shadow-${label}" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                        </filter>
                    </defs>
                    <path 
                        d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" 
                        fill="${color}" 
                        filter="url(#shadow-${label})"
                    />
                    <circle cx="14" cy="14" r="6" fill="white"/>
                </svg>
                <div style="
                    position: absolute;
                    top: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    font-weight: bold;
                    color: ${color};
                ">${label}</div>
            </div>
        `,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -40]
    });
};

const startIcon = createGoogleStyleIcon('#34A853', 'A');  // Google Green
const endIcon = createGoogleStyleIcon('#EA4335', 'B');     // Google Red

// --- 2. HÀM GỌI API TÌM ĐƯỜNG (ROUTING) ---
async function getRoutePolyline(startLat: number, startLng: number, endLat: number, endLng: number): Promise<L.LatLngTuple[]> {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngTuple);
        }
        return [];
    } catch (error) {
        console.error("Error fetching route:", error);
        return [];
    }
}

// --- 3. COMPONENT XỬ LÝ MAP ---
function MapEventsHandler({ onUserInteraction }: { onUserInteraction: () => void }) {
    useMapEvents({
        dragstart: onUserInteraction,
        zoomstart: onUserInteraction,
    });
    return null;
}

interface SmartCameraProps {
    currentPos: L.LatLngExpression | null;
    origin: any;
    destination: any;
    isAutoFollow: boolean;
    plannedPath: L.LatLngTuple[];
}

function SmartCamera({ currentPos, origin, destination, isAutoFollow, plannedPath }: SmartCameraProps) {
    const map = useMap();
    const hasInitialFit = useRef(false);

    useEffect(() => {
        // 1. FitBounds lần đầu
        if (!hasInitialFit.current && origin && destination) {
            const points: L.LatLngExpression[] = [];

            if (plannedPath.length > 0) {
                points.push(...plannedPath);
            } else {
                points.push([origin.latitude, origin.longitude]);
                points.push([destination.latitude, destination.longitude]);
            }

            if (currentPos) {
                points.push(currentPos);
            }

            if (points.length > 0) {
                const bounds = L.latLngBounds(points);
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                    hasInitialFit.current = true;
                }
            }
        }

        // 2. Auto Follow xe
        if (isAutoFollow && currentPos) {
            map.flyTo(currentPos as L.LatLngExpression, map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [currentPos, origin, destination, isAutoFollow, map, plannedPath]);

    return null;
}

// --- MAIN COMPONENT ---
interface MapContentProps {
    tripId: number;
    onRouteInfoLoaded?: (info: any) => void;
}

const MapContent = ({ tripId, onRouteInfoLoaded }: MapContentProps) => {
    const [currentPos, setCurrentPos] = useState<L.LatLngExpression | null>(null);
    const [routeHistory, setRouteHistory] = useState<L.LatLngExpression[]>([]);
    const [plannedPath, setPlannedPath] = useState<L.LatLngTuple[]>([]);

    const [carDetails, setCarDetails] = useState<any>({});
    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);
    const [isAutoFollow, setIsAutoFollow] = useState(true);

    const stompClientRef = useRef<Client | null>(null);

    // Fetch Route & Calculate Path
    useEffect(() => {
        const fetchRouteInfo = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";
                const res = await fetch(`${apiUrl}/gps/${tripId}/route-info`);
                const json = await res.json();

                if (json.success && json.data) {
                    const org = json.data.origin;
                    const dst = json.data.destination;

                    setOrigin(org);
                    setDestination(dst);

                    if (!currentPos) setCurrentPos([org.latitude, org.longitude]);
                    if (onRouteInfoLoaded) onRouteInfoLoaded(json.data);

                    if (org && dst) {
                        const path = await getRoutePolyline(org.latitude, org.longitude, dst.latitude, dst.longitude);
                        setPlannedPath(path);
                    }
                }
            } catch (error) { console.error(error); }
        };
        fetchRouteInfo();
    }, [tripId]);

    // WebSocket Logic
    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";
        const client = new Client({
            webSocketFactory: () => new SockJS(`${socketUrl}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/trip/${tripId}`, (message) => {
                    if (message.body) {
                        const data = JSON.parse(message.body);
                        const newPoint: L.LatLngExpression = [data.latitude, data.longitude];
                        setCurrentPos(newPoint);
                        setCarDetails(data);
                        setRouteHistory(prev => [...prev, newPoint]);
                    }
                });
            },
        });
        client.activate();
        stompClientRef.current = client;
        return () => { if (stompClientRef.current) stompClientRef.current.deactivate(); };
    }, [tripId]);

    const handleRecenter = () => {
        setIsAutoFollow(true);
    };

    return (
        <div className="w-full h-full bg-gray-50 relative">
            <MapContainer
                center={[10.7769, 106.7009]}
                zoom={13}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps'
                />

                <MapEventsHandler onUserInteraction={() => setIsAutoFollow(false)} />

                <SmartCamera
                    currentPos={currentPos}
                    origin={origin}
                    destination={destination}
                    isAutoFollow={isAutoFollow}
                    plannedPath={plannedPath}
                />

                {/* ========== GOOGLE MAPS STYLE ROUTE RENDERING ========== */}

                {/* LAYER 1: VIỀN TỐI (Shadow/Outline) - Tạo chiều sâu */}
                {plannedPath.length > 0 && (
                    <Polyline
                        positions={plannedPath}
                        pathOptions={{
                            color: ROUTE_OUTLINE,
                            weight: 10,
                            opacity: 0.4,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                )}

                {/* LAYER 2: VIỀN TRẮNG (White border) - Nhìn sắc nét hơn */}
                {plannedPath.length > 0 && (
                    <Polyline
                        positions={plannedPath}
                        pathOptions={{
                            color: WHITE,
                            weight: 8,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                )}

                {/* LAYER 3: ĐƯỜNG CHÍNH MÀU XANH GOOGLE (Main route) */}
                {plannedPath.length > 0 && (
                    <Polyline
                        positions={plannedPath}
                        pathOptions={{
                            color: GOOGLE_BLUE,
                            weight: 5,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                )}

                {/* ========== ĐƯỜNG XE ĐÃ ĐI (Traveled path) ========== */}

                {/* LAYER 1: Viền tối cho đường đã đi */}
                {routeHistory.length > 1 && (
                    <Polyline
                        positions={routeHistory}
                        pathOptions={{
                            color: '#0d47a1',
                            weight: 8,
                            opacity: 0.5,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                    />
                )}

                {/* LAYER 2: Đường đã đi màu xanh đậm */}
                {routeHistory.length > 1 && (
                    <Polyline
                        positions={routeHistory}
                        pathOptions={{
                            color: GOOGLE_BLUE_DARK,
                            weight: 5,
                            opacity: 1,
                            lineCap: 'round',
                            lineJoin: 'round',
                            dashArray: undefined
                        }}
                    />
                )}

                {origin && (
                    <Marker position={[origin.latitude, origin.longitude]} icon={startIcon}>
                        <Popup><b>Bắt đầu:</b> {origin.locationName}</Popup>
                    </Marker>
                )}
                {destination && (
                    <Marker position={[destination.latitude, destination.longitude]} icon={endIcon}>
                        <Popup><b>Đích đến:</b> {destination.locationName}</Popup>
                    </Marker>
                )}

                {currentPos && (
                    <Marker position={currentPos} icon={busIcon} zIndexOffset={1000}>
                        <Popup>
                            <div className="p-1 min-w-[120px]">
                                <p className="font-bold text-blue-600 mb-1">Futa Bus</p>
                                <p className="text-xs text-gray-600">
                                    Vận tốc: <span className="font-bold">{carDetails.speed?.toFixed(1) || 0} km/h</span>
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {!isAutoFollow && currentPos && (
                <button
                    onClick={handleRecenter}
                    className="absolute bottom-24 right-4 z-[1000] bg-white text-blue-600 p-3 rounded-full shadow-xl border border-blue-100 hover:bg-blue-50 transition-all animate-bounce-short"
                    title="Về vị trí xe"
                >
                    <FaLocationArrow className="text-xl" />
                </button>
            )}
        </div>
    );
};

export default MapContent;