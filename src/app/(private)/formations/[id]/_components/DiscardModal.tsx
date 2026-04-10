"use client";

import Button from "@/app/_components/Button/Button";
import Modal from "@/app/_components/Modal/Modal";
import styles from "../editor.module.scss";

interface DiscardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiscardModal({ isOpen, onClose, onConfirm }: DiscardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.discardModal}>
        <div className={styles.discardModalIcon}>
          <span className="material-symbols-outlined">warning</span>
        </div>
        <h3 className={styles.discardModalTitle}>변경사항 폐기</h3>
        <p className={styles.discardModalDesc}>
          저장되지 않은 변경사항이 있습니다. 정말 폐기하시겠습니까?
        </p>
        <div className={styles.discardModalActions}>
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" size="lg" fullWidth onClick={onConfirm}>
            폐기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
