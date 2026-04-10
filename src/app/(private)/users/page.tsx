"use client";

import { useState, useCallback } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { useTeamMembers } from "./_hooks/useTeamMembers";
import UserCard from "./_components/UserCard";
import RoleChangeModal from "./_components/RoleChangeModal";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "./users.module.scss";

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { members, loading, changeRole } = useTeamMembers();

  const [roleChange, setRoleChange] = useState<{
    userId: string;
    name: string;
    newRole: "manager" | "coach" | "player";
  } | null>(null);

  const handleChangeRole = useCallback(
    (userId: string, role: "manager" | "coach" | "player") => {
      const member = members.find((m) => m.id === userId);
      if (!member || member.role === role) return;
      setRoleChange({ userId, name: member.name, newRole: role });
    },
    [members]
  );

  const handleConfirm = useCallback(async () => {
    if (!roleChange) return;
    await changeRole(roleChange.userId, roleChange.newRole);
    setRoleChange(null);
  }, [roleChange, changeRole]);

  const isManagerTransfer = roleChange?.newRole === "manager";

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>유저 관리</h1>
          <p className={styles.headerDesc}>
            팀원 {members.length}명을 관리하고 있습니다.
          </p>
        </div>
      </header>

      {loading ? (
        <PageContainer loading />
      ) : (
        <div className={styles.cardGrid}>
          {members.map((member) => (
            <UserCard
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUser?.id}
              onChangeRole={handleChangeRole}
            />
          ))}
        </div>
      )}

      <RoleChangeModal
        isOpen={roleChange !== null}
        memberName={roleChange?.name || ""}
        newRole={roleChange?.newRole || "player"}
        isManagerTransfer={!!isManagerTransfer}
        onClose={() => setRoleChange(null)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
