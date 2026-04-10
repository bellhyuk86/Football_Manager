"use client";

import { useState, useCallback, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import styles from "./DateInput.module.scss";

const MONTH_NAMES = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

interface DateInputProps {
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (...args: any[]) => void;
  name?: string;
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  popoverPosition?: "bottom" | "top";
}

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      error = false,
      fullWidth = true,
      disabled = false,
      className,
      placeholder = "연도-월-일",
      popoverPosition = "bottom",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");

    useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    const displayValue = value ?? internalValue;
    const selected = displayValue ? new Date(displayValue + "T00:00:00") : null;

    const handleChange = useCallback(
      (date: Date | null) => {
        if (!date) return;
        const formatted = formatDate(date);
        setInternalValue(formatted);

        if (onChange) {
          const nativeEvent = new Event("change", { bubbles: true });
          Object.defineProperty(nativeEvent, "target", {
            writable: false,
            value: { value: formatted, name },
          });
          onChange(nativeEvent as unknown as { target: { value: string; name?: string } });
        }
        setOpen(false);
      },
      [onChange, name]
    );

    const cls = [
      styles.wrapper,
      error ? styles.error : "",
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cls}>
        <input
          ref={ref}
          type="text"
          name={name}
          readOnly
          className={styles.input}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && setOpen(true)}
          onBlur={onBlur}
        />
        <span
          className={`material-symbols-outlined ${styles.icon}`}
          onClick={() => !disabled && setOpen(true)}
        >
          calendar_today
        </span>
        {open && (
          <div className={`${styles.popover} ${popoverPosition === "top" ? styles.popoverTop : ""}`}>
            <div className={styles.calendarContainer}>
              {/* Custom day-of-week header */}
              <div className={styles.dayNamesRow}>
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <span key={d} className={styles.dayNameCell}>{d}</span>
                ))}
              </div>

              <DatePicker
                selected={selected}
                onChange={handleChange}
                onClickOutside={() => setOpen(false)}
                inline
                calendarClassName={styles.calendar}
                dayClassName={() => styles.day}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className={styles.header}>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className={styles.headerTitle}>
                      {date.getFullYear()}년 {MONTH_NAMES[date.getMonth()]}
                    </span>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";
export default DateInput;
