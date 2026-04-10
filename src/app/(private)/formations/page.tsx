"use client";

import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import { useFormations } from "./_hooks/useFormations";
import FormationCard from "./_components/FormationCard";
import DeleteFormationModal from "./_components/DeleteFormationModal";
import styles from "./formations.module.scss";

export default function FormationsPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const { formations, loading, deleteTarget, setDeleteTarget, handleDelete } =
    useFormations();

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>포메이션</h1>
          <p className={styles.headerDesc}>
            저장된 포메이션 {formations.length}개를 관리하고 있습니다.
          </p>
        </div>
        {canEdit && (
          <Button icon="add" onClick={() => router.push("/formations/new")}>
            새 포메이션
          </Button>
        )}
      </header>

      {/* Content */}
      {loading ? (
        <div className={styles.loadingState}>포메이션 목록을 불러오는 중...</div>
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

      {/* Delete Confirm Modal */}
      <DeleteFormationModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
