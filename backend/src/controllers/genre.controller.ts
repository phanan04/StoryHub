import { Request, Response } from "express";
import { JikanService, GENRE_IDS } from "../services/jikan.service";

export const GenreController = {
  // GET /api/genres
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await JikanService.getMangaGenres();
      res.json({ success: true, data, local: GENRE_IDS });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch genres" });
    }
  },
};
