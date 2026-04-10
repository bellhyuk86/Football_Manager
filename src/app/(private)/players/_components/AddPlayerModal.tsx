"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/app/_components/Modal/Modal";
import { useCreatePlayer } from "../_hooks/useCreatePlayer";
import type { Position } from "@/types";
import styles from "./AddPlayerModal.module.scss";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PlayerFormValues {
  name: string;
  position: Position;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

const STAT_FIELDS: { key: keyof PlayerFormValues; label: string }[] = [
  { key: "speed", label: "속도" },
  { key: "shooting", label: "슛" },
  { key: "passing", label: "패스" },
  { key: "dribbling", label: "드리블" },
  { key: "defending", label: "수비" },
  { key: "physical", label: "체력" },
];

export default function AddPlayerModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPlayerModalProps) {
  const { loading, error, createPlayer, resetError } = useCreatePlayer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerFormValues>({
    defaultValues: {
      name: "",
      position: "MF",
      speed: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50,
    },
  });

  const handleClose = () => {
    reset();
    resetError();
    onClose();
  };

  const onSubmit = async (data: PlayerFormValues) => {
    const success = await createPlayer({
      name: data.name.trim(),
      position: data.position,
      speed: Number(data.speed),
      shooting: Number(data.shooting),
      passing: Number(data.passing),
      dribbling: Number(data.dribbling),
      defending: Number(data.defending),
      physical: Number(data.physical),
    });

    if (success) {
      toast.success("선수가 등록되었습니다.");
      handleClose();
      onSuccess();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>선수 등록</h2>
        <p className={styles.desc}>
          새로운 선수의 정보를 입력하세요.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Name & Position */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>선수명</label>
            <input
              {...register("name", { required: "선수명을 입력해주세요." })}
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className={styles.fieldError}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>포지션</label>
            <select
              {...register("position", { required: true })}
              className={styles.select}
            >
              <option value="GK">GK (골키퍼)</option>
              <option value="DF">DF (수비수)</option>
              <option value="MF">MF (미드필더)</option>
              <option value="FW">FW (공격수)</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsSection}>
          <p className={styles.statsLabel}>능력치 (0 ~ 100)</p>
          <div className={styles.statsGrid}>
            {STAT_FIELDS.map((stat) => (
              <div key={stat.key} className={styles.statField}>
                <label className={styles.statLabel}>{stat.label}</label>
                <input
                  {...register(stat.key, {
                    required: true,
                    min: { value: 0, message: "0 이상" },
                    max: { value: 100, message: "100 이하" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  className={`${styles.statInput} ${
                    errors[stat.key] ? styles.inputError : ""
                  }`}
                  min={0}
                  max={100}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className={styles.formError}>{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
            person_add
          </span>
          {loading ? "등록 중..." : "선수 등록"}
        </button>
      </form>
    </Modal>
  );
}
