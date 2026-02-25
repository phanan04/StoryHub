"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, BookOpen, Users, Heart, Calendar,
  ArrowLeft, Bookmark, Share2, ExternalLink, Award, TrendingUp,
} from "lucide-react";
import { MangaAPI } from "@/lib/api";
import { formatScore, getImageUrl } from "@/lib/utils";

/* ─── Loading skeleton ─── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-[60px] z-30 border-b px-6 py-4"
        style={{ background: "var(--nav-bg)", borderColor: "var(--border)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 skeleton rounded" />
              <div className="h-3 w-20 skeleton rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-28 h-9 skeleton rounded-full" />
            <div className="w-9 h-9 skeleton rounded-full" />
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex gap-10">
        <div className="w-64 shrink-0 aspect-[2/3] skeleton rounded-2xl" />
        <div className="flex-1 space-y-5 pt-2">
          <div className="h-10 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-1/2" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
          </div>
          <div className="h-36 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ─── */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-2 transition border"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-xl font-extrabold leading-none" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

/* ─── Quick stat ─── */
function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-2.5 border transition"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
        {icon} {label}
      </span>
      <span className="font-extrabold text-sm" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}

/* ─── Main page ─── */
export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-detail", id],
    queryFn: () => MangaAPI.getById(id),
    enabled: !!id,
  });

  const manga = data?.jikan?.data;
  const title = manga?.title_english || manga?.title || "";

  // ─── Conditional renders AFTER all hooks ───
  if (isLoading) return <DetailSkeleton />;

  if (isError || !manga) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Manga not found
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
          This title might have been removed or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 px-5 py-2.5 text-white text-sm font-semibold rounded-full"
          style={{ background: "var(--accent)" }}
        >
          Back to Discover
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(manga.images);
  const authors = manga.authors?.map((a) => a.name).join(", ") || "Unknown Author";

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg)" }}>

      {/* ── Sticky top bar ── */}
      <div
        className="sticky top-[60px] z-30 border-b transition-colors duration-300"
        style={{ background: "var(--nav-bg)", borderColor: "var(--border)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full border transition btn-icon"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#ea4c89]/20 shrink-0"
              style={{ background: "var(--surface-2)" }}
            >
              <Image src={imageUrl} alt={title} fill className="object-cover" unoptimized />
            </div>
            <div className="min-w-0 max-w-[180px]">
              <p className="text-sm font-semibold leading-none truncate" style={{ color: "var(--text-primary)" }}>
                {authors}
              </p>
              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${manga.status === "Publishing" ? "bg-green-500" : "bg-gray-400"}`} />
                {manga.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm font-medium transition hover:border-[#ea4c89] hover:text-[#ea4c89]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Heart className="w-4 h-4" />
              <span>{manga.favorites?.toLocaleString() ?? "0"}</span>
            </button>
            <button
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border transition hover:border-[#ea4c89] hover:text-[#ea4c89]"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border transition"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-9 px-4 text-white text-sm font-semibold rounded-full transition whitespace-nowrap"
              style={{ background: "var(--text-primary)" }}
            >
              <span className="hidden sm:inline">Read on MAL</span>
              <span className="sm:hidden">MAL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* LEFT: Cover */}
          <div className="shrink-0 lg:w-56 xl:w-64">
            <div className="lg:sticky lg:top-[136px]">
              <div className="relative w-full max-w-[240px] mx-auto lg:max-w-none aspect-[2/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10">
                <Image src={imageUrl} alt={title} fill className="object-cover" priority unoptimized />
                {manga.rank && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#ea4c89] text-white text-xs font-extrabold rounded-full">
                    #{manga.rank}
                  </div>
                )}
              </div>

              <div className="hidden lg:block mt-4 space-y-2">
                {manga.score && (
                  <QuickStat icon={<Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />} label="Score" value={formatScore(manga.score)} />
                )}
                {manga.rank && (
                  <QuickStat icon={<Award className="w-3.5 h-3.5 text-yellow-500" />} label="Ranked" value={`#${manga.rank}`} />
                )}
                {manga.popularity && (
                  <QuickStat icon={<TrendingUp className="w-3.5 h-3.5 text-[#ea4c89]" />} label="Popularity" value={`#${manga.popularity}`} />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="flex-1 min-w-0">

            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold leading-tight"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                {title}
              </h1>
              <span className={`shrink-0 self-start px-3 py-1 rounded-full text-xs font-bold ${manga.status === "Publishing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {manga.status}
              </span>
            </div>

            {manga.title_japanese && (
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{manga.title_japanese}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="px-3 py-1 text-white rounded-full text-xs font-bold" style={{ background: "var(--text-primary)" }}>
                {manga.type}
              </span>
              {manga.published?.string && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {manga.published.string}
                </span>
              )}
              {authors && (
                <span>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>by</span> {authors}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard icon={<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />} label="Score" value={formatScore(manga.score)} />
              <StatCard icon={<BookOpen className="w-4 h-4 text-[#ea4c89]" />} label="Chapters" value={manga.chapters ? `${manga.chapters}` : "Ongoing"} />
              <StatCard
                icon={<Users className="w-4 h-4 text-blue-500" />}
                label="Members"
                value={manga.members ? (manga.members >= 1000 ? `${(manga.members / 1000).toFixed(1)}k` : `${manga.members}`) : "N/A"}
              />
              <StatCard
                icon={<Heart className="w-4 h-4 fill-pink-400 text-pink-400" />}
                label="Favorites"
                value={manga.favorites ? (manga.favorites >= 1000 ? `${(manga.favorites / 1000).toFixed(1)}k` : `${manga.favorites}`) : "N/A"}
              />
            </div>

            {/* Genres */}
            {manga.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {manga.genres.map((g) => (
                  <span
                    key={g.mal_id}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer hover:border-[#ea4c89] hover:text-[#ea4c89]"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--surface)" }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="rounded-2xl p-6 mb-6 border transition" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-bold mb-3 uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                Synopsis
              </h2>
              <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
                {manga.synopsis || "No synopsis available for this title."}
              </p>
            </div>

            {/* Extras */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              {manga.scored_by && (
                <span>
                  Scored by <strong style={{ color: "var(--text-primary)" }}>{manga.scored_by.toLocaleString()}</strong> users
                </span>
              )}
              {manga.volumes && (
                <span>
                  <strong style={{ color: "var(--text-primary)" }}>{manga.volumes}</strong> volumes
                </span>
              )}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between text-sm border-t pt-6"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              <button onClick={() => router.back()} className="flex items-center gap-1.5 transition hover:text-[#ea4c89]">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <a href={manga.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-medium hover:underline"
                style={{ color: "var(--accent)" }}>
                View on MyAnimeList <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}