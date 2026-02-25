"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, Users, Heart, Calendar, ChevronLeft } from "lucide-react";
import { MangaAPI } from "@/lib/api";
import { formatScore, getImageUrl } from "@/lib/utils";

export default function MangaDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga-detail", id],
    queryFn: () => MangaAPI.getById(id),
    enabled: !!id,
  });

  const manga = data?.jikan?.data;

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-10 animate-pulse">
        <div className="h-5 w-24 bg-gray-200 rounded mb-8" />
        <div className="flex gap-10">
          <div className="w-52 aspect-[2/3] bg-gray-200 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-9 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="flex gap-2">
              {[60, 80, 70].map((w, i) => <div key={i} className={`h-7 bg-gray-200 rounded-full w-${w}`} />)}
            </div>
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !manga) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="text-6xl mb-4">😔</span>
        <p className="text-xl font-bold text-[#0d0c22]">Manga not found</p>
        <Link href="/" className="mt-4 text-sm text-[#ea4c89] hover:underline">Back to home</Link>
      </div>
    );
  }

  const title = manga.title_english || manga.title;
  const imageUrl = getImageUrl(manga.images);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#6e6d7a] hover:text-[#0d0c22] transition mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 transition group-hover:-translate-x-0.5" />
        Back to discover
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Cover */}
          <div className="shrink-0 sm:w-64 lg:w-72">
            <div className="relative w-full aspect-[2/3]">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-8 space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0d0c22] leading-tight">{title}</h1>
                  {manga.title_japanese && (
                    <p className="text-[#6e6d7a] text-sm mt-1">{manga.title_japanese}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                    manga.status === "Publishing"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {manga.status}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />, label: "Score", value: formatScore(manga.score) },
                { icon: <BookOpen className="w-5 h-5 text-[#ea4c89]" />, label: "Chapters", value: manga.chapters ? `${manga.chapters}` : "Ongoing" },
                { icon: <Users className="w-5 h-5 text-blue-500" />, label: "Members", value: manga.members?.toLocaleString() ?? "N/A" },
                { icon: <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />, label: "Favorites", value: manga.favorites?.toLocaleString() ?? "N/A" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">{icon}<span className="text-xs text-[#6e6d7a] font-medium">{label}</span></div>
                  <span className="text-lg font-extrabold text-[#0d0c22]">{value}</span>
                </div>
              ))}
            </div>

            {/* Type + Published */}
            <div className="flex flex-wrap gap-3 items-center text-sm text-[#6e6d7a]">
              <span className="px-3 py-1 bg-[#0d0c22] text-white rounded-full text-xs font-bold">{manga.type}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {manga.published?.string || "Unknown date"}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {manga.genres?.map((g) => (
                <span
                  key={g.mal_id}
                  className="px-3 py-1 border border-gray-200 text-[#6e6d7a] rounded-full text-xs font-medium hover:border-[#ea4c89] hover:text-[#ea4c89] transition cursor-pointer"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Authors */}
            {manga.authors?.length > 0 && (
              <p className="text-sm text-[#6e6d7a]">
                <span className="font-semibold text-[#0d0c22]">Author: </span>
                {manga.authors.map((a) => a.name).join(", ")}
              </p>
            )}

            {/* Synopsis */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-bold text-[#0d0c22] mb-3">Synopsis</h2>
              <p className="text-sm text-[#6e6d7a] leading-relaxed">
                {manga.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}