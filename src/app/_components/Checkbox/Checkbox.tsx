"use client";

import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={`${styles.checkbox} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.input}
      />
      <span className={`${styles.box} ${checked ? styles.checked : ""}`}>
        {checked && (
          <span className={`material-symbols-outlined ${styles.icon}`}>
            check
          </span>
        )}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
