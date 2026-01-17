"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5230/ws";

// ===== MESSAGE TYPES =====
export type MessageType =
  | "SEAT_LOCKED"
  | "SEAT_UNLOCKED"
  | "SEAT_BOOKED"
  | "SEAT_LOCK_FAILED"
  | "SEAT_UNLOCK_FAILED"
  | "SEAT_EXPIRED"
  | "SEAT_STATUS_UPDATE";

export interface SeatStatusMessage {
  type: MessageType;
  seatId: number;
  seatNumber: string;
  tripId: number;
  status: "Available" | "Held" | "Booked";
  lockedBy: string | null;
  lockExpiry: string | null;
  floorNumber: number;
  success: boolean;
  message: string;
  timestamp: string;
}

interface UseWebSocketOptions {
  tripId: number;
  userId: string;
  onSeatUpdate?: (message: SeatStatusMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({
  tripId,
  userId,
  onSeatUpdate,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions) => {
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const [connected, setConnected] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const tripIdRef = useRef(tripId);

  // Store callbacks in refs to avoid stale closures
  const onSeatUpdateRef = useRef(onSeatUpdate);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    tripIdRef.current = tripId;
  }, [tripId]);

  useEffect(() => {
    onSeatUpdateRef.current = onSeatUpdate;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onSeatUpdate, onConnect, onDisconnect, onError]);

  // Internal connect function (not wrapped in useCallback to avoid circular dependency)
  const connectInternal = () => {
    if (stompClientRef.current?.connected) {
      console.log("WebSocket already connected");
      return;
    }

    const currentTripId = tripIdRef.current;
    if (!currentTripId) {
      console.log("No tripId, skipping WebSocket connection");
      return;
    }

    try {
      const socket = new SockJS(WS_BASE_URL);

      const client = new Client({
        webSocketFactory: () => socket as WebSocket,

        onConnect: (frame) => {
          console.log("✅ WebSocket connected:", frame);
          setConnected(true);
          reconnectAttemptsRef.current = 0;

          // Subscribe to trip-specific topic
          subscriptionRef.current = client.subscribe(
            `/topic/trips/${currentTripId}/seats`,
            (message: IMessage) => {
              try {
                const seatUpdate: SeatStatusMessage = JSON.parse(message.body);
                console.log("📢 Received seat update:", seatUpdate);
                onSeatUpdateRef.current?.(seatUpdate);
              } catch (err) {
                console.error("Failed to parse seat update:", err);
              }
            }
          );

          console.log(`🔔 Subscribed to /topic/trips/${currentTripId}/seats`);
          onConnectRef.current?.();
        },

        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame.headers["message"]);
          onErrorRef.current?.(frame.headers["message"] || "WebSocket error");
        },

        onDisconnect: () => {
          console.log("🔌 WebSocket disconnected");
          setConnected(false);
          onDisconnectRef.current?.();
        },

        onWebSocketClose: () => {
          console.log("🔌 WebSocket closed");
          setConnected(false);

          // Auto reconnect
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current += 1;
            console.log(
              `Reconnecting... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`
            );
            setTimeout(() => {
              connectInternal();
            }, 2000 * reconnectAttemptsRef.current);
          } else {
            onErrorRef.current?.(
              "Mất kết nối. Vui lòng reload trang để tiếp tục."
            );
          }
        },

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        reconnectDelay: 5000,
      });

      stompClientRef.current = client;
      client.activate();
    } catch (err) {
      console.error("Failed to connect WebSocket:", err);
      onErrorRef.current?.("Không thể kết nối real-time");
    }
  };

  // Store connectInternal in a ref to avoid dependency issues
  const connectRef = useRef(connectInternal);
  useEffect(() => {
    connectRef.current = connectInternal;
  });

  // Public connect function
  const connect = useCallback(() => {
    connectRef.current();
  }, []);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      console.log("🔕 Unsubscribed from topic");
      subscriptionRef.current = null;
    }

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      console.log("🔌 WebSocket deactivated");
      stompClientRef.current = null;
    }

    setConnected(false);
  }, []);

  // Lock seat (chọn ghế)
  const lockSeat = useCallback(
    (seatId: number) => {
      if (!stompClientRef.current?.connected) {
        console.error("❌ WebSocket chưa kết nối!");
        onErrorRef.current?.("Chưa kết nối real-time. Vui lòng đợi...");
        return false;
      }

      const request = {
        seatId,
        tripId: tripIdRef.current,
        userId,
      };

      console.log("🔒 Locking seat:", request);

      stompClientRef.current.publish({
        destination: "/app/seat/lock",
        body: JSON.stringify(request),
      });

      return true;
    },
    [userId]
  );

  // Unlock seat (bỏ chọn ghế)
  const unlockSeat = useCallback(
    (seatId: number) => {
      if (!stompClientRef.current?.connected) {
        console.error("❌ WebSocket chưa kết nối!");
        onErrorRef.current?.("Chưa kết nối real-time. Vui lòng đợi...");
        return false;
      }

      const request = {
        seatId,
        tripId: tripIdRef.current,
        userId,
      };

      console.log("🔓 Unlocking seat:", request);

      stompClientRef.current.publish({
        destination: "/app/seat/unlock",
        body: JSON.stringify(request),
      });

      return true;
    },
    [userId]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connected,
    connect,
    disconnect,
    lockSeat,
    unlockSeat,
  };
};
