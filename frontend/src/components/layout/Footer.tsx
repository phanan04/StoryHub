import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-extrabold text-[#0d0c22]">
              <div className="w-7 h-7 bg-[#ea4c89] rounded-lg flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              StoryHub
            </Link>
            <p className="text-sm text-[#6e6d7a] mt-2 max-w-xs">
              Discover the world’s best manga, manhwa and manhua.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-semibold text-[#0d0c22] mb-3">Discover</p>
              <ul className="space-y-2 text-[#6e6d7a]">
                <li><Link href="/" className="hover:text-[#ea4c89] transition">Trending</Link></li>
                <li><Link href="/search" className="hover:text-[#ea4c89] transition">Browse</Link></li>
                <li><Link href="/search?q=shounen" className="hover:text-[#ea4c89] transition">Shounen</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#0d0c22] mb-3">Genres</p>
              <ul className="space-y-2 text-[#6e6d7a]">
                <li><Link href="/search?q=action" className="hover:text-[#ea4c89] transition">Action</Link></li>
                <li><Link href="/search?q=romance" className="hover:text-[#ea4c89] transition">Romance</Link></li>
                <li><Link href="/search?q=horror" className="hover:text-[#ea4c89] transition">Horror</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#0d0c22] mb-3">Sources</p>
              <ul className="space-y-2 text-[#6e6d7a]">
                <li>
                  <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="hover:text-[#ea4c89] transition">
                    Jikan API
                  </a>
                </li>
                <li>
                  <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" className="hover:text-[#ea4c89] transition">
                    MyAnimeList
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-[#6e6d7a]">
          <span>© {new Date().getFullYear()} StoryHub. All rights reserved.</span>
          <span>Powered by Jikan API</span>
        </div>
      </div>
    </footer>
  );
}
