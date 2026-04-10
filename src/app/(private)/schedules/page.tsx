"use client";

import { useState, useCallback } from "react";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/app/_components/Button/Button";
import { useSchedules } from "./_hooks/useSchedules";
import Calendar from "./_components/Calendar";
import ScheduleDetailPanel from "./_components/ScheduleDetailPanel";
import ScheduleModal from "./_components/ScheduleModal";
import DeleteScheduleModal from "./_components/DeleteScheduleModal";
import type { SchedulePayload } from "@/types";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "./schedules.module.scss";

export default function SchedulesPage() {
  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "manager" || role === "coach";

  const {
    schedulesByDate,
    loading,
    selectedSchedule,
    detailLoading,
    fetchScheduleDetail,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    clearSelection,
  } = useSchedules();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDateClick = useCallback(
    (date: string) => {
      setSelectedDate(date);
      clearSelection();
    },
    [clearSelection]
  );

  const handleScheduleClick = useCallback(
    (id: string) => {
      fetchScheduleDetail(id);
    },
    [fetchScheduleDetail]
  );

  const handleCreate = useCallback(() => {
    setEditMode(false);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback(() => {
    setEditMode(true);
    setModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback(
    async (payload: SchedulePayload) => {
      if (editMode && selectedSchedule) {
        return updateSchedule(selectedSchedule.id, payload);
      }
      return createSchedule(payload);
    },
    [editMode, selectedSchedule, updateSchedule, createSchedule]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedSchedule) return;
    await deleteSchedule(selectedSchedule.id);
    setDeleteModalOpen(false);
  }, [selectedSchedule, deleteSchedule]);

  const schedulesOnDate = selectedDate ? schedulesByDate[selectedDate] || [] : [];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>스케줄</h1>
          <p className={styles.headerDesc}>팀 일정을 관리하세요.</p>
        </div>
        {canEdit && (
          <Button icon="add" onClick={handleCreate}>
            새 스케줄
          </Button>
        )}
      </header>

      {loading ? (
        <PageContainer loading />
      ) : (
        <div className={styles.content}>
          <Calendar
            schedulesByDate={schedulesByDate}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
          <ScheduleDetailPanel
            selectedDate={selectedDate}
            schedulesOnDate={schedulesOnDate}
            selectedSchedule={selectedSchedule}
            detailLoading={detailLoading}
            canEdit={canEdit}
            onScheduleClick={handleScheduleClick}
            onEdit={handleEdit}
            onDelete={() => setDeleteModalOpen(true)}
          />
        </div>
      )}

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialDate={selectedDate || undefined}
        schedule={editMode ? selectedSchedule : null}
      />

      <DeleteScheduleModal
        isOpen={deleteModalOpen}
        title={selectedSchedule?.title || ""}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
