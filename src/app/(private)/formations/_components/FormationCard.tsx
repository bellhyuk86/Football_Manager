"use client";

import type { FormationCardProps } from "../_types";
import MiniPitch from "./MiniPitch";
import styles from "../formations.module.scss";

export default function FormationCard({
  formation,
  canEdit,
  onClick,
  onEdit,
  onDelete,
}: FormationCardProps) {
  const starterCount =
    formation.formationPlayers?.filter((p) => p.type === "starter").length || 0;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>{formation.title}</h3>
            <div className={styles.cardDate}>
              <span className={`material-symbols-outlined ${styles.cardDateIcon}`}>
                calendar_today
              </span>
              <span>{formation.matchDate?.split("T")[0]}</span>
            </div>
          </div>
          <span className={styles.cardBadge}>{starterCount}명</span>
        </div>

        <MiniPitch formation={formation} />
      </div>

      {canEdit && (
        <div className={styles.cardActions}>
          <button
            className={`${styles.cardActionBtn} ${styles.cardActionBtnDanger}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      )}

      <div className={styles.cardAccent} />
    </div>
  );
}
