"use client";

import { useDraggable } from "@dnd-kit/core";
import styles from "../editor.module.scss";

interface PitchPlayerProps {
  id: string;
  name: string;
  position: string;
  x: number;
  y: number;
  disabled?: boolean;
}

export default function PitchPlayer({
  id,
  name,
  position,
  x,
  y,
  disabled = false,
}: PitchPlayerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled });

  const style: React.CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    transform: transform
      ? `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px))`
      : "translate(-50%, -50%)",
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    cursor: disabled ? "default" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      className={styles.pitchPlayer}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className={styles.pitchPlayerAvatar}>
        <span className="material-symbols-outlined">person</span>
      </div>
      <span className={styles.pitchPlayerName}>
        {name} <span className={styles.pitchPlayerPosition}>{position}</span>
      </span>
    </div>
  );
}
