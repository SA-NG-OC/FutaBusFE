"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function DriverSimulator() {
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);

    // Tọa độ giả lập (Bắt đầu từ Quận 1, TP.HCM)
    const [lat, setLat] = useState(10.7769);
    const [lng, setLng] = useState(106.7009);
    const [tripId, setTripId] = useState(1); // ID chuyến xe muốn test

    useEffect(() => {
        // Kết nối socket y hệt như App thật
        const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5230";

        const client = new Client({
            webSocketFactory: () => new SockJS(`${socketUrl}/ws`),
            onConnect: () => {
                console.log("👮‍♂️ Driver App Connected!");
                setIsConnected(true);
            },
            onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) stompClientRef.current.deactivate();
        };
    }, []);

    // Hàm giả lập xe di chuyển
    const moveCar = () => {
        if (!stompClientRef.current || !isConnected) return;

        // Tăng nhẹ tọa độ để tạo cảm giác di chuyển
        const newLat = lat + 0.0001; // Đi lên phía Bắc một xíu
        const newLng = lng + 0.0001; // Đi sang phải một xíu

        setLat(newLat);
        setLng(newLng);

        const payload = {
            tripId: tripId,
            driverId: 999, // ID tài xế giả
            latitude: newLat,
            longitude: newLng,
            speed: Math.floor(Math.random() * (60 - 30) + 30), // Random tốc độ 30-60km/h
            direction: "North-East",
            trafficStatus: "Normal"
        };

        // Gửi lên server (Trùng khớp với Controller @MessageMapping("/gps/update"))
        stompClientRef.current.publish({
            destination: "/app/gps/update",
            body: JSON.stringify(payload),
        });

        console.log("Da gui toa do:", payload);
    };

    // Tự động chạy (Auto Pilot)
    const [isAuto, setIsAuto] = useState(false);
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAuto) {
            interval = setInterval(moveCar, 1000); // 1 giây gửi 1 lần
        }
        return () => clearInterval(interval);
    }, [isAuto, lat, lng]); // dependency để update toạ độ mới nhất

    return (
        <div className="p-10 container mx-auto">
            <h1 className="text-2xl font-bold mb-4">👮‍♂️ Giả lập Tài xế (Driver Simulator)</h1>

            <div className="mb-4">
                <label className="block font-bold">Trip ID cần test:</label>
                <input
                    type="number"
                    value={tripId}
                    onChange={(e) => setTripId(Number(e.target.value))}
                    className="border p-2 rounded"
                />
            </div>

            <div className="flex gap-4 items-center mb-6">
                <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? "Đã kết nối Socket" : "Đang kết nối..."}</span>
            </div>

            <div className="space-x-4">
                <button
                    onClick={moveCar}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                    disabled={!isConnected}
                >
                    📍 Bước 1 bước (Gửi 1 lần)
                </button>

                <button
                    onClick={() => setIsAuto(!isAuto)}
                    className={`px-6 py-3 rounded text-white ${isAuto ? 'bg-red-600' : 'bg-green-600'}`}
                    disabled={!isConnected}
                >
                    {isAuto ? "⏹ Dừng chạy tự động" : "▶️ Chạy tự động (1s/lần)"}
                </button>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <p>Vị trí hiện tại: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
            </div>
        </div>
    );
}