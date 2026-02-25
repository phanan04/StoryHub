import { Router } from "express";
import { MangaController } from "../controllers/manga.controller";

const router = Router();

// GET /api/manga/trending
router.get("/trending", MangaController.getTrending);

// GET /api/manga/top
router.get("/top", MangaController.getTop);

// GET /api/manga/latest
router.get("/latest", MangaController.getLatest);

// GET /api/manga/search?q=naruto&page=1
router.get("/search", MangaController.search);

// GET /api/manga/category/:genre?page=1
router.get("/category/:genre", MangaController.getByCategory);

// GET /api/manga/:id
router.get("/:id", MangaController.getById);

export default router;
