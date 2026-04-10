"use client";

import type { Player } from "@/types";
import RadarChart from "@/app/(private)/players/_components/RadarChart";
import styles from "../mypage.module.scss";

interface PlayerInfoSectionProps {
  player: Player;
}

export default function PlayerInfoSection({ player }: PlayerInfoSectionProps) {
  const stats = [
    { label: "속도", value: player.speed },
    { label: "슛", value: player.shooting },
    { label: "패스", value: player.passing },
    { label: "드리블", value: player.dribbling },
    { label: "수비", value: player.defending },
    { label: "체력", value: player.physical },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>나의 스쿼드 정보</h2>

      <div className={styles.playerCard}>
        <div className={styles.playerHeader}>
          <div>
            <h3 className={styles.playerName}>{player.name}</h3>
            <span className={styles.playerPosition}>{player.position}</span>
          </div>
          <span className={styles.playerOvr}>{player.ovr}</span>
        </div>

        <div className={styles.playerBody}>
          <div className={styles.playerChart}>
            <RadarChart
              values={[
                player.speed,
                player.shooting,
                player.passing,
                player.dribbling,
                player.defending,
                player.physical,
              ]}
              size={140}
            />
          </div>

          <div className={styles.playerStats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.playerStat}>
                <span className={styles.playerStatLabel}>{s.label}</span>
                <div className={styles.playerStatBar}>
                  <div
                    className={styles.playerStatFill}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
                <span className={styles.playerStatValue}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
