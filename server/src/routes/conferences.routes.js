import { Router } from "express";
import { createBookmark, deleteBookmark, listBookmarks, listEvents, syncEvents } from "../controllers/conferences.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createConferenceBookmarkSchema } from "../validators/conference.validators.js";

const router = Router();
router.use(requireAuth);
router.get("/events", listEvents);
router.post("/sync", syncEvents);
router.get("/", listBookmarks);
router.post("/", validate(createConferenceBookmarkSchema), createBookmark);
router.delete("/:id", deleteBookmark);
export default router;
