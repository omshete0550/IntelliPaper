import { Router } from "express";
import { createSavedPaper, deleteSavedPaper, listSavedPapers, updateSavedPaper } from "../controllers/library.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSavedPaperSchema, updateSavedPaperSchema } from "../validators/library.validators.js";

const router = Router();
router.use(requireAuth);
router.get("/", listSavedPapers);
router.post("/", validate(createSavedPaperSchema), createSavedPaper);
router.patch("/:id", validate(updateSavedPaperSchema), updateSavedPaper);
router.delete("/:id", deleteSavedPaper);
export default router;
