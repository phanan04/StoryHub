import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",          // Prevent invisible text during load
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "StoryHub — Discover Manga, Manhwa & Manhua",
    template: "%s — StoryHub",  // Child pages: "Berserk — StoryHub"
  },
  description:
    "Explore thousands of manga, manhwa, and manhua. Find trending titles, browse by genre, and discover your next favourite story.",
  keywords: ["manga", "manhwa", "manhua", "anime", "comics", "discover", "trending"],
  authors: [{ name: "StoryHub" }],
  openGraph: {
    type: "website",
    siteName: "StoryHub",
    title: "StoryHub — Discover Manga, Manhwa & Manhua",
    description:
      "Explore thousands of manga, manhwa, and manhua. Find trending titles and discover your next favourite story.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryHub — Discover Manga, Manhwa & Manhua",
    description: "Explore thousands of manga, manhwa, and manhua titles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
