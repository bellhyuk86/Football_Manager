"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import styles from "../mypage.module.scss";

interface TeamManageSectionProps {
  teamName: string;
  inviteCode: string | null;
  onFetchInviteCode: () => void;
  onUpdateTeamName: (name: string) => Promise<boolean>;
  onRegenerateInviteCode: () => void;
}

export default function TeamManageSection({
  teamName,
  inviteCode,
  onFetchInviteCode,
  onUpdateTeamName,
  onRegenerateInviteCode,
}: TeamManageSectionProps) {
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ name: string }>({
    defaultValues: { name: teamName },
  });

  useEffect(() => {
    onFetchInviteCode();
  }, [onFetchInviteCode]);

  const onSubmitTeamName = async (data: { name: string }) => {
    if (data.name === teamName) {
      setEditingTeamName(false);
      return;
    }
    const success = await onUpdateTeamName(data.name);
    if (success) setEditingTeamName(false);
  };

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>팀 관리</h2>

      {/* Team name */}
      <div className={styles.teamRow}>
        <span className={styles.teamRowLabel}>팀명</span>
        {editingTeamName ? (
          <form className={styles.teamRowInline} onSubmit={handleSubmit(onSubmitTeamName)}>
            <TextInput className={styles.fieldInput} {...register("name", { required: true })} />
            <Button type="submit" size="sm">저장</Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                reset({ name: teamName });
                setEditingTeamName(false);
              }}
            >
              취소
            </Button>
          </form>
        ) : (
          <div className={styles.teamRowValue}>
            <span>{teamName}</span>
            <button
              className={styles.teamRowEditBtn}
              onClick={() => setEditingTeamName(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                edit
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Invite code */}
      <div className={styles.teamRow}>
        <span className={styles.teamRowLabel}>초대코드</span>
        <div className={styles.teamRowValue}>
          {inviteCode ? (
            <>
              <code className={styles.inviteCode}>{inviteCode}</code>
              <button className={styles.teamRowEditBtn} onClick={handleCopy} title="복사">
                <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                  {copied ? "check" : "content_copy"}
                </span>
              </button>
            </>
          ) : (
            <span className={styles.teamRowMuted}>로딩 중...</span>
          )}
        </div>
      </div>
      <Button variant="secondary" size="sm" icon="refresh" onClick={onRegenerateInviteCode}>
        초대코드 재발급
      </Button>
    </section>
  );
}
