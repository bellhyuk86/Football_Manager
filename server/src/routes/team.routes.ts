import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as teamController from "../controllers/team.controller";

const router = Router();

router.get("/me", authenticate, teamController.getMyTeam);
router.patch("/me", authenticate, authorize("manager"), teamController.updateMyTeam);
router.get("/me/invite-code", authenticate, authorize("manager"), teamController.getInviteCode);
router.patch("/me/invite-code", authenticate, authorize("manager"), teamController.regenerateInviteCode);
router.post("/verify-invite-code", teamController.verifyInviteCode);

export default router;
