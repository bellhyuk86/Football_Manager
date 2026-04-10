"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import { useFormationTemplates } from "../_hooks/useFormationTemplates";
import TemplateFormModal from "./TemplateFormModal";
import DeleteTemplateModal from "./DeleteTemplateModal";
import type { FormationTemplate } from "../_types";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "../formations.module.scss";

export default function FormationTemplatePanel() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const {
    templates,
    loading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useFormationTemplates();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FormationTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FormationTemplate | null>(null);

  const handleSelect = (template: FormationTemplate) => {
    router.push(`/formations/new?templateId=${template.id}`);
  };

  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (template: FormationTemplate) => {
    setEditTarget(template);
    setFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setFormModalOpen(false);
    setEditTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteTemplate(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (loading) {
    return <PageContainer loading />;
  }

  return (
    <>
      <div className={styles.templateGrid}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={styles.templateCard}
            onClick={() => handleSelect(template)}
          >
            <div className={styles.templatePitch}>
              <div className={styles.templatePitchCenter}>
                <div className={styles.templatePitchCircle} />
              </div>
              <div className={styles.templatePitchLine} />
              <div className={styles.templatePitchPenaltyTop} />
              <div className={styles.templatePitchPenaltyBottom} />

              {template.positions.map((pos, i) => (
                <div
                  key={i}
                  className={styles.templateDot}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className={styles.templateDotCircle} />
                  <span className={styles.templateDotLabel}>{pos.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.templateInfo}>
              <h3 className={styles.templateName}>{template.name}</h3>
            </div>

            {canEdit && (
              <div className={styles.templateActions}>
                <button
                  type="button"
                  className={styles.templateActionBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(template);
                  }}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  type="button"
                  className={`${styles.templateActionBtn} ${styles.templateActionBtnDanger}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(template);
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <div className={styles.emptyCard} onClick={handleOpenCreate}>
            <div className={styles.emptyCardIcon}>
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <span className={styles.emptyCardTitle}>새 템플릿 만들기</span>
            <p className={styles.emptyCardDesc}>포지션을 배치하세요</p>
          </div>
        )}
      </div>

      {templates.length === 0 && !canEdit && (
        <div className={styles.emptyState}>저장된 템플릿이 없습니다.</div>
      )}

      <TemplateFormModal
        isOpen={formModalOpen}
        onClose={handleCloseModal}
        editTarget={editTarget}
        onCreate={createTemplate}
        onUpdate={updateTemplate}
      />

      <DeleteTemplateModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
