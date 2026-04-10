"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { DrawingStroke } from "@/types";
import styles from "../editor.module.scss";

interface DrawingCanvasProps {
  strokes: DrawingStroke[];
  onStrokesChange: (strokes: DrawingStroke[]) => void;
  active: boolean;
}

const COLORS = ["#68DBAE", "#FF6B6B", "#FFD93D", "#6BC5F7", "#FFFFFF"];

export default function DrawingCanvas({
  strokes,
  onStrokesChange,
  active,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const currentPoints = useRef<{ x: number; y: number }[]>([]);
  const [color, setColor] = useState(COLORS[0]);

  const getRelativePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    },
    []
  );

  const redraw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const stroke of strokes) {
        if (stroke.points.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const first = stroke.points[0];
        ctx.moveTo((first.x / 100) * width, (first.y / 100) * height);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = stroke.points[i];
          ctx.lineTo((pt.x / 100) * width, (pt.y / 100) * height);
        }
        ctx.stroke();

        if (stroke.type === "arrow" && stroke.points.length >= 2) {
          const last = stroke.points[stroke.points.length - 1];
          const prev = stroke.points[stroke.points.length - 2];
          const lx = (last.x / 100) * width;
          const ly = (last.y / 100) * height;
          const px = (prev.x / 100) * width;
          const py = (prev.y / 100) * height;
          const angle = Math.atan2(ly - py, lx - px);
          const headLen = 12;

          ctx.beginPath();
          ctx.fillStyle = stroke.color;
          ctx.moveTo(lx, ly);
          ctx.lineTo(
            lx - headLen * Math.cos(angle - Math.PI / 6),
            ly - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            lx - headLen * Math.cos(angle + Math.PI / 6),
            ly - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }
      }
    },
    [strokes]
  );

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const observer = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) redraw(ctx, width, height);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [redraw]);

  // Redraw when strokes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) redraw(ctx, canvas.width, canvas.height);
  }, [strokes, redraw]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!active) return;
      isDrawing.current = true;
      currentPoints.current = [getRelativePos(e)];
    },
    [active, getRelativePos]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!active || !isDrawing.current) return;
      const pos = getRelativePos(e);
      currentPoints.current.push(pos);

      // Live preview
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      redraw(ctx, canvas.width, canvas.height);

      const pts = currentPoints.current;
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(
        (pts[0].x / 100) * canvas.width,
        (pts[0].y / 100) * canvas.height
      );
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(
          (pts[i].x / 100) * canvas.width,
          (pts[i].y / 100) * canvas.height
        );
      }
      ctx.stroke();
    },
    [active, getRelativePos, color, redraw]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const pts = currentPoints.current;
    if (pts.length < 2) return;

    const newStroke: DrawingStroke = {
      type: "line",
      points: pts,
      color,
    };
    onStrokesChange([...strokes, newStroke]);
    currentPoints.current = [];
  }, [color, strokes, onStrokesChange]);

  const handleUndo = useCallback(() => {
    if (strokes.length === 0) return;
    onStrokesChange(strokes.slice(0, -1));
  }, [strokes, onStrokesChange]);

  const handleClear = useCallback(() => {
    if (strokes.length === 0) return;
    onStrokesChange([]);
  }, [strokes, onStrokesChange]);

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.drawingContainer} ${active ? styles.drawingContainerActive : ""}`}
      >
        <canvas
          ref={canvasRef}
          className={styles.drawingCanvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {active && (
        <div className={styles.drawingToolbar}>
          <div className={styles.drawingColors}>
            {COLORS.map((c) => (
              <button
                key={c}
                className={`${styles.drawingColorBtn} ${c === color ? styles.drawingColorBtnActive : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className={styles.drawingActions}>
            <button
              className={styles.drawingActionBtn}
              onClick={handleUndo}
              disabled={strokes.length === 0}
              title="되돌리기"
            >
              <span className="material-symbols-outlined">undo</span>
            </button>
            <button
              className={styles.drawingActionBtn}
              onClick={handleClear}
              disabled={strokes.length === 0}
              title="전체 지우기"
            >
              <span className="material-symbols-outlined">delete_sweep</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
