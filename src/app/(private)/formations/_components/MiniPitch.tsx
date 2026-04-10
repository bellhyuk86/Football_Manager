"use client";

import type { MiniPitchProps } from "../_types";
import styles from "../formations.module.scss";

export default function MiniPitch({ formation }: MiniPitchProps) {
  const players = formation.placementData?.players || [];
  const starters = formation.formationPlayers?.filter((p) => p.type === "starter") || [];

  const getPlayerName = (playerId: string) => {
    const entry = starters.find((s) => s.playerId === playerId);
    return entry?.player?.name || "";
  };

  return (
    <div className={styles.cardPitch}>
      {/* Pitch markings */}
      <div className={styles.cardPitchCenter}>
        <div className={styles.cardPitchCircle} />
      </div>
      <div className={styles.cardPitchLine} />

      {/* Penalty areas */}
      <div className={styles.cardPitchPenaltyTop} />
      <div className={styles.cardPitchPenaltyBottom} />

      {/* Player dots */}
      {players.map((p) => {
        const name = getPlayerName(p.player_id);
        return (
          <div
            key={p.player_id}
            className={styles.cardPitchPlayer}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
          >
            <div className={styles.cardPitchPlayerDot} />
            {name && <span className={styles.cardPitchPlayerName}>{name}</span>}
          </div>
        );
      })}
    </div>
  );
}
