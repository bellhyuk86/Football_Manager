"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Schedule, ScheduleDetail, SchedulePayload } from "@/types";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/schedules");
      setSchedules(data);
    } catch {
      toast.error("스케줄 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const fetchScheduleDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/schedules/${id}`);
      setSelectedSchedule(data);
    } catch {
      toast.error("스케줄 상세를 불러올 수 없습니다.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const createSchedule = useCallback(
    async (payload: SchedulePayload) => {
      try {
        await api.post("/schedules", payload);
        toast.success("스케줄이 등록되었습니다.");
        await fetchSchedules();
        return true;
      } catch {
        toast.error("스케줄 등록에 실패했습니다.");
        return false;
      }
    },
    [fetchSchedules]
  );

  const updateSchedule = useCallback(
    async (id: string, payload: SchedulePayload) => {
      try {
        await api.patch(`/schedules/${id}`, payload);
        toast.success("스케줄이 수정되었습니다.");
        await fetchSchedules();
        if (selectedSchedule?.id === id) {
          await fetchScheduleDetail(id);
        }
        return true;
      } catch {
        toast.error("스케줄 수정에 실패했습니다.");
        return false;
      }
    },
    [fetchSchedules, fetchScheduleDetail, selectedSchedule?.id]
  );

  const deleteSchedule = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/schedules/${id}`);
        toast.success("스케줄이 삭제되었습니다.");
        if (selectedSchedule?.id === id) {
          setSelectedSchedule(null);
        }
        await fetchSchedules();
        return true;
      } catch {
        toast.error("스케줄 삭제에 실패했습니다.");
        return false;
      }
    },
    [fetchSchedules, selectedSchedule?.id]
  );

  // Get schedules grouped by date string (YYYY-MM-DD)
  const schedulesByDate = schedules.reduce<Record<string, Schedule[]>>(
    (acc, schedule) => {
      const date = schedule.matchDate.split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(schedule);
      return acc;
    },
    {}
  );

  return {
    schedules,
    schedulesByDate,
    loading,
    selectedSchedule,
    detailLoading,
    fetchScheduleDetail,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    clearSelection: () => setSelectedSchedule(null),
  };
}
