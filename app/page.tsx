// next imports
import type { Metadata } from "next";

// components
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  title: "Explore new tracks on Spotify!",
  description:
    "Tell us about your favourite songs/artists, and we will create personalized playlist for you to explore!",
};

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-x-hidden text-text bg-background">
      <HomePage />
    </main>
  );
}
