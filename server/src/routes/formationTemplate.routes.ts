import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import * as templateController from "../controllers/formationTemplate.controller";

const router = Router();

router.get("/", authenticate, templateController.getTemplates);
router.get("/:id", authenticate, templateController.getTemplate);
router.post("/", authenticate, authorize("manager", "coach"), templateController.createTemplate);
router.patch("/:id", authenticate, authorize("manager", "coach"), templateController.updateTemplate);
router.delete("/:id", authenticate, authorize("manager", "coach"), templateController.deleteTemplate);

export default router;
