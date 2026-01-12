import React from "react";
import styles from "./TripCard.module.css";

type TripCardProps = {
  company?: string;
  service?: string;
  departTime?: string;
  departCity?: string;
  arrivalTime?: string;
  arrivalCity?: string;
  duration?: string;
  seats?: number;
  price?: number;
};

export default function TripCard({
  company = "Comfort Lines",
  service = "Seated",
  departTime = "08:30",
  departCity = "Ho Chi Minh City",
  arrivalTime = "14:30",
  arrivalCity = "Da Lat",
  duration = "6h",
  seats = 8,
  price = 220000,
}: TripCardProps) {
  return (
    <div className="flex flex-row space-x-4 p-4 border border-gray-300 rounded-lg">
      <div className="flex-1">
        <div className="flex flex-row items-center gap-4 mb-4">
          <div>logo</div>
          <div className="flex flex-col">
            <div>Tên</div>
            <div>Loại dịch vụ</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
          {/* departure */}
          <div className="flex flex-col">
            <div>{departTime}</div>
            <div>{departCity}</div>
          </div>
          {/* duration */}
          <div className="flex flex-col items-center mx-auto">
            <div>Duration</div>
            <div className="flex flex-row items-center gap-2 mx-auto max-w-xs">
              <div className="bg-gray-400 rounded-b-sm w-xl h-0.5 justify-center items-center text-center px-2"></div>
              <div>{duration}</div>
              <div className="bg-gray-400 rounded-b-sm w-xl h-0.5 justify-center items-center text-center px-2"></div>
            </div>
          </div>
          {/* arrive */}
          <div className="flex flex-col">
            <div>{arrivalTime}</div>
            <div>{arrivalCity}</div>
          </div>
        </div>
        <div>👥 20 seats available</div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <div>{price}</div>
        <button>Select Seats</button>
      </div>
    </div>
    // <div className={styles.card}>
    //   <div className={styles.left}>
    //     <div className={styles.header}>
    //       <div className={styles.logo}>🚌</div>
    //       <div>
    //         <div>
    //           <span className={styles.company}>{company}</span>
    //           <span className={styles.badge}>{service}</span>
    //         </div>
    //       </div>
    //     </div>

    //     <div className={styles.section}>
    //       <div className={styles.label}>Departure</div>
    //       <div className={styles.time}>{departTime}</div>
    //       <div className={styles.city}>{departCity}</div>
    //       <div className={styles.seats}>👥 {seats} seats available</div>
    //     </div>
    //   </div>

    //   <div className={styles.center}>
    //     <div className={styles.durationLabel}>Duration</div>
    //     <div className={styles.duration}>{duration}</div>
    //   </div>

    //   <div className={styles.right}>
    //     <div className={styles.price}>{price?.toLocaleString()}đ</div>
    //     <button className={styles.selectBtn}>Select Seats</button>
    //     <div className={styles.arrivalLabel}>Arrival</div>
    //     <div className={styles.time}>{arrivalTime}</div>
    //     <div className={styles.city}>{arrivalCity}</div>
    //   </div>
    // </div>
  );
}
