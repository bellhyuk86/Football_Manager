"use client";

import type { TeamMember } from "../_hooks/useTeamMembers";
import styles from "../users.module.scss";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000";

const ROLE_LABEL: Record<string, string> = {
  manager: "감독",
  coach: "코치",
  player: "선수",
};

interface UserCardProps {
  member: TeamMember;
  isCurrentUser: boolean;
  onChangeRole: (userId: string, role: "manager" | "coach" | "player") => void;
}

export default function UserCard({ member, isCurrentUser, onChangeRole }: UserCardProps) {
  return (
    <div className={`${styles.card} ${isCurrentUser ? styles.cardCurrent : ""}`}>
      {/* Profile image */}
      <div className={styles.cardAvatar}>
        {member.profileImage ? (
          <img src={`${API_BASE}${member.profileImage}`} alt={member.name} className={styles.cardAvatarImg} />
        ) : (
          <span className="material-symbols-outlined">person</span>
        )}
      </div>

      {/* Info */}
      <div className={styles.cardInfo}>
        <div className={styles.cardNameRow}>
          <h3 className={styles.cardName}>{member.name}</h3>
          {isCurrentUser && <span className={styles.cardMeBadge}>나</span>}
        </div>
        <span className={styles.cardUsername}>@{member.username}</span>
        <span className={styles.cardEmail}>{member.email}</span>
      </div>

      {/* Role */}
      <div className={styles.cardRole}>
        <span className={`${styles.cardRoleBadge} ${styles[`cardRoleBadge_${member.role}`]}`}>
          {ROLE_LABEL[member.role]}
        </span>

        {!isCurrentUser && (
          <select
            className={styles.cardRoleSelect}
            value={member.role}
            onChange={(e) =>
              onChangeRole(member.id, e.target.value as "manager" | "coach" | "player")
            }
          >
            <option value="manager">감독</option>
            <option value="coach">코치</option>
            <option value="player">선수</option>
          </select>
        )}
      </div>
    </div>
  );
}
