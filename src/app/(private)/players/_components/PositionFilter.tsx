"use client";

import type { Position } from "@/types";
import styles from "../players.module.scss";

interface PositionFilterProps {
  value: Position | null;
  onChange: (position: Position | null) => void;
}

const FILTERS: { value: Position | null; label: string }[] = [
  { value: null, label: "전체" },
  { value: "GK", label: "GK" },
  { value: "DF", label: "DF" },
  { value: "MF", label: "MF" },
  { value: "FW", label: "FW" },
];

export default function PositionFilter({
  value,
  onChange,
}: PositionFilterProps) {
  return (
    <div className={styles.filterBar}>
      {FILTERS.map((filter) => (
        <button
          key={filter.label}
          type="button"
          className={`${styles.filterBtn} ${
            value === filter.value ? styles.filterBtnActive : ""
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
