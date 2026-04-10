"use client";

import Modal from "@/app/_components/Modal/Modal";
import Button from "@/app/_components/Button/Button";
import styles from "../schedules.module.scss";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteScheduleModal({
  isOpen,
  title,
  onClose,
  onConfirm,
}: DeleteScheduleModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalIcon}>
          <span className="material-symbols-outlined">warning</span>
        </div>
        <h3 className={styles.deleteModalTitle}>스케줄 삭제</h3>
        <p className={styles.deleteModalDesc}>
          <strong>{title}</strong> 일정을 정말 삭제하시겠습니까?
        </p>
        <div className={styles.deleteModalActions}>
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
