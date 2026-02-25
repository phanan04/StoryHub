import axios from "axios";

const BASE_URL = "https://api.mangahook.com/api";

const mangahookApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 1000 * 60 * 10;

async function cachedGet<T>(url: string): Promise<T> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && now - hit.ts < CACHE_TTL) return hit.data as T;
  const { data } = await mangahookApi.get<T>(url);
  cache.set(url, { data, ts: now });
  return data;
}

export const MangaHookService = {
  getMangaList: (page = 1) => cachedGet(`/mangalist?page=${page}`),
  getMangaDetail: (id: string) => cachedGet(`/manga/${id}`),
  getChapters: (id: string) => cachedGet(`/manga/${id}/chapters`),
};
