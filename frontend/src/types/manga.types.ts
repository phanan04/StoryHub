export interface MangaImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp?: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Author {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Manga {
  mal_id: number;
  url: string;
  images: MangaImage;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  publishing: boolean;
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  genres: Genre[];
  authors: Author[];
  published: {
    from: string | null;
    to: string | null;
    string: string;
  };
}

export interface JikanListResponse {
  data: Manga[];
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "trending", label: "Trending", emoji: "🔥" },
  { id: "shounen", label: "Shounen", emoji: "💪" },
  { id: "shoujo", label: "Shoujo", emoji: "💕" },
  { id: "action", label: "Action", emoji: "⚔️" },
  { id: "romance", label: "Romance", emoji: "❤️" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "drama", label: "Drama", emoji: "🎭" },
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "horror", label: "Horror", emoji: "👻" },
  { id: "mystery", label: "Mystery", emoji: "🔍" },
  { id: "scifi", label: "Sci-Fi", emoji: "🤖" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "sliceoflife", label: "Slice of Life", emoji: "🌸" },
];
