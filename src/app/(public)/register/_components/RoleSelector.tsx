"use client";

import type { Role } from "@/types";
import styles from "../register.module.scss";

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "manager", label: "Manager" },
  { value: "coach", label: "Coach" },
  { value: "player", label: "Player" },
];

export default function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <section className={styles.roleSection}>
      <label className={styles.roleLabel}>Role Selection</label>
      <div className={styles.roleGrid}>
        {ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            className={`${styles.roleBtn} ${
              value === role.value ? styles.roleBtnActive : ""
            }`}
            onClick={() => onChange(role.value)}
          >
            {role.label}
          </button>
        ))}
      </div>
    </section>
  );
}
