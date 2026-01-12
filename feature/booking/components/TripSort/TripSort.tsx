import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./TripSort.module.css";

interface TripSortProps {
  value?: string;
  onSortChange: (value: string) => void;
}

export default function TripSort({
  value = "recommended",
  onSortChange,
}: TripSortProps) {
  const [selected, setSelected] = useState<string>(value);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as string;
    setSelected(newValue);
    onSortChange(newValue);
  };

  return (
    <div className={styles["select-wrapper"]}>
      <select
        className={styles["status-select"]}
        value={selected}
        onChange={handleChange}
      >
        <option value="recommended">Sort by: Recommended</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="departure_time">Departure Time</option>
        <option value="rating">Rating</option>
      </select>

      <div className={styles["select-icon"]}>
        <FaChevronDown size={12} />
      </div>
    </div>
  );
}
