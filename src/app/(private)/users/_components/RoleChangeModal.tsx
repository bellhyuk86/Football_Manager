"use client";

import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import styles from "../users.module.scss";

const ROLE_LABEL: Record<string, string> = {
  manager: "감독",
  coach: "코치",
  player: "선수",
};

interface RoleChangeModalProps {
  isOpen: boolean;
  memberName: string;
  newRole: "manager" | "coach" | "player";
  isManagerTransfer: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RoleChangeModal({
  isOpen,
  memberName,
  newRole,
  isManagerTransfer,
  onClose,
  onConfirm,
}: RoleChangeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.roleModal}>
        <div className={styles.roleModalIcon}>
          <span className="material-symbols-outlined">
            {isManagerTransfer ? "swap_horiz" : "manage_accounts"}
          </span>
        </div>
        <h3 className={styles.roleModalTitle}>
          {isManagerTransfer ? "감독 권한 이양" : "권한 변경"}
        </h3>
        <p className={styles.roleModalDesc}>
          {isManagerTransfer ? (
            <>
              <strong>{memberName}</strong>에게 감독 권한을 이양하시겠습니까?
              <br />
              <span className={styles.roleModalWarn}>
                현재 감독은 코치로 자동 변경됩니다.
              </span>
            </>
          ) : (
            <>
              <strong>{memberName}</strong>의 권한을{" "}
              <strong>{ROLE_LABEL[newRole]}</strong>(으)로 변경하시겠습니까?
            </>
          )}
        </p>
        <div className={styles.roleModalActions}>
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button size="lg" fullWidth onClick={onConfirm}>
            {isManagerTransfer ? "이양" : "변경"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
