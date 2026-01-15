"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { FaLocationArrow } from "react-icons/fa"; // Icon cho nút recenter

// --- 1. CONFIG ICON XE BUÝT ---
// Bạn có thể thay link ảnh này bằng link ảnh xe của Futa hoặc ảnh trong folder public của dự án
const busIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png", // Icon xe buýt nhìn từ trên xuống hoặc ngang
    iconSize: [45, 45],     // Kích thước to hơn chút cho dễ nhìn
    iconAnchor: [22, 22],   // Tâm của icon nằm chính giữa
    popupAnchor: [0, -25],  // Popup hiện phía trên icon
});

const startIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const endIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- 2. COMPONENT QUẢN LÝ SỰ KIỆN MAP ---
// Xử lý logic: Khi người dùng chạm vào map -> Tắt Auto Follow
function MapEventsHandler({ onUserInteraction }: { onUserInteraction: () => void }) {
    useMapEvents({
        dragstart: () => {
            onUserInteraction(); // Người dùng bắt đầu kéo map
        },
        zoomstart: () => {
            onUserInteraction(); // Người dùng bắt đầu zoom
        },
    });
    return null;
}

// --- 3. COMPONENT ĐIỀU KHIỂN CAMERA THÔNG MINH ---
interface SmartCameraProps {
    currentPos: L.LatLngExpression | null;
    origin: any;
    destination: any;
    isAutoFollow: boolean;
}

function SmartCamera({ currentPos, origin, destination, isAutoFollow }: SmartCameraProps) {
    const map = useMap();
    const hasInitialFit = useRef(false); // Ref để đảm bảo chỉ fitBounds lần đầu tiên

    useEffect(() => {
        // 1. Lần đầu tiên khi có đủ dữ liệu -> FitBounds để thấy toàn cảnh
        if (!hasInitialFit.current && origin && destination) {
            const points = [
                [origin.latitude, origin.longitude],
                [destination.latitude, destination.longitude]
            ];
            if (currentPos) points.push(currentPos as any);

            const bounds = L.latLngBounds(points as L.LatLngTuple[]);
            map.fitBounds(bounds, { padding: [50, 50] });
            hasInitialFit.current = true; // Đánh dấu đã fit xong
            return;
        }

        // 2. Các lần sau khi xe di chuyển
        if (isAutoFollow && currentPos) {
            // QUAN TRỌNG: map.getZoom() lấy zoom hiện tại của người dùng
            // Chỉ di chuyển tâm map (pan) đến xe, KHÔNG đổi mức zoom
            map.flyTo(currentPos as L.LatLngExpression, map.getZoom(), {
                animate: true,
                duration: 1.5 // Thời gian bay mượt mà
            });
        }
    }, [currentPos, origin, destination, isAutoFollow, map]);

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
    const [carDetails, setCarDetails] = useState<any>({});
    const [origin, setOrigin] = useState<any>(null);
    const [destination, setDestination] = useState<any>(null);

    // State quản lý chế độ Auto Follow
    const [isAutoFollow, setIsAutoFollow] = useState(true);

    const stompClientRef = useRef<Client | null>(null);

    // Fetch Route Info (Giữ nguyên)
    useEffect(() => {
        const fetchRouteInfo = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";
                const res = await fetch(`${apiUrl}/gps/${tripId}/route-info`);
                const json = await res.json();
                if (json.success && json.data) {
                    setOrigin(json.data.origin);
                    setDestination(json.data.destination);
                    if (!currentPos) setCurrentPos([json.data.origin.latitude, json.data.origin.longitude]);
                    if (onRouteInfoLoaded) onRouteInfoLoaded(json.data);
                }
            } catch (error) { console.error(error); }
        };
        fetchRouteInfo();
    }, [tripId]);

    // WebSocket (Giữ nguyên logic nhận data)
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

    // Hàm xử lý khi bấm nút "Về vị trí xe"
    const handleRecenter = () => {
        setIsAutoFollow(true);
        if (currentPos) {
            // Có thể force zoom vào mức đẹp (vd: 15) khi bấm nút này
            // map.flyTo(currentPos, 15); // Cần access map instance nếu muốn làm ở đây, 
            // nhưng để đơn giản ta để SmartCamera lo việc flyTo, ta chỉ set state
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 relative">
            <MapContainer
                center={[10.7769, 106.7009]}
                zoom={10}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* --- LOGIC CAMERA & EVENT --- */}
                <MapEventsHandler onUserInteraction={() => setIsAutoFollow(false)} />

                <SmartCamera
                    currentPos={currentPos}
                    origin={origin}
                    destination={destination}
                    isAutoFollow={isAutoFollow}
                />

                <Polyline positions={routeHistory} pathOptions={{ color: '#3b82f6', weight: 4 }} />

                {origin && (
                    <Marker position={[origin.latitude, origin.longitude]} icon={startIcon}>
                        <Popup>{origin.locationName}</Popup>
                    </Marker>
                )}
                {destination && (
                    <Marker position={[destination.latitude, destination.longitude]} icon={endIcon}>
                        <Popup>{destination.locationName}</Popup>
                    </Marker>
                )}

                {/* --- XE BUÝT (Icon mới) --- */}
                {currentPos && (
                    <Marker position={currentPos} icon={busIcon} zIndexOffset={1000}>
                        <Popup>
                            <div className="p-1">
                                <p className="font-bold text-blue-600 mb-1">Futa Bus</p>
                                <p className="text-xs">Speed: {carDetails.speed?.toFixed(1)} km/h</p>
                                {/* Nếu muốn xoay icon theo hướng (Advanced): Cần custom DivIcon với CSS rotate */}
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* --- NÚT RE-CENTER (Hiện khi người dùng đang không follow xe) --- */}
            {!isAutoFollow && currentPos && (
                <button
                    onClick={handleRecenter}
                    className="absolute bottom-24 right-4 z-[400] bg-white text-blue-600 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-blue-50 transition-all animate-bounce-short"
                    title="Về vị trí xe"
                >
                    <FaLocationArrow className="text-xl" />
                </button>
            )}
        </div>
    );
};

export default MapContent;