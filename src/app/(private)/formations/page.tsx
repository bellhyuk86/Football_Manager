"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import { useFormations } from "./_hooks/useFormations";
import FormationCard from "./_components/FormationCard";
import FormationTemplatePanel from "./_components/FormationTemplatePanel";
import DeleteFormationModal from "./_components/DeleteFormationModal";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "./formations.module.scss";

export default function FormationsPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const [activeTab, setActiveTab] = useState<"list" | "template">("list");

  const { formations, loading, deleteTarget, setDeleteTarget, handleDelete } =
    useFormations();

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>포메이션</h1>
          <p className={styles.headerDesc}>
            {activeTab === "list"
              ? `저장된 포메이션 ${formations.length}개를 관리하고 있습니다.`
              : "템플릿을 선택하면 기본 배치가 적용된 새 포메이션을 만들 수 있습니다."}
          </p>
        </div>
        {canEdit && activeTab === "list" && (
          <Button icon="add" onClick={() => router.push("/formations/new")}>
            새 포메이션
          </Button>
        )}
      </header>

      {/* Tabs */}
      <div className={styles.pageTabs}>
        <button
          className={`${styles.pageTab} ${activeTab === "list" ? styles.pageTabActive : ""}`}
          onClick={() => setActiveTab("list")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
            view_list
          </span>
          포메이션 목록
        </button>
        <button
          className={`${styles.pageTab} ${activeTab === "template" ? styles.pageTabActive : ""}`}
          onClick={() => setActiveTab("template")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
            dashboard
          </span>
          포메이션 템플릿
        </button>
      </div>

      {/* Content */}
      {activeTab === "list" ? (
        <>
          {loading ? (
            <PageContainer loading />
          ) : formations.length === 0 ? (
            <div className={styles.emptyState}>저장된 포메이션이 없습니다.</div>
          ) : (
            <div className={styles.cardGrid}>
              {formations.map((formation) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  canEdit={canEdit}
                  onClick={() => router.push(`/formations/${formation.id}`)}
                  onEdit={() => router.push(`/formations/${formation.id}`)}
                  onDelete={() => setDeleteTarget(formation)}
                />
              ))}

              {canEdit && (
                <div
                  className={styles.emptyCard}
                  onClick={() => router.push("/formations/new")}
                >
                  <div className={styles.emptyCardIcon}>
                    <span className="material-symbols-outlined">add_circle</span>
                  </div>
                  <span className={styles.emptyCardTitle}>새 포메이션 만들기</span>
                  <p className={styles.emptyCardDesc}>전술을 설계하세요</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <FormationTemplatePanel />
      )}

      {/* Delete Confirm Modal */}
      <DeleteFormationModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
