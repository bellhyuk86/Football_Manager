export interface Schedule {
  id: string;
  title: string;
  matchDate: string;
  matchTime: string | null;
  location: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string };
}

export interface ScheduleDetail extends Schedule {
  formations: { id: string; title: string }[];
}

export interface SchedulePayload {
  title: string;
  matchDate: string;
  matchTime: string | null;
  location: string | null;
  note: string | null;
}
