import axios from "axios";
import { ApiResponse, JikanListResponse, Manga } from "@/types/manga.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

/* ─── Response interceptor: normalise errors ─── */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "unknown";

    if (status === 429) {
      console.warn(`[StoryHub] Rate limited on ${url}. Retry after a moment.`);
    } else if (status >= 500) {
      console.error(`[StoryHub] Server error ${status} on ${url}`);
    } else if (!status) {
      console.error(`[StoryHub] Network error on ${url}:`, error.message);
    }

    return Promise.reject(error);
  }
);

export const MangaAPI = {
  getTrending: async (): Promise<JikanListResponse> => {
    const { data } = await api.get<ApiResponse<JikanListResponse>>("/manga/trending");
    return data.data;
  },

  getTop: async (page = 1): Promise<JikanListResponse> => {
    const { data } = await api.get<ApiResponse<JikanListResponse>>(`/manga/top?page=${page}`);
    return data.data;
  },

  getLatest: async (page = 1): Promise<JikanListResponse> => {
    const { data } = await api.get<ApiResponse<JikanListResponse>>(`/manga/latest?page=${page}`);
    return data.data;
  },

  search: async (q: string, page = 1): Promise<JikanListResponse> => {
    const { data } = await api.get<ApiResponse<JikanListResponse>>(
      `/manga/search?q=${encodeURIComponent(q)}&page=${page}`
    );
    return data.data;
  },

  getById: async (id: string): Promise<{ jikan: { data: Manga } | null; hook: unknown }> => {
    const { data } = await api.get(`/manga/${id}`);
    return data.data;
  },

  getByCategory: async (genre: string, page = 1): Promise<JikanListResponse> => {
    const { data } = await api.get<ApiResponse<JikanListResponse>>(
      `/manga/category/${genre}?page=${page}`
    );
    return data.data;
  },
};
