"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Search } from "lucide-react";
import MangaGrid from "@/components/manga/MangaGrid";
import { MangaAPI } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const [input, setInput] = useState(initialQ);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["search", initialQ, page],
    queryFn: () => MangaAPI.search(initialQ, page),
    enabled: !!initialQ,
  });

  const mangas = data?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      router.push(`/search?q=${encodeURIComponent(input.trim())}`);
      setPage(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search manga, manhwa, manhua..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results header */}
      {initialQ && !isLoading && (
        <p className="text-gray-500 text-sm mb-6">
          {mangas.length > 0
            ? `Showing results for "${initialQ}"`
            : `No results for "${initialQ}"`}
        </p>
      )}

      {/* Grid */}
      <MangaGrid mangas={mangas} isLoading={isLoading && !!initialQ} />

      {/* Pagination */}
      {!isLoading && mangas.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 transition"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.pagination?.has_next_page}
            className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-40 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-gray-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
