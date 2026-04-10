export type Position = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: string;
  name: string;
  position: Position;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  ovr: number;
  userId?: string | null;
  profileImage?: string | null;
  createdAt: string;
}

export interface PlayerPayload {
  name: string;
  position: Position;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  userId?: string | null;
}

export interface PlayerFormValues {
  name: string;
  position: Position;
  speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}
