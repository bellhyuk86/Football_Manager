"use client";

import { useState, useCallback, useRef, useEffect, forwardRef } from "react";
import styles from "./TimeInput.module.scss";

interface TimeInputProps {
  value?: string | null;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (...args: any[]) => void;
  name?: string;
  error?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
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
      placeholder = "시간 선택",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (value !== undefined) setInternalValue(value || "");
    }, [value]);

    const displayValue = value ?? internalValue;
    const [selectedHour, selectedMinute] = displayValue
      ? displayValue.split(":")
      : ["", ""];

    const fireChange = useCallback(
      (h: string, m: string) => {
        const formatted = `${h}:${m}`;
        setInternalValue(formatted);
        if (onChange) {
          const nativeEvent = new Event("change", { bubbles: true });
          Object.defineProperty(nativeEvent, "target", {
            writable: false,
            value: { value: formatted, name },
          });
          onChange(
            nativeEvent as unknown as {
              target: { value: string; name?: string };
            }
          );
        }
      },
      [onChange, name]
    );

    const handleHourSelect = useCallback(
      (h: string) => {
        const m = selectedMinute || "00";
        fireChange(h, m);
      },
      [selectedMinute, fireChange]
    );

    const handleMinuteSelect = useCallback(
      (m: string) => {
        const h = selectedHour || "00";
        fireChange(h, m);
      },
      [selectedHour, fireChange]
    );

    const handleClear = useCallback(() => {
      setInternalValue("");
      if (onChange) {
        const nativeEvent = new Event("change", { bubbles: true });
        Object.defineProperty(nativeEvent, "target", {
          writable: false,
          value: { value: "", name },
        });
        onChange(
          nativeEvent as unknown as {
            target: { value: string; name?: string };
          }
        );
      }
      setOpen(false);
    }, [onChange, name]);

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Scroll to selected values when opening
    useEffect(() => {
      if (!open) return;
      requestAnimationFrame(() => {
        if (hourListRef.current && selectedHour) {
          const el = hourListRef.current.querySelector(
            `[data-value="${selectedHour}"]`
          );
          el?.scrollIntoView({ block: "center" });
        }
        if (minuteListRef.current && selectedMinute) {
          const el = minuteListRef.current.querySelector(
            `[data-value="${selectedMinute}"]`
          );
          el?.scrollIntoView({ block: "center" });
        }
      });
    }, [open, selectedHour, selectedMinute]);

    const cls = [
      styles.wrapper,
      error ? styles.error : "",
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cls} ref={wrapperRef}>
        <input
          ref={ref}
          type="text"
          name={name}
          readOnly
          className={styles.input}
          value={displayValue || ""}
          placeholder={placeholder}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          onBlur={onBlur}
        />
        <span
          className={`material-symbols-outlined ${styles.icon}`}
          onClick={() => !disabled && setOpen(!open)}
        >
          schedule
        </span>
        {open && (
          <div className={styles.popover}>
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownTitle}>시간 선택</span>
              {displayValue && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClear}
                >
                  초기화
                </button>
              )}
            </div>
            <div className={styles.columnsWrapper}>
              {/* Hour column */}
              <div className={styles.column}>
                <div className={styles.columnLabel}>시</div>
                <div className={styles.columnList} ref={hourListRef}>
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      data-value={h}
                      className={`${styles.columnItem} ${
                        selectedHour === h ? styles.columnItemActive : ""
                      }`}
                      onClick={() => handleHourSelect(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className={styles.separator}>:</div>

              {/* Minute column */}
              <div className={styles.column}>
                <div className={styles.columnLabel}>분</div>
                <div className={styles.columnList} ref={minuteListRef}>
                  {MINUTES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-value={m}
                      className={`${styles.columnItem} ${
                        selectedMinute === m ? styles.columnItemActive : ""
                      }`}
                      onClick={() => handleMinuteSelect(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";
export default TimeInput;
