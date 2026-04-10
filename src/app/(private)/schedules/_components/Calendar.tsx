"use client";

import { useState, useMemo } from "react";
import type { Schedule } from "@/types";
import styles from "../schedules.module.scss";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarProps {
  schedulesByDate: Record<string, Schedule[]>;
  selectedDate: string | null;
  onDateClick: (date: string) => void;
}

export default function Calendar({
  schedulesByDate,
  selectedDate,
  onDateClick,
}: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const cells: { date: string; day: number; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      cells.push({
        date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = month === 11 ? 1 : month + 2;
        const y = month === 11 ? year + 1 : year;
        cells.push({
          date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
          day: d,
          isCurrentMonth: false,
        });
      }
    }

    return cells;
  }, [year, month]);

  const handlePrev = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  return (
    <div className={styles.calendar}>
      {/* Header */}
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarTitle}>
          {year}년 {month + 1}월
        </h2>
        <div className={styles.calendarNav}>
          <button className={styles.calendarNavBtn} onClick={handleToday}>
            오늘
          </button>
          <button className={styles.calendarNavBtn} onClick={handlePrev}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className={styles.calendarNavBtn} onClick={handleNext}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className={styles.calendarWeekdays}>
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`${styles.calendarWeekday} ${i === 0 ? styles.calendarWeekdaySun : ""}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className={styles.calendarGrid}>
        {days.map(({ date, day, isCurrentMonth }) => {
          const events = schedulesByDate[date] || [];
          const isSelected = date === selectedDate;
          const isToday = date === todayStr;
          const dayOfWeek = new Date(date).getDay();

          return (
            <div
              key={date}
              className={[
                styles.calendarCell,
                !isCurrentMonth ? styles.calendarCellMuted : "",
                isSelected ? styles.calendarCellSelected : "",
                isToday ? styles.calendarCellToday : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onDateClick(date)}
            >
              <span
                className={`${styles.calendarDay} ${dayOfWeek === 0 ? styles.calendarDaySun : ""}`}
              >
                {day}
              </span>
              {events.length > 0 && (
                <div className={styles.calendarEvents}>
                  {events.slice(0, 2).map((evt) => (
                    <div key={evt.id} className={styles.calendarEvent}>
                      {evt.title}
                    </div>
                  ))}
                  {events.length > 2 && (
                    <span className={styles.calendarEventMore}>
                      +{events.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
