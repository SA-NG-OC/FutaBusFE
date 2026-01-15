"use client";
import React, { useState } from "react";
import styles from "./SeatMap.module.css";

type SeatStatus = "available" | "selected" | "booked";

interface Seat {
  id: string;
  status: SeatStatus;
}

interface SeatMapProps {
  onSeatsChange?: (seats: string[]) => void;
  maxSeats?: number;
  busType?: "single" | "double"; // single floor or double floor
  seatsPerFloor?: number;
  lowerFloorSeats?: number;
  upperFloorSeats?: number;
  bookedSeats?: string[];
}

export default function SeatMap({
  onSeatsChange,
  maxSeats = 5,
  busType = "double",
  lowerFloorSeats = 20,
  upperFloorSeats = 20,
  bookedSeats = ["A3", "A6", "A8", "A12", "B2", "B4", "B8", "B12"],
}: SeatMapProps) {
  const [lowerFloor, setLowerFloor] = useState<Seat[]>(
    generateSeats(
      "A",
      lowerFloorSeats,
      bookedSeats.filter((s) => s.startsWith("A"))
    )
  );
  const [upperFloor, setUpperFloor] = useState<Seat[]>(
    busType === "double"
      ? generateSeats(
          "B",
          upperFloorSeats,
          bookedSeats.filter((s) => s.startsWith("B"))
        )
      : []
  );

  function generateSeats(
    prefix: string,
    count: number,
    bookedSeats: string[]
  ): Seat[] {
    return Array.from({ length: count }, (_, i) => {
      const seatId = `${prefix}${i + 1}`;
      return {
        id: seatId,
        status: bookedSeats.includes(seatId) ? "booked" : "available",
      };
    });
  }

  const handleSeatClick = (floor: "lower" | "upper", seatId: string) => {
    const seats = floor === "lower" ? lowerFloor : upperFloor;
    const setSeat = floor === "lower" ? setLowerFloor : setUpperFloor;

    const seat = seats.find((s) => s.id === seatId);
    if (!seat || seat.status === "booked") return;

    const selectedCount = [...lowerFloor, ...upperFloor].filter(
      (s) => s.status === "selected"
    ).length;

    if (seat.status === "available" && selectedCount >= maxSeats) {
      return;
    }

    const newSeats = seats.map((s) =>
      s.id === seatId
        ? {
            ...s,
            status: s.status === "selected" ? "available" : "selected",
          }
        : s
    );

    setSeat(newSeats as Seat[]);

    // Notify parent of selected seats
    if (onSeatsChange) {
      const allSeats =
        floor === "lower"
          ? [...newSeats, ...upperFloor]
          : [...lowerFloor, ...newSeats];
      const selected = allSeats
        .filter((s) => s.status === "selected")
        .map((s) => s.id);
      onSeatsChange(selected);
    }
  };

  const renderSeat = (seat: Seat, floor: "lower" | "upper") => (
    <button
      key={seat.id}
      className={`${styles.seat} ${styles[seat.status]}`}
      onClick={() => handleSeatClick(floor, seat.id)}
      disabled={seat.status === "booked"}
    >
      {seat.id}
    </button>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Select Your Seats</h2>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.available}`}></div>
            <span>Available</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.selected}`}></div>
            <span>Selected</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.booked}`}></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      <div className={styles.busLayout}>
        <div className={styles.driverArea}>Driver</div>

        <div className={styles.floorsContainer}>
          <div className={styles.floorSection}>
            <div className={styles.floorLabel}>
              {busType === "single" ? "Seats" : "Lower Floor"}
            </div>
            <div className={styles.seatsGrid}>
              {lowerFloor.map((seat) => renderSeat(seat, "lower"))}
            </div>
          </div>

          {busType === "double" && upperFloor.length > 0 && (
            <>
              <div className={styles.floorDivider}></div>
              <div className={styles.floorSection}>
                <div className={styles.floorLabel}>Upper Floor</div>
                <div className={styles.seatsGrid}>
                  {upperFloor.map((seat) => renderSeat(seat, "upper"))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
