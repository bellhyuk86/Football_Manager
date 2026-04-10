"use client";

import type { Player, Position } from "@/types";
import useAuthStore from "@/stores/useAuthStore";
import RadarChart from "./RadarChart";
import styles from "../players.module.scss";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:4000";

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
}

const POSITION_STYLE: Record<Position, string> = {
  FW: styles.positionFW,
  MF: styles.positionMF,
  DF: styles.positionDF,
  GK: styles.positionGK,
};

const STAT_LABELS: { key: keyof Player; label: string }[] = [
  { key: "speed", label: "SPD" },
  { key: "shooting", label: "SHO" },
  { key: "passing", label: "PAS" },
  { key: "dribbling", label: "DRI" },
  { key: "defending", label: "DEF" },
  { key: "physical", label: "PHY" },
];

export default function PlayerCard({
  player,
  onEdit,
  onDelete,
}: PlayerCardProps) {
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";
console.log(player.profileImage)
  return (
    <div className={styles.playerCard}>
      {/* Edit/Delete (hover) */}
      {canEdit && (
        <div className={styles.cardActions}>
          <button
            className={styles.cardActionBtn}
            onClick={() => onEdit(player)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
              edit
            </span>
          </button>
          <button
            className={`${styles.cardActionBtn} ${styles.cardActionBtnDanger}`}
            onClick={() => onDelete(player)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
              delete
            </span>
          </button>
        </div>
      )}

      {/* Top: Avatar + Name/Position */}
      <div className={styles.cardTop}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {player.profileImage ? (
              <img
                src={`${API_BASE}${player.profileImage}`}
                alt={player.name}
                className={styles.avatarImg}
              />
            ) : (
              <span className="material-symbols-outlined">person</span>
            )}
          </div>
          <span
            className={`${styles.positionBadge} ${POSITION_STYLE[player.position]}`}
          >
            {player.position}
          </span>
        </div>

        <div className={styles.cardInfo}>
          <h3 className={styles.playerName}>{player.name}</h3>
          <p className={styles.playerMeta}>{player.position}</p>
        </div>
      </div>

      {/* Radar Chart (centered) */}
      <div className={styles.abilitySection}>
        <div className={styles.radarWrapper}>
          <RadarChart
            values={[
              player.speed,
              player.shooting,
              player.passing,
              player.dribbling,
              player.defending,
              player.physical,
            ]}
            size={160}
          />
        </div>

        {/* OVR + Stats Grid */}
        <div className={styles.statsBlock}>
          <div className={styles.ovrBadge}>
            <span className={styles.ovrLabel}>OVR</span>
            <span className={styles.ovrValue}>{player.ovr}</span>
          </div>
          <div className={styles.abilityGrid}>
            {STAT_LABELS.map((stat) => (
              <div key={stat.key} className={styles.abilityItem}>
                <span className={styles.abilityLabel}>{stat.label}</span>
                <span className={styles.abilityValue}>
                  {player[stat.key] as number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
