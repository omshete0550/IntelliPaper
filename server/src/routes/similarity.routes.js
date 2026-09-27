import { Router } from "express";
import { check, get, list, remove, updateMatch } from "../controllers/similarity.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { matchExclusionSchema, similarityCheckSchema } from "../validators/similarity.validators.js";

const router = Router();

router.post("/check", requireAuth, validate(similarityCheckSchema), check);
router.get("/reports", requireAuth, list);
router.get("/reports/:id", requireAuth, get);
router.patch("/reports/:id/matches/:matchId", requireAuth, validate(matchExclusionSchema), updateMatch);
router.delete("/reports/:id", requireAuth, remove);

export default router;
