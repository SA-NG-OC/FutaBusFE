"use client";

import React, { useState, useEffect } from "react";
import styles from "./TicketChangeModal.module.css";
import { AlternativeTrip, TicketChangeRequest } from "../../types/ticketChange";
import { ticketApi } from "../../api/ticketApi";
import { tripApi } from "@/feature/trip/api/tripApi";

interface TicketChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  currentTripId: number;
  currentSeatNumber: string;
  currentRouteName: string;
  currentPrice: number;
  currentDepartureTime: string;
  routeId: number;
  onSuccess: () => void;
}

export const TicketChangeModal: React.FC<TicketChangeModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  currentTripId,
  currentSeatNumber,
  currentRouteName,
  currentPrice,
  currentDepartureTime,
  routeId,
  onSuccess,
}) => {
  const [alternativeTrips, setAlternativeTrips] = useState<AlternativeTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<AlternativeTrip | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAlternativeTrips();
    }
  }, [isOpen, routeId]);

  const fetchAlternativeTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to fetch alternative trips
      const trips = await tripApi.getAlternativeTrips(
        routeId,
        currentTripId,
        currentDepartureTime
      );
      
      setAlternativeTrips(trips);
      
      if (trips.length === 0) {
        setError("No alternative trips available for this route");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load alternative trips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripSelect = (trip: AlternativeTrip) => {
    setSelectedTrip(trip);
    setSelectedSeat(null); // Reset seat selection when trip changes
  };

  const handleSubmit = async () => {
    if (!selectedTrip || !selectedSeat) {
      setError("Please select a trip and seat");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: TicketChangeRequest = {
        newTripId: selectedTrip.tripId,
        newSeatId: selectedSeat,
        reason: reason.trim() || undefined,
      };

      await ticketApi.changeTicket(ticketId, request);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to change ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriceDifference = () => {
    if (!selectedTrip) return 0;
    return selectedTrip.price - currentPrice;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Change Ticket</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Current ticket info */}
          <div className={styles.currentInfo}>
            <h3>Current Ticket</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Route:</span>
                <span className={styles.value}>{currentRouteName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Seat:</span>
                <span className={styles.value}>{currentSeatNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Price:</span>
                <span className={styles.value}>{formatPrice(currentPrice)}</span>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Alternative trips */}
          <div className={styles.tripsList}>
            <h3>Select New Trip</h3>
            {loading && <div className={styles.loading}>Loading trips...</div>}
            {!loading && alternativeTrips.length === 0 && (
              <div className={styles.noTrips}>
                No alternative trips available for this route
              </div>
            )}
            {alternativeTrips.map((trip) => (
              <div
                key={trip.tripId}
                className={`${styles.tripCard} ${
                  selectedTrip?.tripId === trip.tripId ? styles.selected : ""
                }`}
                onClick={() => handleTripSelect(trip)}
              >
                <div className={styles.tripInfo}>
                  <div className={styles.tripTime}>
                    <span>{formatDate(trip.departureTime)}</span>
                    <span className={styles.time}>
                      {formatTime(trip.departureTime)}
                    </span>
                  </div>
                  <div className={styles.tripDetails}>
                    <span>{trip.vehicleInfo}</span>
                    <span className={styles.seats}>
                      {trip.availableSeats} seats available
                    </span>
                  </div>
                  <div className={styles.tripPrice}>
                    {formatPrice(trip.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seat selection */}
          {selectedTrip && (
            <div className={styles.seatSelection}>
              <h3>Select Seat</h3>
              <div className={styles.seatsGrid}>
                {selectedTrip.availableSeats > 0 ? (
                  <div className={styles.seatPlaceholder}>
                    Seat selection UI - to be implemented
                  </div>
                ) : (
                  <div className={styles.noSeats}>No available seats</div>
                )}
              </div>
            </div>
          )}

          {/* Reason input */}
          {selectedTrip && selectedSeat && (
            <div className={styles.reasonSection}>
              <label htmlFor="reason">Reason for change (optional):</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for ticket change..."
                rows={3}
              />
            </div>
          )}

          {/* Price difference */}
          {selectedTrip && (
            <div className={styles.priceDifference}>
              <span>Price Difference:</span>
              <span
                className={
                  calculatePriceDifference() >= 0
                    ? styles.pricePositive
                    : styles.priceNegative
                }
              >
                {calculatePriceDifference() >= 0 ? "+" : ""}
                {formatPrice(calculatePriceDifference())}
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!selectedTrip || !selectedSeat || loading}
          >
            {loading ? "Changing..." : "Confirm Change"}
          </button>
        </div>
      </div>
    </div>
  );
};
