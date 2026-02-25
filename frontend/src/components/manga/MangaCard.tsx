"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { Manga } from "@/types/manga.types";
import { cn, formatScore, getImageUrl } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga;
  className?: string;
  priority?: boolean;  // true for above-fold cards
}

export default function MangaCard({ manga, className, priority = false }: MangaCardProps) {
  const router = useRouter();
  const imageUrl = getImageUrl(manga.images);
  const title = manga.title_english || manga.title;
  const genres = manga.genres?.slice(0, 2) ?? [];

  // Prefetch detail page on hover for instant navigation
  const handleMouseEnter = () => {
    router.prefetch(`/manga/${manga.mal_id}`);
  };

  return (
    <Link href={`/manga/${manga.mal_id}`} className={cn("group block", className)} onMouseEnter={handleMouseEnter}>
      {/* Cover image */}
      <div
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface-3)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />

        {/* Rank badge */}
        {manga.rank && manga.rank <= 50 && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-extrabold text-white rounded-full"
            style={{ background: "var(--accent)" }}
          >
            #{manga.rank}
          </div>
        )}

        {/* Hover overlay — Dribbble style */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-end p-3"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold text-white px-3 py-1.5 rounded-full backdrop-blur-sm transition"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              View
            </span>
            <span
              className="flex items-center gap-1 text-white text-xs font-medium"
            >
              <Heart className="w-3.5 h-3.5" />
              {manga.favorites
                ? manga.favorites >= 1000
                  ? `${(manga.favorites / 1000).toFixed(1)}k`
                  : manga.favorites
                : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Info below image */}
      <div className="mt-2.5 px-0.5 space-y-1">
        {/* Title */}
        <h3
          className="text-sm font-semibold line-clamp-1 leading-snug transition-colors duration-150 group-hover:text-[#ea4c89]"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>

        {/* Genre + Score row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-hidden flex-1 min-w-0">
            {genres.map((g) => (
              <span
                key={g.mal_id}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap truncate"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--surface-3)",
                }}
              >
                {g.name}
              </span>
            ))}
          </div>
          <span
            className="flex items-center gap-0.5 text-[11px] font-bold shrink-0 ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {formatScore(manga.score)}
          </span>
        </div>
      </div>
    </Link>
  );
}
