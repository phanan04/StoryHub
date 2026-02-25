import axios from "axios";
import { ApiResponse, JikanListResponse, Manga } from "@/types/manga.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

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
