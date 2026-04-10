"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import api from "@/lib/api";
import { hashPassword } from "@/lib/crypto";
import TextInput from "@/app/_components/TextInput/TextInput";
import Button from "@/app/_components/Button/Button";
import styles from "./resetPassword.module.scss";

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  const newPassword = watch("newPassword");

  if (!token) {
    return (
      <div className={styles.card}>
        <div className={styles.statusIcon}>
          <span className="material-symbols-outlined">error</span>
        </div>
        <h2 className={styles.statusTitle}>유효하지 않은 링크</h2>
        <p className={styles.statusDesc}>
          비밀번호 재설정 링크가 유효하지 않습니다.
          <br />
          비밀번호 찾기를 다시 시도해주세요.
        </p>
        <Link href="/login" className={styles.linkBtn}>
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.card}>
        <div className={`${styles.statusIcon} ${styles.successIcon}`}>
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <h2 className={styles.statusTitle}>비밀번호 변경 완료</h2>
        <p className={styles.statusDesc}>
          비밀번호가 성공적으로 변경되었습니다.
          <br />
          새 비밀번호로 로그인해주세요.
        </p>
        <Button
          size="lg"
          fullWidth
          icon="login"
          onClick={() => router.push("/login")}
        >
          로그인하기
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    setError("");

    try {
      const hashedPassword = await hashPassword(data.newPassword);
      await api.patch("/auth/reset-password", {
        token,
        newPassword: hashedPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "비밀번호 재설정에 실패했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>비밀번호 재설정</h1>
        <p className={styles.headerSub}>새로운 비밀번호를 입력해주세요</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>새 비밀번호</label>
          <TextInput
            {...register("newPassword", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 6,
                message: "비밀번호는 6자 이상이어야 합니다.",
              },
            })}
            type="password"
            placeholder="새 비밀번호 입력"
            error={!!errors.newPassword}
          />
          {errors.newPassword && (
            <span className={styles.errorText}>
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>비밀번호 확인</label>
          <TextInput
            {...register("confirmPassword", {
              required: "비밀번호 확인을 입력해주세요.",
              validate: (value) =>
                value === newPassword || "비밀번호가 일치하지 않습니다.",
            })}
            type="password"
            placeholder="비밀번호 다시 입력"
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <span className={styles.errorText}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <Button
          type="submit"
          size="lg"
          fullWidth
          icon={loading ? undefined : "lock_reset"}
          disabled={loading}
        >
          {loading ? "처리 중..." : "비밀번호 변경"}
        </Button>
      </form>

      <div className={styles.footer}>
        <Link href="/login" className={styles.footerLink}>
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bgOverlay}>
        <div className={styles.bgBlobPrimary} />
        <div className={styles.bgBlobSecondary} />
      </div>

      <main className={styles.main}>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
