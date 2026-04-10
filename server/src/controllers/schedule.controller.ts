import { Request, Response } from "express";
import prisma from "../lib/prisma";

// GET /api/schedules
export async function getSchedules(req: Request, res: Response): Promise<void> {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { teamId: req.user!.teamId! },
      include: {
        creator: { select: { id: true, name: true } },
      },
      orderBy: { matchDate: "desc" },
    });

    res.json(schedules);
  } catch (error) {
    console.error("Get schedules error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// POST /api/schedules
export async function createSchedule(req: Request, res: Response): Promise<void> {
  try {
    const { title, matchDate, matchTime, location, note } = req.body;

    const schedule = await prisma.schedule.create({
      data: {
        teamId: req.user!.teamId!,
        createdBy: req.user!.userId,
        title,
        matchDate: new Date(matchDate),
        matchTime: matchTime ? new Date(`1970-01-01T${matchTime}`) : null,
        location: location || null,
        note: note || null,
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error("Create schedule error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// GET /api/schedules/:id
export async function getSchedule(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const schedule = await prisma.schedule.findFirst({
      where: { id, teamId: req.user!.teamId! },
      include: {
        creator: { select: { id: true, name: true } },
      },
    });

    if (!schedule) {
      res.status(404).json({ error: "스케줄을 찾을 수 없습니다." });
      return;
    }

    const formations = await prisma.formation.findMany({
      where: {
        teamId: req.user!.teamId!,
        matchDate: schedule.matchDate,
      },
      select: { id: true, title: true },
    });

    res.json({ ...schedule, formations });
  } catch (error) {
    console.error("Get schedule error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// PATCH /api/schedules/:id
export async function updateSchedule(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.schedule.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "스케줄을 찾을 수 없습니다." });
      return;
    }

    const { title, matchDate, matchTime, location, note } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(matchDate !== undefined && { matchDate: new Date(matchDate) }),
        ...(matchTime !== undefined && {
          matchTime: matchTime ? new Date(`1970-01-01T${matchTime}`) : null,
        }),
        ...(location !== undefined && { location }),
        ...(note !== undefined && { note }),
      },
    });

    res.json(schedule);
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}

// DELETE /api/schedules/:id
export async function deleteSchedule(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const existing = await prisma.schedule.findFirst({
      where: { id, teamId: req.user!.teamId! },
    });

    if (!existing) {
      res.status(404).json({ error: "스케줄을 찾을 수 없습니다." });
      return;
    }

    await prisma.schedule.delete({ where: { id } });

    res.json({ message: "스케줄이 삭제되었습니다." });
  } catch (error) {
    console.error("Delete schedule error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}
