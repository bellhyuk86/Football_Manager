import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as playerController from "../controllers/player.controller";

const router = Router();

router.get("/", authenticate, playerController.getPlayers);
router.get("/me", authenticate, playerController.getMyPlayer);
router.post("/", authenticate, authorize("manager", "coach"), playerController.createPlayer);
router.get("/:id", authenticate, playerController.getPlayer);
router.patch("/:id", authenticate, authorize("manager", "coach"), playerController.updatePlayer);
router.delete("/:id", authenticate, authorize("manager", "coach"), playerController.deletePlayer);

export default router;
