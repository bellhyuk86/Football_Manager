"use client";

import type { ReactNode } from "react";
import styles from "../editor.module.scss";

interface PitchSurfaceProps {
  children: ReactNode;
  pitchRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PitchSurface({ children, pitchRef }: PitchSurfaceProps) {
  return (
    <div className={styles.pitch} ref={pitchRef}>
      {/* Field markings via CSS */}
      <div className={styles.pitchHalfLine} />
      <div className={styles.pitchCenterCircle} />
      <div className={styles.pitchCenterDot} />
      <div className={styles.pitchPenaltyTop} />
      <div className={styles.pitchPenaltyBottom} />
      <div className={styles.pitchGoalTop} />
      <div className={styles.pitchGoalBottom} />

      {/* Players */}
      {children}
    </div>
  );
}
