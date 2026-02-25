import MangaCard from "./MangaCard";
import { Manga } from "@/types/manga.types";

interface MangaGridProps {
  mangas: Manga[];
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[3/4] rounded-xl bg-gray-200" />
      <div className="mt-3 space-y-2 px-0.5">
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded-full w-16" />
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

export default function MangaGrid({ mangas, isLoading = false }: MangaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array(18)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  if (!mangas?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <span className="text-6xl mb-4">📚</span>
        <p className="text-lg font-semibold text-[#0d0c22]">No manga found</p>
        <p className="text-sm text-[#6e6d7a] mt-1">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {mangas.map((manga) => (
        <MangaCard key={manga.mal_id} manga={manga} />
      ))}
    </div>
  );
}
