import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | null): string {
  if (!score) return "N/A";
  return score.toFixed(1);
}

export function truncate(text: string | null, length = 120): string {
  if (!text) return "No synopsis available.";
  return text.length > length ? text.slice(0, length) + "…" : text;
}

export function getImageUrl(images: { jpg: { large_image_url: string } } | undefined): string {
  return images?.jpg?.large_image_url || "/placeholder.png";
}
