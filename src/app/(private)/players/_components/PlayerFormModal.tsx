"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import api from "@/lib/api";
import { useCreatePlayer } from "../_hooks/useCreatePlayer";
import { useUpdatePlayer } from "../_hooks/useUpdatePlayer";
import type { Player, PlayerFormValues } from "@/types";
import styles from "./AddPlayerModal.module.scss";

interface TeamMember {
  id: string;
  name: string;
  username: string;
}

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editPlayer?: Player | null;
}

const STAT_FIELDS: { key: keyof PlayerFormValues; label: string }[] = [
  { key: "speed", label: "속도" },
  { key: "shooting", label: "슛" },
  { key: "passing", label: "패스" },
  { key: "dribbling", label: "드리블" },
  { key: "defending", label: "수비" },
  { key: "physical", label: "체력" },
];

export default function PlayerFormModal({
  isOpen,
  onClose,
  onSuccess,
  editPlayer,
}: PlayerFormModalProps) {
  const isEdit = !!editPlayer;
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const {
    loading: createLoading,
    error: createError,
    createPlayer,
    resetError: resetCreateError,
  } = useCreatePlayer();
  const {
    loading: updateLoading,
    error: updateError,
    updatePlayer,
    resetError: resetUpdateError,
  } = useUpdatePlayer();

  const loading = isEdit ? updateLoading : createLoading;
  const error = isEdit ? updateError : createError;

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

  useEffect(() => {
    if (isOpen) {
      api.get("/users/team-members").then(({ data }) => setTeamMembers(data)).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editPlayer) {
      reset({
        name: editPlayer.name,
        position: editPlayer.position,
        speed: editPlayer.speed,
        shooting: editPlayer.shooting,
        passing: editPlayer.passing,
        dribbling: editPlayer.dribbling,
        defending: editPlayer.defending,
        physical: editPlayer.physical,
      });
      setSelectedUserId(editPlayer.userId || "");
    } else if (isOpen && !editPlayer) {
      reset({
        name: "",
        position: "MF",
        speed: 50,
        shooting: 50,
        passing: 50,
        dribbling: 50,
        defending: 50,
        physical: 50,
      });
      setSelectedUserId("");
    }
  }, [isOpen, editPlayer, reset]);

  const handleClose = () => {
    reset();
    setSelectedUserId("");
    resetCreateError();
    resetUpdateError();
    onClose();
  };

  const onSubmit = async (data: PlayerFormValues) => {
    const payload = {
      name: data.name.trim(),
      position: data.position,
      speed: Number(data.speed),
      shooting: Number(data.shooting),
      passing: Number(data.passing),
      dribbling: Number(data.dribbling),
      defending: Number(data.defending),
      physical: Number(data.physical),
      userId: selectedUserId || null,
    };

    let success: boolean;
    if (isEdit) {
      success = await updatePlayer(editPlayer!.id, payload);
    } else {
      success = await createPlayer(payload);
    }

    if (success) {
      toast.success(isEdit ? "선수 정보가 수정되었습니다." : "선수가 등록되었습니다.");
      handleClose();
      onSuccess();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {isEdit ? "선수 수정" : "선수 등록"}
        </h2>
        <p className={styles.desc}>
          {isEdit
            ? "선수의 정보를 수정하세요."
            : "새로운 선수의 정보를 입력하세요."}
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Name & Position */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>선수명</label>
            <TextInput
              {...register("name", { required: "선수명을 입력해주세요." })}
              error={!!errors.name}
              className={styles.input}
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

        {/* User Link */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>유저 연결 (선택)</label>
          <select
            className={styles.select}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">연결 안 함</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (@{m.username})
              </option>
            ))}
          </select>
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
        <Button
          type="submit"
          size="lg"
          fullWidth
          icon={isEdit ? "edit" : "person_add"}
          disabled={loading}
        >
          {loading
            ? isEdit
              ? "수정 중..."
              : "등록 중..."
            : isEdit
              ? "선수 수정"
              : "선수 등록"}
        </Button>
      </form>
    </Modal>
  );
}
