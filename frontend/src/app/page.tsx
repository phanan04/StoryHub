"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MangaGrid from "@/components/manga/MangaGrid";
import CategoryTabs from "@/components/ui/CategoryTabs";
import { MangaAPI } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

// "trending" is the default/discover state — hero is shown
const DEFAULT_CATEGORY = "trending";

export default function HomePage() {
  const { activeCategory, setActiveCategory } = useStore();
  const [page, setPage] = useState(1);

  // Hero is only visible when on the default/discover state
  const isHeroVisible = activeCategory === DEFAULT_CATEGORY;

  const { data, isLoading } = useQuery({
    queryKey: ["manga", activeCategory, page],
    queryFn: () => {
      if (activeCategory === DEFAULT_CATEGORY) return MangaAPI.getTrending();
      return MangaAPI.getByCategory(activeCategory, page);
    },
  });

  const mangas = data?.data ?? [];
  const hasNext = data?.pagination?.has_next_page ?? false;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setPage(1);
    // Scroll to top smoothly so the category bar is in view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Hero Section ── only shown in Discover / default state ── */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isHeroVisible ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <section className="bg-white border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-6 py-16 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d0c22] leading-tight max-w-3xl mx-auto">
                Discover the World's Best{" "}
                <span className="text-[#ea4c89]">Manga &amp; Manhwa</span>
              </h1>
              <p className="mt-5 text-lg text-[#6e6d7a] max-w-xl mx-auto">
                Explore thousands of stories from the most talented manga artists.
                Find your next favourite series.
              </p>
              {/* Quick-filter pills */}
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                {[
                  { emoji: "⚔️", label: "Action", id: "action" },
                  { emoji: "💕", label: "Romance", id: "romance" },
                  { emoji: "🔥", label: "Trending", id: "trending" },
                  { emoji: "👻", label: "Horror", id: "horror" },
                  { emoji: "😂", label: "Comedy", id: "comedy" },
                ].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleCategoryChange(tag.id)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-[#6e6d7a] hover:border-[#ea4c89] hover:text-[#ea4c89] transition bg-white"
                  >
                    {tag.emoji} {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Category Tabs — sticky below Navbar ── */}
      <CategoryTabs
        active={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* ── Main Content Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0d0c22] capitalize">
              {activeCategory === DEFAULT_CATEGORY ? "🔥 Trending Now" : activeCategory}
            </h2>
            <p className="text-sm text-[#6e6d7a] mt-0.5">
              {mangas.length > 0 ? `${mangas.length} titles` : ""}
            </p>
          </div>
        </div>

        <MangaGrid mangas={mangas} isLoading={isLoading} />

        {/* Pagination */}
        {!isLoading && mangas.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#6e6d7a] hover:border-[#0d0c22] hover:text-[#0d0c22] disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[page - 1, page, page + 1]
              .filter((p) => p > 0)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition border ${
                    p === page
                      ? "bg-[#0d0c22] text-white border-[#0d0c22]"
                      : "border-gray-200 text-[#6e6d7a] hover:border-[#0d0c22] hover:text-[#0d0c22]"
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#6e6d7a] hover:border-[#0d0c22] hover:text-[#0d0c22] disabled:opacity-30 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
