"use client";

import { useState, useRef, useEffect } from "react";
import type { TeamMember } from "../_hooks/useTeamMembers";
import styles from "../users.module.scss";

const ROLE_LABEL: Record<string, string> = {
  manager: "감독",
  coach: "코치",
  player: "선수",
};

const ROLES: Array<{ value: "manager" | "coach" | "player"; label: string }> = [
  { value: "manager", label: "감독" },
  { value: "coach", label: "코치" },
  { value: "player", label: "선수" },
];

interface UserCardProps {
  member: TeamMember;
  isCurrentUser: boolean;
  onChangeRole: (userId: string, role: "manager" | "coach" | "player") => void;
}

export default function UserCard({ member, isCurrentUser, onChangeRole }: UserCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleRoleSelect = (role: "manager" | "coach" | "player") => {
    if (role !== member.role) {
      onChangeRole(member.id, role);
    }
    setDropdownOpen(false);
  };

  return (
    <div className={`${styles.card} ${isCurrentUser ? styles.cardCurrent : ""}`}>
      {/* Profile image */}
      <div className={styles.cardAvatar}>
        {member.profileImage ? (
          <img src={member.profileImage} alt={member.name} className={styles.cardAvatarImg} />
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
      <div className={styles.cardRole} ref={dropdownRef}>
        <button
          className={`${styles.cardRoleBadge} ${styles[`cardRoleBadge_${member.role}`]} ${!isCurrentUser ? styles.cardRoleBadgeClickable : ""}`}
          onClick={() => !isCurrentUser && setDropdownOpen(!dropdownOpen)}
          disabled={isCurrentUser}
        >
          {ROLE_LABEL[member.role]}
          {!isCurrentUser && (
            <span className={`material-symbols-outlined ${styles.cardRoleBadgeArrow}`}>
              {dropdownOpen ? "expand_less" : "expand_more"}
            </span>
          )}
        </button>

        {dropdownOpen && (
          <div className={styles.roleDropdown}>
            {ROLES.map((role) => (
              <button
                key={role.value}
                className={`${styles.roleDropdownItem} ${member.role === role.value ? styles.roleDropdownItemActive : ""}`}
                onClick={() => handleRoleSelect(role.value)}
              >
                {role.label}
                {member.role === role.value && (
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
