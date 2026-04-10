"use client";

import type { Formation } from "@/types";
import styles from "../players.module.scss";

interface FormationCardProps {
  formation: Formation;
}

export default function FormationCard({ formation }: FormationCardProps) {
  const formattedDate = new Date(formation.matchDate).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className={styles.formationCard}>
      <div className={styles.formationCardInner}>
        <div className={styles.formationHeader}>
          <div>
            <h3 className={styles.formationTitle}>{formation.title}</h3>
            <div className={styles.formationDate}>
              <span
                className={`material-symbols-outlined ${styles.formationDateIcon}`}
              >
                event
              </span>
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className={styles.formationBadge}>Formation</div>
        </div>

        {/* Pitch Preview */}
        <div className={styles.pitchPreview}>
          <div className={styles.pitchCenter}>
            <div className={styles.pitchCircle} />
            <div className={styles.pitchLine} />
          </div>
        </div>
      </div>
      <div className={styles.formationAccent} />
    </div>
  );
}
