import { useReducer, useCallback } from "react";
import type {
  Player,
  Position,
  FormationDetail,
  FormationPlayerEntry,
  PlacementData,
  FormationPayload,
} from "@/types";

// ─── State ───
export interface FormationEditorState {
  title: string;
  matchDate: string;
  starters: FormationPlayerEntry[];
  substitutes: FormationPlayerEntry[];
  placements: Record<string, { x: number; y: number }>;
  drawing: PlacementData["drawing"];
  activeTab: "squad" | "formation";
  isDirty: boolean;
  addPlayerModalOpen: boolean;
  drawingMode: boolean;
}

const initialState: FormationEditorState = {
  title: "",
  matchDate: "",
  starters: [],
  substitutes: [],
  placements: {},
  drawing: [],
  activeTab: "squad",
  isDirty: false,
  addPlayerModalOpen: false,
  drawingMode: false,
};

// ─── Actions ───
type Action =
  | { type: "LOAD_FORMATION"; payload: FormationDetail }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_MATCH_DATE"; payload: string }
  | { type: "SET_TAB"; payload: "squad" | "formation" }
  | { type: "ADD_PLAYERS"; payload: { players: Player[]; asType: "starter" | "substitute" } }
  | { type: "REMOVE_PLAYER"; payload: string }
  | { type: "MOVE_TO_STARTERS"; payload: string }
  | { type: "MOVE_TO_SUBSTITUTES"; payload: string }
  | { type: "UPDATE_PLACEMENT"; payload: { playerId: string; x: number; y: number } }
  | { type: "TOGGLE_ADD_MODAL" }
  | { type: "TOGGLE_DRAWING_MODE" }
  | { type: "SET_DRAWING"; payload: PlacementData["drawing"] }
  | { type: "DISCARD" }
  | { type: "MARK_CLEAN" };

// ─── Default positions by role ───
function getDefaultPosition(
  position: Position,
  existingCount: number
): { x: number; y: number } {
  const offsets = [0, -20, 20, -10, 10];
  const offset = offsets[existingCount % offsets.length] || 0;

  switch (position) {
    case "GK":
      return { x: 50, y: 90 };
    case "DF":
      return { x: 50 + offset, y: 72 };
    case "MF":
      return { x: 50 + offset, y: 48 };
    case "FW":
      return { x: 50 + offset, y: 25 };
  }
}

// ─── Reducer ───
function reducer(state: FormationEditorState, action: Action): FormationEditorState {
  switch (action.type) {
    case "LOAD_FORMATION": {
      const { payload } = action;
      const starters = payload.formationPlayers.filter((fp) => fp.type === "starter");
      const substitutes = payload.formationPlayers.filter((fp) => fp.type === "substitute");
      const placements: Record<string, { x: number; y: number }> = {};
      (payload.placementData?.players || []).forEach((p) => {
        placements[p.player_id] = { x: p.x, y: p.y };
      });
      return {
        ...state,
        title: payload.title,
        matchDate: payload.matchDate.split("T")[0],
        starters,
        substitutes,
        placements,
        drawing: payload.placementData?.drawing || [],
        isDirty: false,
      };
    }

    case "SET_TITLE":
      return { ...state, title: action.payload, isDirty: true };

    case "SET_MATCH_DATE":
      return { ...state, matchDate: action.payload, isDirty: true };

    case "SET_TAB":
      return { ...state, activeTab: action.payload };

    case "ADD_PLAYERS": {
      const { players, asType } = action.payload;
      const newEntries: FormationPlayerEntry[] = players.map((p) => ({
        id: crypto.randomUUID(),
        playerId: p.id,
        type: asType,
        player: { id: p.id, name: p.name, position: p.position },
      }));

      const newPlacements = { ...state.placements };
      if (asType === "starter") {
        const positionCounts: Record<string, number> = {};
        state.starters.forEach((s) => {
          positionCounts[s.player.position] = (positionCounts[s.player.position] || 0) + 1;
        });
        newEntries.forEach((entry) => {
          const count = positionCounts[entry.player.position] || 0;
          newPlacements[entry.playerId] = getDefaultPosition(entry.player.position, count);
          positionCounts[entry.player.position] = count + 1;
        });
      }

      return {
        ...state,
        starters: asType === "starter" ? [...state.starters, ...newEntries] : state.starters,
        substitutes: asType === "substitute" ? [...state.substitutes, ...newEntries] : state.substitutes,
        placements: newPlacements,
        isDirty: true,
      };
    }

    case "REMOVE_PLAYER": {
      const pid = action.payload;
      const newPlacements = { ...state.placements };
      delete newPlacements[pid];
      return {
        ...state,
        starters: state.starters.filter((s) => s.playerId !== pid),
        substitutes: state.substitutes.filter((s) => s.playerId !== pid),
        placements: newPlacements,
        isDirty: true,
      };
    }

    case "MOVE_TO_STARTERS": {
      const pid = action.payload;
      const player = state.substitutes.find((s) => s.playerId === pid);
      if (!player) return state;
      const moved = { ...player, type: "starter" as const };
      const posCount = state.starters.filter(
        (s) => s.player.position === player.player.position
      ).length;
      const newPlacements = { ...state.placements };
      newPlacements[pid] = getDefaultPosition(player.player.position, posCount);
      return {
        ...state,
        substitutes: state.substitutes.filter((s) => s.playerId !== pid),
        starters: [...state.starters, moved],
        placements: newPlacements,
        isDirty: true,
      };
    }

    case "MOVE_TO_SUBSTITUTES": {
      const pid = action.payload;
      const player = state.starters.find((s) => s.playerId === pid);
      if (!player) return state;
      const moved = { ...player, type: "substitute" as const };
      const newPlacements = { ...state.placements };
      delete newPlacements[pid];
      return {
        ...state,
        starters: state.starters.filter((s) => s.playerId !== pid),
        substitutes: [...state.substitutes, moved],
        placements: newPlacements,
        isDirty: true,
      };
    }

    case "UPDATE_PLACEMENT":
      return {
        ...state,
        placements: {
          ...state.placements,
          [action.payload.playerId]: {
            x: Math.max(0, Math.min(100, action.payload.x)),
            y: Math.max(0, Math.min(100, action.payload.y)),
          },
        },
        isDirty: true,
      };

    case "TOGGLE_ADD_MODAL":
      return { ...state, addPlayerModalOpen: !state.addPlayerModalOpen };

    case "TOGGLE_DRAWING_MODE":
      return { ...state, drawingMode: !state.drawingMode };

    case "SET_DRAWING":
      return { ...state, drawing: action.payload, isDirty: true };

    case "DISCARD":
      return { ...initialState };

    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

// ─── Hook ───
export function useFormationEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const buildPayload = useCallback((): FormationPayload => {
    return {
      title: state.title,
      matchDate: state.matchDate,
      placementData: {
        players: Object.entries(state.placements).map(([pid, pos]) => ({
          player_id: pid,
          x: pos.x,
          y: pos.y,
        })),
        drawing: state.drawing,
      },
      players: [
        ...state.starters.map((s) => ({ player_id: s.playerId, type: "starter" as const })),
        ...state.substitutes.map((s) => ({ player_id: s.playerId, type: "substitute" as const })),
      ],
    };
  }, [state]);

  return { state, dispatch, buildPayload };
}
