"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import DateInput from "@/app/_components/DateInput/DateInput";
import TimeInput from "@/app/_components/TimeInput/TimeInput";
import type { ScheduleDetail, SchedulePayload } from "@/types";
import styles from "../schedules.module.scss";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SchedulePayload) => Promise<boolean>;
  initialDate?: string;
  schedule?: ScheduleDetail | null;
}

function parseMatchTime(matchTime: string | null | undefined): string {
  if (!matchTime) return "";
  // matchTime comes as ISO string like "1970-01-01T03:00:00.000Z" (UTC)
  // or could be "HH:mm" already
  if (matchTime.length <= 5) return matchTime;
  // Parse as local time to avoid timezone offset
  const d = new Date(matchTime);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  initialDate,
  schedule,
}: ScheduleModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!schedule;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SchedulePayload>({
    defaultValues: {
      title: "",
      matchDate: initialDate || "",
      matchTime: null,
      location: null,
      note: null,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    if (schedule) {
      reset({
        title: schedule.title,
        matchDate: schedule.matchDate.split("T")[0],
        matchTime: parseMatchTime(schedule.matchTime),
        location: schedule.location,
        note: schedule.note,
      });
    } else {
      reset({
        title: "",
        matchDate: initialDate || "",
        matchTime: null,
        location: null,
        note: null,
      });
    }
  }, [isOpen, schedule, initialDate, reset]);

  const onFormSubmit = async (data: SchedulePayload) => {
    setSubmitting(true);
    const payload: SchedulePayload = {
      ...data,
      matchTime: data.matchTime || null,
      location: data.location || null,
      note: data.note || null,
    };
    const success = await onSubmit(payload);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.scheduleModal}>
        <h3 className={styles.scheduleModalTitle}>
          {isEdit ? "스케줄 수정" : "새 스케줄"}
        </h3>
        <p className={styles.scheduleModalDesc}>
          {isEdit ? "일정 정보를 수정하세요." : "새로운 일정을 등록하세요."}
        </p>

        <form
          className={styles.scheduleForm}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className={styles.scheduleField}>
            <label className={styles.scheduleLabel}>일정 제목 *</label>
            <TextInput
              className={styles.scheduleInput}
              placeholder="예: FC 한강전"
              {...register("title", { required: "제목을 입력하세요." })}
              error={!!errors.title}
            />
            {errors.title && (
              <span className={styles.scheduleError}>
                {errors.title.message}
              </span>
            )}
          </div>

          <div className={styles.scheduleFieldRow}>
            <div className={styles.scheduleField}>
              <label className={styles.scheduleLabel}>경기 날짜 *</label>
              <Controller
                name="matchDate"
                control={control}
                rules={{ required: "날짜를 선택하세요." }}
                render={({ field }) => (
                  <DateInput
                    className={styles.scheduleInput}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    error={!!errors.matchDate}
                  />
                )}
              />
              {errors.matchDate && (
                <span className={styles.scheduleError}>
                  {errors.matchDate.message}
                </span>
              )}
            </div>
            <div className={styles.scheduleField}>
              <label className={styles.scheduleLabel}>경기 시간</label>
              <Controller
                name="matchTime"
                control={control}
                render={({ field }) => (
                  <TimeInput
                    className={styles.scheduleInput}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.scheduleField}>
            <label className={styles.scheduleLabel}>경기장</label>
            <TextInput
              className={styles.scheduleInput}
              placeholder="예: 잠실 운동장"
              {...register("location")}
            />
          </div>

          <div className={styles.scheduleField}>
            <label className={styles.scheduleLabel}>기타사항</label>
            <textarea
              className={`${styles.scheduleInput} ${styles.scheduleTextarea}`}
              placeholder="예: 집합 시간 13:00"
              rows={3}
              {...register("note")}
            />
          </div>

          <div className={styles.scheduleModalActions}>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={submitting}
            >
              {submitting ? "저장 중..." : isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
