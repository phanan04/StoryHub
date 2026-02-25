"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import MangaGrid from "@/components/manga/MangaGrid";
import CategoryTabs from "@/components/ui/CategoryTabs";
import { MangaAPI } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";
import { Manga } from "@/types/manga.types";

const DEFAULT_CATEGORY = "trending";

export default function HomePage() {
  const { activeCategory, setActiveCategory } = useStore();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isHeroVisible = activeCategory === DEFAULT_CATEGORY;

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["manga", activeCategory],
      queryFn: ({ pageParam = 1 }) => {
        if (activeCategory === DEFAULT_CATEGORY) return MangaAPI.getTrending();
        return MangaAPI.getByCategory(activeCategory, pageParam as number);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (activeCategory === DEFAULT_CATEGORY) return undefined;
        return lastPage?.pagination?.has_next_page ? allPages.length + 1 : undefined;
      },
    });

  const mangas: Manga[] = data?.pages.flatMap((p) => p?.data ?? []) ?? [];

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Hero — Dribbble whitespace + typography ── */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isHeroVisible ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <section
            className="border-b transition-colors duration-200"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-28 text-center">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
                style={{
                  color: "var(--accent)",
                  borderColor: "var(--accent-muted)",
                  background: "var(--accent-muted)",
                }}
              >
                Trending this week
              </div>

              {/* Main headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] max-w-3xl mx-auto"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                Discover the World&apos;s Best{" "}
                <span style={{ color: "var(--accent)" }}>
                  Manga &amp; Manhwa
                </span>
              </h1>

              {/* Sub */}
              <p
                className="mt-6 text-lg max-w-lg mx-auto leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Explore thousands of stories from the most talented manga
                artists. Find your next favourite series.
              </p>

              {/* Quick-filter genre pills */}
              <div className="mt-10 flex items-center justify-center gap-2.5 flex-wrap">
                {[
                  { label: "Action", id: "action" },
                  { label: "Romance", id: "romance" },
                  { label: "Trending", id: "trending" },
                  { label: "Horror", id: "horror" },
                  { label: "Comedy", id: "comedy" },
                  { label: "Fantasy", id: "fantasy" },
                  { label: "Shounen", id: "shounen" },
                ].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleCategoryChange(tag.id)}
                    className="btn btn-ghost h-9 text-sm"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />

      {/* ── Grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-7">
          <div>
            <h2
              className="text-xl font-extrabold capitalize"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {activeCategory === DEFAULT_CATEGORY
                ? "Trending Now"
                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            {mangas.length > 0 && (
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {mangas.length} titles
              </p>
            )}
          </div>
        </div>

        <MangaGrid mangas={mangas} isLoading={isLoading} isFetchingMore={isFetchingNextPage} />

        {/* IntersectionObserver sentinel */}
        <div ref={sentinelRef} className="h-1 w-full" />

        {/* Loading more */}
        {isFetchingNextPage && (
          <div
            className="flex items-center justify-center gap-2 py-10"
            style={{ color: "var(--text-muted)" }}
          >
            <Loader2
              className="w-4 h-4 animate-spin"
              style={{ color: "var(--accent)" }}
            />
            <span className="text-sm font-medium">Loading more...</span>
          </div>
        )}

        {/* End of list */}
        {!hasNextPage && mangas.length > 0 && !isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-4" style={{ color: "var(--text-muted)" }}>
              <div className="h-px w-20" style={{ background: "var(--border)" }} />
              <span className="text-sm font-medium">You&apos;ve seen it all ✨</span>
              <div className="h-px w-20" style={{ background: "var(--border)" }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
