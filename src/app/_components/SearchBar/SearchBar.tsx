"use client";

import TextInput from "@/app/_components/TextInput/TextInput";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "검색...",
  className,
}: SearchBarProps) {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <span className={`material-symbols-outlined ${styles.icon}`}>search</span>
      <TextInput
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth={false}
      />
      {value && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange("")}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}
