import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";

const router = Router();

// GET /api/genres
router.get("/", GenreController.getAll);

export default router;
