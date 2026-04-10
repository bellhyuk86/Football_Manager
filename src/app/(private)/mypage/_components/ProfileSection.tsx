"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/app/_components/Button/Button";
import TextInput from "@/app/_components/TextInput/TextInput";
import styles from "../mypage.module.scss";

const ROLE_LABEL: Record<string, string> = {
  manager: "감독",
  coach: "코치",
  player: "선수",
};

interface ProfileSectionProps {
  profile: {
    username: string;
    name: string;
    email: string;
    role: string;
    profileImage: string | null;
    team: { name: string } | null;
  };
  onUpdate: (payload: { name?: string; email?: string }) => Promise<boolean>;
  onUploadImage: (file: File) => Promise<boolean>;
  onDeleteImage: () => Promise<boolean>;
}

interface ProfileFormValues {
  name: string;
  email: string;
}

export default function ProfileSection({
  profile,
  onUpdate,
  onUploadImage,
  onDeleteImage,
}: ProfileSectionProps) {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile.name,
      email: profile.email,
    },
  });

  const handleCancel = () => {
    reset({ name: profile.name, email: profile.email });
    setEditing(false);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const payload: Record<string, string> = {};
    if (data.name !== profile.name) payload.name = data.name;
    if (data.email !== profile.email) payload.email = data.email;

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    const success = await onUpdate(payload);
    if (success) setEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadImage(file);
    e.target.value = "";
  };

  const imageUrl = profile.profileImage || null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>기본 프로필</h2>

      <div className={styles.profileCard}>
        {/* Avatar with upload */}
        <div className={styles.profileAvatarWrapper}>
          <div className={styles.profileAvatar}>
            {imageUrl ? (
              <img src={imageUrl} alt={profile.name} className={styles.profileAvatarImg} />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
          <div className={styles.profileAvatarActions}>
            <button
              className={styles.profileAvatarBtn}
              onClick={() => fileInputRef.current?.click()}
              title="이미지 변경"
            >
              <span className="material-symbols-outlined">photo_camera</span>
            </button>
            {profile.profileImage && (
              <button
                className={`${styles.profileAvatarBtn} ${styles.profileAvatarBtnDanger}`}
                onClick={onDeleteImage}
                title="이미지 삭제"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {/* Info / Edit form */}
        {!editing ? (
          <div className={styles.profileInfo}>
            <h3 className={styles.profileName}>{profile.name}</h3>
            <div className={styles.profileMeta}>
              <span>@{profile.username}</span>
              <span>{profile.email}</span>
            </div>
            <div className={styles.profileTags}>
              <span className={styles.profileRoleBadge}>
                {ROLE_LABEL[profile.role] || profile.role}
              </span>
              {profile.team && (
                <span className={styles.profileTeamBadge}>{profile.team.name}</span>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon="edit"
              onClick={() => setEditing(true)}
            >
              프로필 수정
            </Button>
          </div>
        ) : (
          <form className={styles.profileForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>이름</label>
              <TextInput
                className={styles.fieldInput}
                {...register("name", { required: "이름을 입력하세요." })}
                error={!!errors.name}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>이메일</label>
              <input
                type="email"
                className={styles.fieldInput}
                {...register("email", { required: "이메일을 입력하세요." })}
              />
              {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
            </div>
            <div className={styles.fieldActions}>
              <Button type="button" variant="secondary" size="sm" onClick={handleCancel}>
                취소
              </Button>
              <Button type="submit" size="sm">
                저장
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
