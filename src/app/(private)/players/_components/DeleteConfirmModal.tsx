"use client";

import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import styles from "./DeleteConfirmModal.module.scss";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  playerName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  playerName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined">warning</span>
        </div>
        <h3 className={styles.title}>선수 삭제</h3>
        <p className={styles.desc}>
          <strong>{playerName}</strong> 선수를 정말 삭제하시겠습니까?
          <br />
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" size="lg" fullWidth onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </div>
    </Modal>
  );
}
