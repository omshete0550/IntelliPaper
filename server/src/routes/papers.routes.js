import { Router } from "express";
import { journals, search } from "../controllers/papers.controller.js";

const router = Router();
router.get("/search", search);
router.get("/journals", journals);
export default router;
