"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, BookOpen, Moon, Sun, X, TrendingUp, Clock,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MangaAPI } from "@/lib/api";
import { getImageUrl, formatScore } from "@/lib/utils";

const RECENT_KEY = "storyhub_recent_searches";
const MAX_RECENT = 5;

function useRecentSearches() {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      setRecents(stored);
    } catch { /* ignore */ }
  }, []);

  const addRecent = useCallback((q: string) => {
    setRecents((prev) => {
      const next = [q, ...prev.filter((r) => r !== q)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeRecent = useCallback((q: string) => {
    setRecents((prev) => {
      const next = prev.filter((r) => r !== q);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recents, addRecent, removeRecent };
}

/* ─── Keyboard-navigable item count helper ─── */
function getItemCount(query: string, recents: string[], suggestions: string[]): number {
  if (!query && recents.length > 0) return recents.length;
  return suggestions.length;
}

/* ─── Suggestions dropdown ─── */
function SuggestionsPanel({
  query,
  recents,
  onSelect,
  onRemoveRecent,
}: {
  query: string;
  recents: string[];
  onSelect: (q: string) => void;
  onRemoveRecent: (q: string) => void;
}) {
  // Live search for suggestions (debounced at parent)
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", query],
    queryFn: () => MangaAPI.search(query, 1),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });

  const suggestions = data?.data?.slice(0, 5) ?? [];
  const showRecents = !query && recents.length > 0;
  const showResults = query.length >= 2;

  if (!showRecents && !showResults) return null;

  return (
    <div
      className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border overflow-hidden z-50"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Recent searches */}
      {showRecents && (
        <div className="p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--text-muted)" }}>
            Recent
          </p>
          {recents.map((r) => (
            <div key={r} className="group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface-2)] cursor-pointer transition"
              onClick={() => onSelect(r)}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
              <span className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>{r}</span>
              <button
                className="opacity-0 group-hover:opacity-100 transition p-0.5 rounded hover:bg-[var(--surface-3)]"
                onClick={(e) => { e.stopPropagation(); onRemoveRecent(r); }}
              >
                <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live results */}
      {showResults && (
        <div className="p-3">
          {query.length >= 2 && (
            <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--text-muted)" }}>
              Results
            </p>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 px-2 py-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 py-1.5 flex-1">
                  <div className="w-8 h-10 rounded-lg skeleton shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 skeleton rounded w-4/5" />
                    <div className="h-2.5 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && suggestions.length === 0 && query.length >= 2 && (
            <p className="text-sm text-center py-3" style={{ color: "var(--text-muted)" }}>
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {suggestions.map((manga) => {
            const title = manga.title_english || manga.title;
            const img = getImageUrl(manga.images);
            return (
              <div
                key={manga.mal_id}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--surface-2)] cursor-pointer transition"
                onClick={() => onSelect(title)}
              >
                {/* Thumbnail */}
                <div className="relative w-8 h-10 rounded-lg overflow-hidden shrink-0"
                  style={{ background: "var(--surface-3)" }}
                >
                  <Image src={img} alt={title} fill className="object-cover" unoptimized />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-snug" style={{ color: "var(--text-primary)" }}>
                    {title}
                  </p>
                  <p className="text-[11px] truncate leading-tight" style={{ color: "var(--text-muted)" }}>
                    {manga.type}
                    {manga.score ? ` · ⭐ ${formatScore(manga.score)}` : ""}
                    {manga.genres?.[0] ? ` · ${manga.genres[0].name}` : ""}
                  </p>
                </div>
                {/* Navigate to detail */}
                <Link
                  href={`/manga/${manga.mal_id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition shrink-0 hover:border-[#ea4c89] hover:text-[#ea4c89]"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  View
                </Link>
              </div>
            );
          })}

          {/* See all results */}
          {suggestions.length > 0 && (
            <button
              onClick={() => onSelect(query)}
              className="w-full text-sm font-semibold text-center py-2.5 mt-1 rounded-xl border-t transition hover:bg-[var(--surface-2)]"
              style={{ color: "var(--accent)", borderColor: "var(--border)" }}
            >
              See all results for &ldquo;{query}&rdquo; →
            </button>
          )}
        </div>
      )}

      {/* Trending (only when no query) */}
      {!query && !showRecents && (
        <div className="p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: "var(--text-muted)" }}>
            Trending
          </p>
          {["Berserk", "One Piece", "Demon Slayer", "Jujutsu Kaisen"].map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface-2)] cursor-pointer transition"
              onClick={() => onSelect(t)}
            >
              <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent)" }} />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ─── */
export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [focused, setFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { recents, addRecent, removeRecent } = useRecentSearches();

  useEffect(() => setMounted(true), []);

  // Debounce search input for suggestions
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        formRef.current && !formRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecent(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setFocused(false);
    setActiveIndex(-1);
  };

  const handleSelectSuggestion = (selected: string) => {
    setQ(selected);
    addRecent(selected);
    router.push(`/search?q=${encodeURIComponent(selected)}`);
    setFocused(false);
    setActiveIndex(-1);
  };

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    const items = q.length >= 2 ? [] : recents; // simplified: navigate recents when no query
    if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
      e.preventDefault();
      handleSelectSuggestion(items[activeIndex]);
    }
  };

  const isDark = theme === "dark";
  const showDropdown = focused && (q.length >= 2 || recents.length > 0);

  // Global '/' shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-colors duration-200"
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--nav-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-[60px] gap-3 sm:gap-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[#ea4c89] rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="font-extrabold text-lg tracking-tight"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
            >
              StoryHub
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-1">
            {[{ label: "Discover", href: "/" }, { label: "Browse", href: "/search" }].map((item) => (
              <Link key={item.label} href={item.href}
                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search with suggestions — sm+ */}
          <div className="hidden sm:block flex-1 max-w-[520px] mx-auto relative">
            <form ref={formRef} onSubmit={handleSearch}>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-200"
                style={{
                  background: focused ? "var(--surface)" : "var(--surface-2)",
                  borderColor: focused ? "var(--accent)" : "var(--border)",
                  boxShadow: focused ? "0 0 0 3px var(--accent-muted)" : "var(--shadow-sm)",
                }}
              >
                <Search
                  className="w-4 h-4 shrink-0"
                  style={{ color: focused ? "var(--accent)" : "var(--text-muted)" }}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => { setFocused(true); setActiveIndex(-1); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search manga, manhwa, manhua..."
                  aria-label="Search"
                  aria-autocomplete="list"
                  aria-expanded={showDropdown}
                  className="flex-1 bg-transparent text-sm outline-none min-w-0"
                  style={{ color: "var(--text-primary)", caretColor: "var(--accent)" }}
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="btn btn-icon !w-5 !h-5 !border-0 shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown */}
            {showDropdown && (
              <div ref={dropdownRef}>
                <SuggestionsPanel
                  query={debouncedQ}
                  recents={recents}
                  onSelect={handleSelectSuggestion}
                  onRemoveRecent={removeRecent}
                />
              </div>
            )}
          </div>

          {/* Mobile search icon */}
          <button
            onClick={() => router.push("/search")}
            className="sm:hidden ml-auto btn btn-icon"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="btn btn-icon hover:scale-105 active:scale-95"
                aria-label={isDark ? "Switch to light" : "Switch to dark"}
              >
                {isDark
                  ? <Sun className="w-4 h-4 text-yellow-400" />
                  : <Moon className="w-4 h-4" />
                }
              </button>
            )}
            <Link href="/" className="hidden sm:flex btn btn-primary h-9 px-5">
              Get Inspired
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
