"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/_components/Modal/Modal";
import styles from "../register.module.scss";

interface RegisterSuccessModalProps {
  isOpen: boolean;
  inviteCode?: string;
}

export default function RegisterSuccessModal({
  isOpen,
  inviteCode,
}: RegisterSuccessModalProps) {
  const router = useRouter();
  const isManager = !!inviteCode;

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("초대코드가 복사되었습니다.");
    }
  };

  const handleConfirm = () => {
    router.push(isManager ? "/players" : "/");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleConfirm}>
      {/* Icon */}
      <div className={styles.successIcon}>
        <span
          className={`material-symbols-outlined ${styles.successIconInner}`}
        >
          check_circle
        </span>
      </div>

      {isManager ? (
        <>
          <h2 className={styles.successTitle}>Team has been created!</h2>
          <p className={styles.successDesc}>
            구단 생성이 완료되었습니다. 팀원들을 초대하세요.
          </p>

          {/* Invite Code */}
          <div className={styles.inviteCodeBox}>
            <p className={styles.inviteCodeLabel}>Invite Code</p>
            <div className={styles.inviteCodeRow}>
              <span className={styles.inviteCodeValue}>{inviteCode}</span>
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.successTitle}>Welcome!</h2>
          <p className={styles.successDesc}>
            정상 가입되었습니다. 확인을 누르면 홈으로 이동합니다.
          </p>
        </>
      )}

      <button
        type="button"
        className={styles.confirmBtn}
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </Modal>
  );
}
