"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useState,
  Suspense,
  useEffect,
  useRef,
  useCallback,
  useTransition,
} from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  Star,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import MangaGrid from "@/components/manga/MangaGrid";
import { MangaAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ─── Filter types ─── */
type SortOption = "relevance" | "score" | "members" | "favorites";
type StatusFilter = "all" | "publishing" | "finished";
type TypeFilter = "all" | "manga" | "manhwa" | "manhua" | "novel";

interface Filters {
  sort: SortOption;
  status: StatusFilter;
  type: TypeFilter;
  minScore: number;
}

const DEFAULT_FILTERS: Filters = {
  sort: "relevance",
  status: "all",
  type: "all",
  minScore: 0,
};

const POPULAR_TAGS = [
  "Berserk", "One Piece", "Demon Slayer", "Jujutsu Kaisen",
  "Attack on Titan", "Vinland Saga", "Vagabond", "Monster",
  "Death Note", "Fullmetal Alchemist",
];

/* ─── Dropdown helper ─── */
function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none text-sm font-medium px-3 py-2 pr-8 rounded-xl border transition cursor-pointer outline-none"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "var(--surface)" }}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--text-muted)" }} />
      </div>
    </div>
  );
}

/* ─── Score range slider ─── */
function ScoreSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
        Min Score: <span style={{ color: "var(--accent)" }}>{value > 0 ? `${value}+` : "Any"}</span>
      </label>
      <input
        type="range"
        min={0}
        max={9}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#ea4c89] cursor-pointer"
        style={{ accentColor: "var(--accent)" }}
      />
      <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
        <span>Any</span>
        <span>9+</span>
      </div>
    </div>
  );
}

/* ─── Main search content ─── */
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const initialQ = searchParams.get("q") || "";
  const [input, setInput] = useState(initialQ);
  const [submittedQ, setSubmittedQ] = useState(initialQ);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync URL param → input
  useEffect(() => {
    setInput(initialQ);
    setSubmittedQ(initialQ);
  }, [initialQ]);

  // Infinite search query
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["search", submittedQ, filters],
      queryFn: ({ pageParam = 1 }) =>
        MangaAPI.search(submittedQ, pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (last, all) =>
        last?.pagination?.has_next_page ? all.length + 1 : undefined,
      enabled: !!submittedQ,
    });

  const allMangas = data?.pages.flatMap((p) => p?.data ?? []) ?? [];

  // Apply client-side filters (score + type + status sort)
  const filteredMangas = allMangas
    .filter((m) => {
      if (filters.minScore > 0 && (m.score ?? 0) < filters.minScore) return false;
      if (filters.status === "publishing" && m.status !== "Publishing") return false;
      if (filters.status === "finished" && m.status === "Publishing") return false;
      if (filters.type !== "all" && m.type?.toLowerCase() !== filters.type) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "score") return (b.score ?? 0) - (a.score ?? 0);
      if (filters.sort === "members") return (b.members ?? 0) - (a.members ?? 0);
      if (filters.sort === "favorites") return (b.favorites ?? 0) - (a.favorites ?? 0);
      return 0; // relevance = API order
    });

  // IntersectionObserver for infinite scroll
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleIntersect, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersect]);

  // Handle search submit
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSubmittedQ(q);
    });
  };

  // Active filter count
  const activeFilterCount = [
    filters.sort !== "relevance",
    filters.status !== "all",
    filters.type !== "all",
    filters.minScore > 0,
  ].filter(Boolean).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

      {/* ── Search hero ── */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {submittedQ
            ? <>Results for <span style={{ color: "var(--accent)" }}>&ldquo;{submittedQ}&rdquo;</span></>
            : "Search Everything"}
        </h1>
        {submittedQ && !isLoading && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {filteredMangas.length} title{filteredMangas.length !== 1 ? "s" : ""} found
            {activeFilterCount > 0 && " (filtered)"}
          </p>
        )}
      </div>

      {/* ── Search bar ── */}
      <form onSubmit={handleSubmit} className="mb-5 max-w-2xl mx-auto">
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-200"
          style={{
            background: "var(--surface)",
            borderColor: inputFocused ? "var(--accent)" : "var(--border)",
            boxShadow: inputFocused ? "0 0 0 3px var(--accent-muted)" : "var(--shadow-sm)",
          }}
        >
          <Search
            className="w-5 h-5 shrink-0 transition-colors"
            style={{ color: inputFocused ? "var(--accent)" : "var(--text-muted)" }}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="Search manga, manhwa, manhua..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
            autoFocus={!initialQ}
          />
          {input && (
            <button
              type="button"
              onClick={() => { setInput(""); }}
              className="btn btn-icon !w-6 !h-6 !border-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary h-9 px-5 text-sm shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* ── Toolbar: filter toggle + active chips ── */}
      <div className="flex items-center justify-between gap-3 mb-6 max-w-2xl mx-auto flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "btn btn-ghost h-9 px-4 gap-2 text-sm relative",
              showFilters && "border-[var(--accent)] text-[var(--accent)]"
            )}
            style={showFilters ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 text-[10px] font-bold text-white rounded-full flex items-center justify-center"
                style={{ background: "var(--accent)", width: 18, height: 18 }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {filters.sort !== "relevance" && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              {filters.sort}
              <button onClick={() => setFilters(f => ({ ...f, sort: "relevance" }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status !== "all" && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              {filters.status}
              <button onClick={() => setFilters(f => ({ ...f, status: "all" }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.type !== "all" && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              {filters.type}
              <button onClick={() => setFilters(f => ({ ...f, type: "all" }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minScore > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              Score {filters.minScore}+
              <button onClick={() => setFilters(f => ({ ...f, minScore: 0 }))}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-xs font-medium transition hover:text-[#ea4c89]"
            style={{ color: "var(--text-muted)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Filter panel ── */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: showFilters ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
          overflow: "hidden",
          maxWidth: "42rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="rounded-2xl border p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <FilterSelect<SortOption>
              label="Sort by"
              value={filters.sort}
              options={[
                { value: "relevance", label: "Relevance" },
                { value: "score", label: "Best Score" },
                { value: "members", label: "Most Members" },
                { value: "favorites", label: "Most Favorites" },
              ]}
              onChange={(v) => setFilters(f => ({ ...f, sort: v }))}
            />
            <FilterSelect<StatusFilter>
              label="Status"
              value={filters.status}
              options={[
                { value: "all", label: "All" },
                { value: "publishing", label: "Publishing" },
                { value: "finished", label: "Finished" },
              ]}
              onChange={(v) => setFilters(f => ({ ...f, status: v }))}
            />
            <FilterSelect<TypeFilter>
              label="Type"
              value={filters.type}
              options={[
                { value: "all", label: "All Types" },
                { value: "manga", label: "Manga" },
                { value: "manhwa", label: "Manhwa" },
                { value: "manhua", label: "Manhua" },
                { value: "novel", label: "Novel" },
              ]}
              onChange={(v) => setFilters(f => ({ ...f, type: v }))}
            />
            <ScoreSlider
              value={filters.minScore}
              onChange={(v) => setFilters(f => ({ ...f, minScore: v }))}
            />
          </div>
        </div>
      </div>

      {/* ── Empty state (no query yet) ── */}
      {!submittedQ && (
        <div className="text-center py-16">
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Discover your next series
          </h2>
          <p className="text-sm mb-10" style={{ color: "var(--text-secondary)" }}>
            Search across thousands of manga, manhwa, and manhua titles.
          </p>

          {/* Popular searches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Popular
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setInput(tag);
                    setSubmittedQ(tag);
                    router.push(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="btn btn-ghost h-9 px-4 text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Genre browse */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              Browse by genre
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Trending",    q: "trending" },
                { label: "Action",      q: "action" },
                { label: "Romance",     q: "romance" },
                { label: "Horror",      q: "horror" },
                { label: "Fantasy",     q: "fantasy" },
                { label: "Comedy",      q: "comedy" },
                { label: "Sci-Fi",      q: "sci-fi" },
                { label: "Slice of Life", q: "slice of life" },
                { label: "Shounen",     q: "shounen" },
                { label: "Shoujo",      q: "shoujo" },
              ].map((cat) => (
                <button
                  key={cat.q}
                  onClick={() => {
                    setInput(cat.q);
                    setSubmittedQ(cat.q);
                    router.push(`/search?q=${encodeURIComponent(cat.q)}`);
                  }}
                  className="btn btn-ghost h-9 px-4 text-sm"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── No results — filters applied ── */}
      {submittedQ && !isLoading && filteredMangas.length === 0 && allMangas.length > 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            No results match your filters
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            {allMangas.length} results exist — try relaxing your filters.
          </p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="btn btn-primary h-9 px-5"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── No results — no match ── */}
      {submittedQ && !isLoading && allMangas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            No results for &ldquo;{submittedQ}&rdquo;
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Try a different spelling or search term.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_TAGS.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setInput(tag);
                  setSubmittedQ(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="btn btn-ghost h-9 px-4 text-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results sort bar ── */}
      {filteredMangas.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* View mode would go here */}
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {filteredMangas.length} results
            </span>
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {filters.sort === "relevance" ? "Best match" : `Sorted by ${filters.sort}`}
            </div>
          </div>

          {/* Quick sort pills */}
          <div className="hidden sm:flex items-center gap-1">
            {(["relevance", "score", "members"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilters(f => ({ ...f, sort: s }))}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={
                  filters.sort === s
                    ? { background: "var(--text-primary)", color: "var(--surface)", borderColor: "var(--text-primary)" }
                    : { borderColor: "var(--border)", color: "var(--text-secondary)", background: "transparent" }
                }
              >
                {s === "relevance" ? "Best match" : s === "score" ? <><Star className="w-3 h-3 inline mr-0.5 fill-yellow-400 text-yellow-400" />Score</> : <><BookOpen className="w-3 h-3 inline mr-0.5" />Popular</>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid ── */}
      {filteredMangas.length > 0 && (
        <MangaGrid mangas={filteredMangas} isLoading={isLoading && !allMangas.length} isFetchingMore={isFetchingNextPage} />
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading more */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-8" style={{ color: "var(--text-muted)" }}>
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium">Loading more...</span>
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && filteredMangas.length > 0 && !isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-4" style={{ color: "var(--text-muted)" }}>
            <div className="h-px w-16" style={{ background: "var(--border)" }} />
            <span className="text-sm">End of results</span>
            <div className="h-px w-16" style={{ background: "var(--border)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Suspense shell ─── */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading search...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
