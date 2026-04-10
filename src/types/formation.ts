import type { Position } from "./player";

export interface Formation {
  id: string;
  title: string;
  matchDate: string;
  createdAt: string;
}

export interface PlacementPlayer {
  player_id: string;
  x: number;
  y: number;
}

export interface DrawingStroke {
  type: "line" | "arrow" | "text";
  points: { x: number; y: number }[];
  color: string;
  text?: string;
}

export interface PlacementData {
  players: PlacementPlayer[];
  drawing: DrawingStroke[];
}

export interface FormationPlayerEntry {
  id: string;
  playerId: string;
  type: "starter" | "substitute";
  player: {
    id: string;
    name: string;
    position: Position;
    user?: { profileImage: string | null } | null;
  };
}

export interface FormationDetail {
  id: string;
  title: string;
  matchDate: string;
  placementData: PlacementData;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string };
  formationPlayers: FormationPlayerEntry[];
}

export interface FormationPayload {
  title: string;
  matchDate: string;
  placementData: PlacementData;
  players: { player_id: string; type: "starter" | "substitute" }[];
}
