"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, Star } from "lucide-react";
import { Manga } from "@/types/manga.types";
import { cn, formatScore, getImageUrl } from "@/lib/utils";

interface MangaCardProps {
  manga: Manga;
  className?: string;
}

export default function MangaCard({ manga, className }: MangaCardProps) {
  const imageUrl = getImageUrl(manga.images);
  const title = manga.title_english || manga.title;

  return (
    <Link href={`/manga/${manga.mal_id}`} className={cn("group block", className)}>
      {/* Image container - Dribbble style */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[3/4]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0d0c22]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          {/* Top: rank + bookmark */}
          <div className="flex items-start justify-between">
            {manga.rank && (
              <span className="text-xs font-bold text-white bg-[#ea4c89] px-2 py-0.5 rounded-full">
                #{manga.rank}
              </span>
            )}
            <button
              onClick={(e) => e.preventDefault()}
              className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition text-white"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom: view + like */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
              View
            </span>
            <button
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1 text-white/80 hover:text-[#ea4c89] transition"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs">{manga.favorites?.toLocaleString() ?? 0}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Below image — Dribbble style info */}
      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-semibold text-[#0d0c22] line-clamp-1 leading-snug group-hover:text-[#ea4c89] transition">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          {/* Genres as small pills */}
          <div className="flex gap-1 overflow-hidden">
            {manga.genres?.slice(0, 2).map((g) => (
              <span
                key={g.mal_id}
                className="text-xs text-[#6e6d7a] bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap"
              >
                {g.name}
              </span>
            ))}
          </div>
          {/* Score */}
          <span className="flex items-center gap-0.5 text-xs font-semibold text-[#6e6d7a] shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {formatScore(manga.score)}
          </span>
        </div>
      </div>
    </Link>
  );
}
