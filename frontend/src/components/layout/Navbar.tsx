"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center h-[60px] gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-[#ea4c89] shrink-0 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 bg-[#ea4c89] rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#0d0c22] font-extrabold text-lg tracking-tight">StoryHub</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {["Discover", "Trending", "New"].map((item) => (
              <Link
                key={item}
                href={item === "Discover" ? "/" : `/search?q=${item.toLowerCase()}`}
                className="px-3 py-2 text-sm font-medium text-[#6e6d7a] hover:text-[#0d0c22] rounded-lg hover:bg-gray-100 transition"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[480px] mx-auto">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition bg-gray-50 ${
                focused ? "border-[#ea4c89] bg-white shadow-sm" : "border-gray-200"
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search manga, manhwa, manhua..."
                className="flex-1 bg-transparent text-sm text-[#0d0c22] placeholder:text-gray-400 outline-none"
              />
            </div>
          </form>

          {/* CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/search"
              className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#6e6d7a] hover:text-[#0d0c22] transition"
            >
              Browse
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#ea4c89] hover:bg-[#d63c78] rounded-full transition"
            >
              Get Inspired
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
