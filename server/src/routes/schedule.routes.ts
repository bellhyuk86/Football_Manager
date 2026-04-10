import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as scheduleController from "../controllers/schedule.controller";

const router = Router();

router.get("/", authenticate, scheduleController.getSchedules);
router.post("/", authenticate, authorize("manager", "coach"), scheduleController.createSchedule);
router.get("/:id", authenticate, scheduleController.getSchedule);
router.patch("/:id", authenticate, authorize("manager", "coach"), scheduleController.updateSchedule);
router.delete("/:id", authenticate, authorize("manager", "coach"), scheduleController.deleteSchedule);

export default router;
