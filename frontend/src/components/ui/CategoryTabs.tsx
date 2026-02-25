"use client";

import { CATEGORIES } from "@/types/manga.types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface CategoryTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 border",
                active === cat.id
                  ? "bg-[#0d0c22] text-white border-[#0d0c22]"
                  : "text-[#6e6d7a] border-transparent hover:border-gray-200 hover:bg-gray-100 hover:text-[#0d0c22]"
              )}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}

          {/* Filters button - like Dribbble */}
          <button className="ml-auto shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-[#6e6d7a] hover:text-[#0d0c22] hover:border-gray-300 transition">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
}
