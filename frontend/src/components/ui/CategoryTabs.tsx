"use client";

import { CATEGORIES } from "@/types/manga.types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div
      className="sticky top-[60px] z-40 border-b transition-colors duration-200"
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--nav-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      } as React.CSSProperties}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 shrink-0 border",
                )}
                style={
                  isActive
                    ? {
                        background: "var(--text-primary)",
                        color: "var(--surface)",
                        borderColor: "var(--text-primary)",
                        boxShadow: "var(--shadow-sm)",
                      }
                    : {
                        color: "var(--text-secondary)",
                        borderColor: "transparent",
                        background: "transparent",
                      }
                }
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                  }
                }}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
