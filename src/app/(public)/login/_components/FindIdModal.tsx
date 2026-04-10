"use client";

import { useForm } from "react-hook-form";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import { useFindUsername } from "../_hooks/useFindUsername";
import type { FindIdFormValues } from "@/types";
import styles from "./AuthModal.module.scss";

interface FindIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FindIdModal({ isOpen, onClose }: FindIdModalProps) {
  const { maskedUsername, error, loading, findUsername, reset: resetResult } =
    useFindUsername();

  const { register, handleSubmit, reset: resetForm } =
    useForm<FindIdFormValues>({
      defaultValues: { name: "", email: "" },
    });

  const handleClose = () => {
    resetResult();
    resetForm();
    onClose();
  };

  const onSubmit = (data: FindIdFormValues) => {
    findUsername(data.name.trim(), data.email.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>Find ID</h2>
        <p className={styles.desc}>
          계정 정보를 찾기 위해 성명과 이메일을 입력해 주세요.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Name</label>
          <TextInput
            {...register("name", { required: true })}
            className={styles.input}
            placeholder="성명을 입력하세요"
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
          {loading ? "FINDING..." : "FIND"}
        </Button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {maskedUsername && (
        <div className={styles.result}>
          <div className={styles.resultBox}>
            <p className={styles.resultLabel}>MATCH FOUND</p>
            <p className={styles.resultId}>{maskedUsername}</p>
            <button className={styles.resultAction} onClick={handleClose}>
              LOGIN WITH THIS ID
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
