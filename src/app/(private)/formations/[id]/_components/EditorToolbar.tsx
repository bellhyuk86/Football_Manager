"use client";

import { useCallback } from "react";
import html2canvas from "html2canvas-pro";
import styles from "../editor.module.scss";

interface EditorToolbarProps {
  drawingMode: boolean;
  onToggleDrawing: () => void;
  pitchRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditorToolbar({
  drawingMode,
  onToggleDrawing,
  pitchRef,
}: EditorToolbarProps) {
  const handleCapture = useCallback(async () => {
    const el = pitchRef.current;
    if (!el) return;

    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = `formation_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [pitchRef]);

  return (
    <div className={styles.toolbar}>
      <button
        className={`${styles.toolbarBtn} ${drawingMode ? styles.toolbarBtnActive : ""}`}
        onClick={onToggleDrawing}
        title={drawingMode ? "드로잉 종료" : "드로잉 모드"}
      >
        <span className="material-symbols-outlined">
          {drawingMode ? "draw" : "edit"}
        </span>
        {drawingMode && <span>DRAWING</span>}
      </button>
      <button className={styles.toolbarBtn} onClick={handleCapture} title="캡처">
        <span className="material-symbols-outlined">photo_camera</span>
        <span>CAPTURE</span>
      </button>
    </div>
  );
}
