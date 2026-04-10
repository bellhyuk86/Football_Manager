"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuthStore from "@/stores/useAuthStore";
import { useFormationEditor } from "./_hooks/useFormationEditor";
import { useFormationAPI } from "./_hooks/useFormationAPI";
import SquadPanel from "./_components/SquadPanel";
import TacticalBoard from "./_components/TacticalBoard";
import EditorBottomBar from "./_components/EditorBottomBar";
import AddPlayerModal from "./_components/AddPlayerModal";
import DiscardModal from "./_components/DiscardModal";
import type { Player, DrawingStroke } from "@/types";
import styles from "./editor.module.scss";

export default function FormationEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const { state, dispatch, buildPayload } = useFormationEditor();
  const { loading: apiLoading, loadFormation, saveFormation } = useFormationAPI();
  const [discardModalOpen, setDiscardModalOpen] = useState(false);

  // Load existing formation
  useEffect(() => {
    if (isNew) return;
    loadFormation(id).then((data) => {
      if (data) {
        dispatch({ type: "LOAD_FORMATION", payload: data });
      }
    });
  }, [id, isNew]);

  const handleSave = useCallback(async () => {
    const payload = buildPayload();
    const success = await saveFormation(payload, isNew ? undefined : id);
    if (success) {
      toast.success(isNew ? "포메이션이 생성되었습니다." : "포메이션이 수정되었습니다.");
      dispatch({ type: "MARK_CLEAN" });
      router.push("/formations");
    }
  }, [buildPayload, saveFormation, isNew, id, router, dispatch]);

  const handleDiscard = useCallback(() => {
    if (state.isDirty) {
      setDiscardModalOpen(true);
      return;
    }
    router.push("/formations");
  }, [state.isDirty, router]);

  const handleConfirmDiscard = useCallback(() => {
    setDiscardModalOpen(false);
    router.push("/formations");
  }, [router]);

  const handleAddPlayers = useCallback(
    (players: Player[], asType: "starter" | "substitute") => {
      dispatch({ type: "ADD_PLAYERS", payload: { players, asType } });
    },
    [dispatch]
  );

  const handlePlayerMove = useCallback(
    (playerId: string, x: number, y: number) => {
      dispatch({ type: "UPDATE_PLACEMENT", payload: { playerId, x, y } });
    },
    [dispatch]
  );

  const excludeIds = [
    ...state.starters.map((s) => s.playerId),
    ...state.substitutes.map((s) => s.playerId),
  ];

  const canSave = state.title.trim() !== "" && state.matchDate !== "";

  return (
    <div className={styles.editor}>
      <div className={styles.editorBody}>
        <SquadPanel
          state={state}
          onTabChange={(tab) => dispatch({ type: "SET_TAB", payload: tab })}
          onOpenAddModal={() => dispatch({ type: "TOGGLE_ADD_MODAL" })}
          onRemovePlayer={(pid) => dispatch({ type: "REMOVE_PLAYER", payload: pid })}
          onMoveToStarters={(pid) => dispatch({ type: "MOVE_TO_STARTERS", payload: pid })}
          onMoveToSubstitutes={(pid) => dispatch({ type: "MOVE_TO_SUBSTITUTES", payload: pid })}
          readOnly={!canEdit}
        />

        <TacticalBoard
          state={state}
          onPlayerMove={handlePlayerMove}
          onToggleDrawing={() => dispatch({ type: "TOGGLE_DRAWING_MODE" })}
          onDrawingChange={(strokes: DrawingStroke[]) =>
            dispatch({ type: "SET_DRAWING", payload: strokes })
          }
          readOnly={!canEdit}
        />
      </div>

      <EditorBottomBar
        title={state.title}
        matchDate={state.matchDate}
        onTitleChange={(v) => dispatch({ type: "SET_TITLE", payload: v })}
        onDateChange={(v) => dispatch({ type: "SET_MATCH_DATE", payload: v })}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isSaving={apiLoading}
        canSave={canSave}
        readOnly={!canEdit}
      />

      <AddPlayerModal
        isOpen={state.addPlayerModalOpen}
        onClose={() => dispatch({ type: "TOGGLE_ADD_MODAL" })}
        onConfirm={handleAddPlayers}
        excludeIds={excludeIds}
      />

      <DiscardModal
        isOpen={discardModalOpen}
        onClose={() => setDiscardModalOpen(false)}
        onConfirm={handleConfirmDiscard}
      />
    </div>
  );
}
