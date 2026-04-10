import { Router } from "express";
import authRoutes from "./auth.routes";
import teamRoutes from "./team.routes";
import userRoutes from "./user.routes";
import playerRoutes from "./player.routes";
import formationRoutes from "./formation.routes";
import scheduleRoutes from "./schedule.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);
router.use("/players", playerRoutes);
router.use("/formations", formationRoutes);
router.use("/schedules", scheduleRoutes);

export default router;
