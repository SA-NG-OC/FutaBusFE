import React from "react";
import TripCard from "../TripCard/TripCard";
import { TripData } from "../../types";
import styles from "./TripTimeline.module.css";

interface TripTimelineProps {
  trips: TripData[];
  onStatusUpdate: (id: number, newStatus: string) => void;
}

const TripTimeline = ({ trips, onStatusUpdate }: TripTimelineProps) => {
  if (trips.length === 0) {
    return (
      <div className={styles.emptyState}>No trips scheduled for this date.</div>
    );
  }

  return (
    <div className={styles.timelineContainer}>
      {trips.map((trip, index) => (
        <div key={trip.tripId} className={styles.timelineRow}>
          {/* Cột trái: Time & Line */}
          <div className={styles.timeColumn}>
            <span className={styles.hour}>
              {trip.departureTime?.substring(0, 5)}
            </span>
            <div className={styles.dot}></div>
            {/* Line nối xuống item tiếp theo (trừ item cuối) */}
            {index < trips.length - 1 && <div className={styles.line}></div>}
          </div>

          {/* Cột phải: Card */}
          <div className={styles.cardWrapper}>
            <TripCard trip={trip} onStatusUpdate={onStatusUpdate} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripTimeline;
