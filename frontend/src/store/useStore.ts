import { create } from "zustand";

interface StoreState {
  searchQuery: string;
  activeCategory: string;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (category: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  searchQuery: "",
  activeCategory: "trending",
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
