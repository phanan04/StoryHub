import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

const jikanApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Simple in-memory cache to avoid rate limits (3 req/sec)
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

async function cachedGet<T>(url: string): Promise<T> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && now - hit.ts < CACHE_TTL) {
    return hit.data as T;
  }
  const { data } = await jikanApi.get<T>(url);
  cache.set(url, { data, ts: now });
  return data;
}

export const JikanService = {
  // Top manga (trending)
  getTopManga: (page = 1) =>
    cachedGet(`/top/manga?page=${page}`),

  // Search manga by query
  searchManga: (q: string, page = 1) =>
    cachedGet(`/manga?q=${encodeURIComponent(q)}&page=${page}&sfw=true`),

  // Manga detail by MAL id
  getMangaById: (id: string) =>
    cachedGet(`/manga/${id}/full`),

  // Manga by genre id
  getMangaByGenre: (genreId: number, page = 1) =>
    cachedGet(
      `/manga?genres=${genreId}&page=${page}&order_by=score&sort=desc&sfw=true`
    ),

  // Latest manga
  getLatestManga: (page = 1) =>
    cachedGet(
      `/manga?order_by=start_date&sort=desc&page=${page}&sfw=true`
    ),

  // All genres list
  getMangaGenres: () => cachedGet(`/genres/manga`),
};

export const GENRE_IDS: Record<string, number> = {
  action: 1,
  adventure: 2,
  comedy: 4,
  drama: 8,
  fantasy: 10,
  horror: 14,
  mystery: 7,
  romance: 22,
  scifi: 24,
  shounen: 27,
  shoujo: 25,
  thriller: 41,
  sports: 30,
  sliceoflife: 36,
};
