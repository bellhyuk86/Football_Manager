"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import Modal from "@/app/_components/Modal/Modal";
import styles from "../mypage.module.scss";

interface AccountSectionProps {
  onDeleteAccount: () => Promise<boolean>;
}

export default function AccountSection({ onDeleteAccount }: AccountSectionProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = async () => {
    const success = await onDeleteAccount();
    if (success) {
      logout();
      router.push("/login");
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>계정</h2>

      <div className={styles.accountActions}>
        <Button variant="secondary" size="md" icon="logout" onClick={handleLogout}>
          로그아웃
        </Button>
        <Button variant="danger" size="md" icon="person_remove" onClick={() => setDeleteModalOpen(true)}>
          회원 탈퇴
        </Button>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className={styles.deleteModal}>
          <div className={styles.deleteModalIcon}>
            <span className="material-symbols-outlined">warning</span>
          </div>
          <h3 className={styles.deleteModalTitle}>회원 탈퇴</h3>
          <p className={styles.deleteModalDesc}>
            정말 탈퇴하시겠습니까?<br />
            모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <div className={styles.deleteModalActions}>
            <Button variant="secondary" size="lg" fullWidth onClick={() => setDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="danger" size="lg" fullWidth onClick={handleDelete}>
              탈퇴
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
