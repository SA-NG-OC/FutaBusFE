// src/feature/trip/components/TripTimeline/TripTimeline.tsx

import React from "react";
import TripCard from "../TripCard/TripCard";
import styles from "./TripTimeline.module.css";
import { TripData } from "../../types";

interface TripTimelineProps {
  trips: TripData[];
  onStatusUpdate: (id: number, newStatus: string) => void;
  onCardClick?: (trip: TripData) => void;
}

const TripTimeline = ({
  trips,
  onStatusUpdate,
  onCardClick,
}: TripTimelineProps) => {
  // Group trips by departure time
  const groupedTrips: { [key: string]: TripData[] } = {};

  trips.forEach((trip) => {
    const timeKey = trip.departureTime.substring(0, 5); // "09:11"
    if (!groupedTrips[timeKey]) {
      groupedTrips[timeKey] = [];
    }
    groupedTrips[timeKey].push(trip);
  });

  const sortedTimes = Object.keys(groupedTrips).sort();

  if (trips.length === 0) {
    return (
      <div className={styles.emptyState}>Không có chuyến nào cho ngày này.</div>
    );
  }

  return (
    <div className={styles.timelineContainer}>
      {sortedTimes.map((time) => (
        <div key={time} className={styles.timelineGroup}>
          {/* Cột trái: Giờ + Chấm tròn */}
          <div className={styles.timeColumn}>
            <div className={styles.timeBadge}>{time}</div>
            <div className={styles.timelineDot}></div>
          </div>

          {/* Cột phải: Danh sách Cards */}
          <div className={styles.cardsColumn}>
            {groupedTrips[time].map((trip) => (
              <div
                key={trip.tripId}
                onClick={() => onCardClick && onCardClick(trip)}
                style={{ cursor: onCardClick ? "pointer" : "default" }}
              >
                <TripCard trip={trip} onStatusUpdate={onStatusUpdate} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;
