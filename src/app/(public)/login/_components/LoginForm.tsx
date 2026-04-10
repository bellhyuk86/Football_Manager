"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../_hooks/useLogin";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import type { LoginFormValues } from "@/types";
import styles from "../login.module.scss";

export default function LoginForm() {
  const { error, loading, rememberedUsername, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const { register, handleSubmit, setValue } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (rememberedUsername) {
      setValue("username", rememberedUsername);
      setValue("rememberMe", true);
    }
  }, [rememberedUsername, setValue]);

  const handleKeyEvent = (e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  const onSubmit = (data: LoginFormValues) => {
    login(data.username.trim(), data.password.trim(), data.rememberMe);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {/* Manager ID */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Manager ID</label>
        <div className={styles.inputWrapper}>
          <TextInput
            {...register("username", { required: true })}
            className={styles.input}
            placeholder="아이디를 입력하세요"
          />
          <span className={`material-symbols-outlined ${styles.inputIcon}`}>
            account_circle
          </span>
        </div>
      </div>

      {/* Password */}
      <div className={styles.fieldGroup}>
        <div className={`${styles.label} ${styles.labelRow}`}>
          <span>Password</span>
          {capsLock && (
            <span className={styles.capsWarning}>
              <span
                className={`material-symbols-outlined ${styles.capsWarningIcon}`}
              >
                warning
              </span>
              Caps Lock is ON
            </span>
          )}
        </div>
        <div className={styles.inputWrapper}>
          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            className={styles.input}
            placeholder="비밀번호를 입력하세요"
            onKeyDown={handleKeyEvent}
            onKeyUp={handleKeyEvent}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* Remember ID */}
      <div>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              {...register("rememberMe")}
            />
            <div className={styles.checkboxVisual} />
            <span
              className={`material-symbols-outlined ${styles.checkboxCheck}`}
            >
              check
            </span>
          </div>
          <span className={styles.checkboxText}>아이디 기억하기</span>
        </label>
      </div>

      {/* Error */}
      {error && <p className={styles.loginError}>{error}</p>}

      {/* Login Button */}
      <Button
        type="submit"
        size="lg"
        fullWidth
        icon={loading ? undefined : "arrow_forward"}
        disabled={loading}
      >
        {loading ? "LOGGING IN..." : "LOGIN"}
      </Button>
    </form>
  );
}
