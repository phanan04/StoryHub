import { Request, Response } from "express";
import { JikanService, GENRE_IDS } from "../services/jikan.service";
import { MangaHookService } from "../services/mangahook.service";

export const MangaController = {
  // GET /api/manga/trending
  getTrending: async (_req: Request, res: Response) => {
    try {
      const data = await JikanService.getTopManga(1);
      res.json({ success: true, data });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch trending manga" });
    }
  },

  // GET /api/manga/top?page=1
  getTop: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const data = await JikanService.getTopManga(page);
      res.json({ success: true, data });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch top manga" });
    }
  },

  // GET /api/manga/latest?page=1
  getLatest: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const data = await JikanService.getLatestManga(page);
      res.json({ success: true, data });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch latest manga" });
    }
  },

  // GET /api/manga/search?q=naruto&page=1
  search: async (req: Request, res: Response) => {
    try {
      const q = String(req.query.q || "");
      const page = Number(req.query.page) || 1;
      if (!q) return res.status(400).json({ success: false, message: "Query param 'q' is required" });
      const data = await JikanService.searchManga(q, page);
      res.json({ success: true, data });
    } catch {
      res.status(500).json({ success: false, message: "Search failed" });
    }
  },

  // GET /api/manga/:id
  getById: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const [jikanResult, hookResult] = await Promise.allSettled([
        JikanService.getMangaById(id),
        MangaHookService.getMangaDetail(id),
      ]);
      res.json({
        success: true,
        data: {
          jikan: jikanResult.status === "fulfilled" ? jikanResult.value : null,
          hook: hookResult.status === "fulfilled" ? hookResult.value : null,
        },
      });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch manga detail" });
    }
  },

  // GET /api/manga/category/:genre?page=1
  getByCategory: async (req: Request, res: Response) => {
    try {
      const genre = String(req.params.genre);
      const page = Number(req.query.page) || 1;
      const genreId = GENRE_IDS[genre.toLowerCase().replace(/\s/g, "")];
      if (!genreId) {
        return res.status(400).json({
          success: false,
          message: `Invalid genre. Valid genres: ${Object.keys(GENRE_IDS).join(", ")}`,
        });
      }
      const data = await JikanService.getMangaByGenre(genreId, page);
      res.json({ success: true, data });
    } catch {
      res.status(500).json({ success: false, message: "Failed to fetch manga by category" });
    }
  },
};
