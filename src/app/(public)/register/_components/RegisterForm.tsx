"use client";

import { useForm } from "react-hook-form";
import RoleSelector from "./RoleSelector";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import type { Role, RegisterPayload, RegisterFormValues } from "@/types";
import styles from "../register.module.scss";

interface RegisterFormProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  onSubmit: (data: RegisterPayload) => void;
  loading: boolean;
  serverError: string | null;
}

export default function RegisterForm({
  role,
  onRoleChange,
  onSubmit,
  loading,
  serverError,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      teamName: "",
      inviteCode: "",
    },
  });

  const password = watch("password");

  const handleFormSubmit = (data: RegisterFormValues) => {
    onSubmit({
      name: data.name.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
      role,
      teamName: role === "manager" ? data.teamName.trim() : undefined,
      inviteCode: role !== "manager" ? data.inviteCode.trim() : undefined,
    });
  };

  return (
    <>
      <RoleSelector value={role} onChange={onRoleChange} />

      <form
        className={styles.form}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* Name & Username */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Name</label>
            <TextInput
              {...register("name", { required: "이름을 입력해주세요." })}
              error={!!errors.name}
              className={styles.input}
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className={styles.fieldError}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Account ID</label>
            <TextInput
              {...register("username", {
                required: "아이디를 입력해주세요.",
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: "영문+숫자 조합만 가능합니다.",
                },
              })}
              error={!!errors.username}
              className={styles.input}
              placeholder="ID를 생성하세요"
            />
            {errors.username && (
              <p className={styles.fieldError}>{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "유효한 이메일을 입력해주세요.",
              },
            })}
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="example@tactify.com"
          />
          {errors.email && (
            <p className={styles.fieldError}>{errors.email.message}</p>
          )}
        </div>

        {/* Password & Confirm */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: {
                  value: 6,
                  message: "6자 이상 입력해주세요.",
                },
              })}
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={styles.fieldError}>{errors.password.message}</p>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              {...register("confirmPassword", {
                required: "비밀번호 확인을 입력해주세요.",
                validate: (v) =>
                  v === password || "비밀번호가 일치하지 않습니다.",
              })}
              type="password"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className={styles.fieldError}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Role Field */}
        <div className={`${styles.fieldGroup} ${styles.dynamicField}`}>
          {role === "manager" ? (
            <>
              <label className={styles.label}>Team Name</label>
              <TextInput
                {...register("teamName", {
                  required:
                    role === "manager" ? "팀명을 입력해주세요." : false,
                })}
                error={!!errors.teamName}
                className={styles.input}
                placeholder="구단 이름을 입력하세요"
              />
              {errors.teamName && (
                <p className={styles.fieldError}>{errors.teamName.message}</p>
              )}
            </>
          ) : (
            <>
              <div className={styles.dynamicLabelRow}>
                <label className={styles.label}>Invite Code</label>
                {serverError && (
                  <span className={styles.dynamicHint}>
                    Authentication Required
                  </span>
                )}
              </div>
              <div className={styles.inviteInputWrapper}>
                <TextInput
                  {...register("inviteCode", {
                    required: "초대코드를 입력해주세요.",
                  })}
                  error={!!errors.inviteCode || !!serverError}
                  className={styles.input}
                  placeholder="FC-XXXXXX"
                />
                {(errors.inviteCode || serverError) && (
                  <span
                    className={`material-symbols-outlined ${styles.inviteErrorIcon}`}
                  >
                    error
                  </span>
                )}
              </div>
              {errors.inviteCode && (
                <p className={styles.fieldError}>
                  {errors.inviteCode.message}
                </p>
              )}
            </>
          )}
        </div>

        {/* Server Error */}
        {serverError && <p className={styles.formError}>{serverError}</p>}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          icon={loading ? undefined : "arrow_forward"}
          disabled={loading}
        >
          {loading ? "SIGNING UP..." : "SIGN UP"}
        </Button>
      </form>
    </>
  );
}
