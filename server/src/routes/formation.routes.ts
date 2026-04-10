import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as formationController from "../controllers/formation.controller";

const router = Router();

router.get("/", authenticate, formationController.getFormations);
router.post("/", authenticate, authorize("manager", "coach"), formationController.createFormation);
router.get("/:id", authenticate, formationController.getFormation);
router.patch("/:id", authenticate, authorize("manager", "coach"), formationController.updateFormation);
router.delete("/:id", authenticate, authorize("manager", "coach"), formationController.deleteFormation);

export default router;
