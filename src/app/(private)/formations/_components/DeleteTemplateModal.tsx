"use client";

import Button from "@/app/_components/Button/Button";
import Modal from "@/app/_components/Modal/Modal";
import type { FormationTemplate } from "../_types";
import styles from "../formations.module.scss";

interface DeleteTemplateModalProps {
  target: FormationTemplate | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTemplateModal({
  target,
  onClose,
  onConfirm,
}: DeleteTemplateModalProps) {
  return (
    <Modal isOpen={target !== null} onClose={onClose}>
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalIcon}>
          <span className="material-symbols-outlined">warning</span>
        </div>
        <h3 className={styles.deleteModalTitle}>템플릿 삭제</h3>
        <p className={styles.deleteModalDesc}>
          <strong>{target?.name}</strong> 템플릿을 정말 삭제하시겠습니까?
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
