import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { profileSchema } from "../validators/profile.validators.js";

const router = Router();
router.use(requireAuth);
router.get("/", getProfile);
router.put("/", validate(profileSchema), updateProfile);
export default router;
