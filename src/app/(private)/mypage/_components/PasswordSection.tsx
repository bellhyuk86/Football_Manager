"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/_components/Button/Button";
import styles from "../mypage.module.scss";

interface PasswordSectionProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordSection({ onChangePassword }: PasswordSectionProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PasswordFormValues>();

  const onSubmit = async (data: PasswordFormValues) => {
    const success = await onChangePassword(data.currentPassword, data.newPassword);
    if (success) {
      reset();
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>비밀번호</h2>
        <Button variant="secondary" size="sm" icon="lock" onClick={() => setOpen(true)}>
          비밀번호 변경
        </Button>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
      <form className={styles.passwordForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>현재 비밀번호</label>
          <input
            type="password"
            className={styles.fieldInput}
            {...register("currentPassword", { required: "현재 비밀번호를 입력하세요." })}
          />
          {errors.currentPassword && (
            <span className={styles.fieldError}>{errors.currentPassword.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>새 비밀번호</label>
          <input
            type="password"
            className={styles.fieldInput}
            {...register("newPassword", {
              required: "새 비밀번호를 입력하세요.",
              minLength: { value: 6, message: "6자 이상 입력하세요." },
            })}
          />
          {errors.newPassword && (
            <span className={styles.fieldError}>{errors.newPassword.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>새 비밀번호 확인</label>
          <input
            type="password"
            className={styles.fieldInput}
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력하세요.",
              validate: (v) => v === watch("newPassword") || "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.confirmPassword && (
            <span className={styles.fieldError}>{errors.confirmPassword.message}</span>
          )}
        </div>
        <div className={styles.fieldActions}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              reset();
              setOpen(false);
            }}
          >
            취소
          </Button>
          <Button type="submit" size="sm">
            변경
          </Button>
        </div>
      </form>
    </section>
  );
}
