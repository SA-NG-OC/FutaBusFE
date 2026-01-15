import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import styles from "./TripSort.module.css";

interface TripSortProps {
  onSortChange: (sortBy: string, sortDir: string) => void;
}

export default function TripSort({ onSortChange }: TripSortProps) {
  const searchParams = useSearchParams();
  const sortBy = searchParams?.get("sortBy") || "departureTime";
  const sortDir = searchParams?.get("sortDir") || "asc";

  const [selected, setSelected] = useState<string>(`${sortBy}_${sortDir}`);

  useEffect(() => {
    setSelected(`${sortBy}_${sortDir}`);
  }, [sortBy, sortDir]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);

    // Parse value to sortBy and sortDir
    const [newSortBy, newSortDir] = value.split("_");
    onSortChange(newSortBy, newSortDir);
  };

  return (
    <div className={styles["select-wrapper"]}>
      <select
        className={styles["status-select"]}
        value={selected}
        onChange={handleChange}
      >
        <option value="departureTime_asc">Departure Time: Earliest</option>
        <option value="departureTime_desc">Departure Time: Latest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating_desc">Rating: Highest</option>
      </select>

      <div className={styles["select-icon"]}>
        <FaChevronDown size={12} />
      </div>
    </div>
  );
}
