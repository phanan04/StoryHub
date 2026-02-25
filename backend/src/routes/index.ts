import { Router } from "express";
import mangaRoutes from "./manga.routes";
import genreRoutes from "./genre.routes";

const router = Router();

router.use("/manga", mangaRoutes);
router.use("/genres", genreRoutes);

export default router;
