import { create } from "zustand";

interface StoreState {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  activeCategory: "trending",
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
