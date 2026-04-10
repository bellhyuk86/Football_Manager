"use client";

import type { FormationPlayerEntry } from "@/types";
import styles from "../editor.module.scss";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000";

interface SquadPlayerCardProps {
  entry: FormationPlayerEntry;
  onRemove: (playerId: string) => void;
  onSwapType: (playerId: string) => void;
  swapLabel: string;
  readOnly?: boolean;
}

export default function SquadPlayerCard({
  entry,
  onRemove,
  onSwapType,
  swapLabel,
  readOnly = false,
}: SquadPlayerCardProps) {
  return (
    <div className={styles.squadCard}>
      <div className={styles.squadCardAvatar}>
        {entry.player.user?.profileImage ? (
          <img
            src={`${API_BASE}${entry.player.user.profileImage}`}
            alt={entry.player.name}
            className={styles.squadCardAvatarImg}
          />
        ) : (
          <span className="material-symbols-outlined">person</span>
        )}
      </div>
      <div className={styles.squadCardInfo}>
        <span className={styles.squadCardName}>{entry.player.name}</span>
        <span className={styles.squadCardMeta}>{entry.player.position}</span>
      </div>
      {!readOnly && (
        <div className={styles.squadCardActions}>
          <button
            className={styles.squadCardBtn}
            onClick={() => onSwapType(entry.playerId)}
            title={swapLabel}
          >
            <span className="material-symbols-outlined">swap_vert</span>
          </button>
          <button
            className={`${styles.squadCardBtn} ${styles.squadCardBtnDanger}`}
            onClick={() => onRemove(entry.playerId)}
            title="제거"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
