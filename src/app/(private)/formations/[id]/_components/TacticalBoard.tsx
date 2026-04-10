"use client";

import { useRef, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { FormationEditorState } from "../_hooks/useFormationEditor";
import type { DrawingStroke } from "@/types";
import PitchSurface from "./PitchSurface";
import PitchPlayer from "./PitchPlayer";
import EditorToolbar from "./EditorToolbar";
import DrawingCanvas from "./DrawingCanvas";
import styles from "../editor.module.scss";

interface TacticalBoardProps {
  state: FormationEditorState;
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  onToggleDrawing: () => void;
  onDrawingChange: (strokes: DrawingStroke[]) => void;
  readOnly?: boolean;
}

export default function TacticalBoard({
  state,
  onPlayerMove,
  onToggleDrawing,
  onDrawingChange,
  readOnly = false,
}: TacticalBoardProps) {
  const pitchRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (state.drawingMode) return;
      const { active, delta } = event;
      const playerId = active.id as string;
      const pitchEl = pitchRef.current;
      if (!pitchEl) return;

      const rect = pitchEl.getBoundingClientRect();
      const currentPos = state.placements[playerId];
      if (!currentPos) return;

      const deltaXPercent = (delta.x / rect.width) * 100;
      const deltaYPercent = (delta.y / rect.height) * 100;

      onPlayerMove(
        playerId,
        currentPos.x + deltaXPercent,
        currentPos.y + deltaYPercent
      );
    },
    [state.placements, state.drawingMode, onPlayerMove]
  );

  return (
    <div className={styles.boardWrapper}>
      {!readOnly && (
        <EditorToolbar
          drawingMode={state.drawingMode}
          onToggleDrawing={onToggleDrawing}
          pitchRef={pitchRef}
        />
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <PitchSurface pitchRef={pitchRef}>
          {state.starters.map((entry) => {
            const pos = state.placements[entry.playerId];
            if (!pos) return null;
            return (
              <PitchPlayer
                key={entry.playerId}
                id={entry.playerId}
                name={entry.player.name}
                position={entry.player.position}
                x={pos.x}
                y={pos.y}
                disabled={readOnly || state.drawingMode}
              />
            );
          })}

          <DrawingCanvas
            strokes={state.drawing}
            onStrokesChange={onDrawingChange}
            active={state.drawingMode}
          />
        </PitchSurface>
      </DndContext>
    </div>
  );
}
