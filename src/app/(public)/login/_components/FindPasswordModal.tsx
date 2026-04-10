"use client";

import { useForm } from "react-hook-form";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import { useFindPassword } from "../_hooks/useFindPassword";
import type { FindPasswordFormValues } from "@/types";
import styles from "./AuthModal.module.scss";

interface FindPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindPasswordModal({
  isOpen,
  onClose,
}: FindPasswordModalProps) {
  const { sent, error, loading, findPassword, reset: resetResult } =
    useFindPassword();

  const { register, handleSubmit, reset: resetForm } =
    useForm<FindPasswordFormValues>({
      defaultValues: { username: "", email: "" },
    });

  const handleClose = () => {
    resetResult();
    resetForm();
    onClose();
  };

  const onSubmit = (data: FindPasswordFormValues) => {
    findPassword(data.username.trim(), data.email.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>Find Password</h2>
        <p className={styles.desc}>
          아이디와 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Manager ID</label>
          <TextInput
            {...register("username", { required: true })}
            className={styles.input}
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            className={styles.input}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <Button type="submit" variant="secondary" size="lg" fullWidth disabled={loading}>
          {loading ? "SENDING..." : "SEND RESET LINK"}
        </Button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {sent && (
        <div className={styles.result}>
          <div className={styles.resultBox}>
            <p className={styles.resultLabel}>EMAIL SENT</p>
            <p className={styles.resultMessage}>
              비밀번호 재설정 링크가 이메일로 발송되었습니다.
              <br />
              메일함을 확인해 주세요.
            </p>
            <button className={styles.resultAction} onClick={handleClose}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
