"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface LockedSeat {
  seatId: number;
  seatNumber: string;
  userId: string;
  lockedAt: string;
  expiresAt: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lockedSeats: LockedSeat[];
  lockSeat: (tripId: number, seatId: number, userId: string) => void;
  unlockSeat: (tripId: number, seatId: number, userId: string) => void;
  subscribeToTrip: (tripId: number) => void;
  unsubscribeFromTrip: () => void;
  keepSeatsLocked: (tripId: number, seatIds: number[], userId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lockedSeats, setLockedSeats] = useState<LockedSeat[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<any>(null);
  const currentTripIdRef = useRef<number | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new SockJS('http://localhost:5230/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('[STOMP]', str);
      },
      onConnect: () => {
        console.log('✅ WebSocket Connected (Global)');
        setIsConnected(true);
        
        // Subscribe to user's private queue for error responses
        if (stompClient.connected) {
          stompClient.subscribe('/user/queue/seat/response', (message) => {
            try {
              const response = JSON.parse(message.body);
              console.log('📨 Private response from server:', response);
              
              if (!response.success) {
                console.error('❌ Seat operation failed:', response.message);
              }
            } catch (error) {
              console.error('Error parsing private response:', error);
            }
          });
        }
      },
      onDisconnect: () => {
        console.log('❌ WebSocket Disconnected (Global)');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame.headers['message']);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      stompClient.deactivate();
    };
  }, []);

  const subscribeToTrip = useCallback((tripId: number) => {
    if (!stompClientRef.current?.connected) {
      console.warn('⚠️ WebSocket not connected yet');
      return;
    }

    // Unsubscribe from previous trip if exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    currentTripIdRef.current = tripId;

    const destination = `/topic/trips/${tripId}/seats`;
    console.log(`🎯 Subscribing to: ${destination}`);

    subscriptionRef.current = stompClientRef.current.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const seatUpdate = JSON.parse(message.body);
          console.log('✅ 🔔 RECEIVED seat update:', seatUpdate);

          setLockedSeats((prev) => {
            if (seatUpdate.type === 'SEAT_LOCKED') {
              const existing = prev.find((s) => s.seatId === seatUpdate.seatId);
              if (existing) return prev;
              return [...prev, {
                seatId: seatUpdate.seatId,
                seatNumber: seatUpdate.seatNumber,
                userId: seatUpdate.lockedBy,
                lockedAt: seatUpdate.timestamp,
                expiresAt: seatUpdate.lockExpiry,
              }];
            } else if (seatUpdate.type === 'SEAT_UNLOCKED') {
              return prev.filter((s) => s.seatId !== seatUpdate.seatId);
            }
            return prev;
          });
        } catch (error) {
          console.error('Error parsing seat update:', error);
        }
      }
    );

    console.log(`✅ Subscribed to trip ${tripId} seat updates`);
  }, []);

  const unsubscribeFromTrip = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    currentTripIdRef.current = null;
    setLockedSeats([]);
    
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const lockSeat = useCallback((tripId: number, seatId: number, userId: string) => {
    if (!stompClientRef.current?.connected) {
      console.error('❌ Cannot lock seat: WebSocket not connected');
      return;
    }

    const payload = { tripId, seatId, userId };
    console.log('Lock request:', payload);

    stompClientRef.current.publish({
      destination: '/app/seat/lock',
      body: JSON.stringify(payload),
    });

    console.log('Lock request sent for seat', seatId, 'on trip', tripId);
  }, []);

  const unlockSeat = useCallback((tripId: number, seatId: number, userId: string) => {
    if (!stompClientRef.current?.connected) {
      console.error('❌ Cannot unlock seat: WebSocket not connected');
      return;
    }

    stompClientRef.current.publish({
      destination: '/app/seat/unlock',
      body: JSON.stringify({ tripId, seatId, userId }),
    });

    console.log('Unlocking seat', seatId, 'for trip', tripId);
  }, []);

  // Keep seats locked by periodically re-locking them
  const keepSeatsLocked = useCallback((tripId: number, seatIds: number[], userId: string) => {
    // Clear existing interval
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
    }

    // Re-lock every 2 minutes (before 15-minute expiry)
    keepAliveIntervalRef.current = setInterval(() => {
      if (stompClientRef.current?.connected) {
        seatIds.forEach((seatId) => {
          stompClientRef.current!.publish({
            destination: '/app/seat/lock',
            body: JSON.stringify({ tripId, seatId, userId }),
          });
        });
        console.log(`🔄 Re-locked ${seatIds.length} seats for trip ${tripId}`);
      }
    }, 2 * 60 * 1000); // 2 minutes

    console.log(`⏰ Started keep-alive for ${seatIds.length} seats`);
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    lockedSeats,
    lockSeat,
    unlockSeat,
    subscribeToTrip,
    unsubscribeFromTrip,
    keepSeatsLocked,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
