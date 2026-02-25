import MangaCard from "./MangaCard";
import { Manga } from "@/types/manga.types";

interface MangaGridProps {
  mangas: Manga[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
}

function SkeletonCard() {
  return (
    <div>
      <div className="w-full aspect-[3/4] rounded-2xl skeleton" />
      <div className="mt-2.5 space-y-1.5 px-0.5">
        <div className="h-3.5 skeleton rounded w-4/5" />
        <div className="flex justify-between">
          <div className="h-3 skeleton rounded-full w-16" />
          <div className="h-3 skeleton rounded w-8" />
        </div>
      </div>
    </div>
  );
}

export default function MangaGrid({
  mangas,
  isLoading = false,
  isFetchingMore = false,
}: MangaGridProps) {
  // Initial skeleton
  if (isLoading && mangas.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
        {Array(18).fill(0).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!mangas?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          No manga found
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Try a different category or search term
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
      {mangas.map((manga, i) => (
        <MangaCard key={manga.mal_id} manga={manga} priority={i < 6} />
      ))}
      {isFetchingMore &&
        Array(6).fill(0).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
    </div>
  );
}
