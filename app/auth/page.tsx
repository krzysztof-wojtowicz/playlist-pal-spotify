// components
import AuthPage from "../components/AuthPage";

// next imports
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotify Auth | PlaylistPal",
  description: "Auth redirect for Spotify login",
  robots: "noindex,nofollow",
};

export default function Auth() {
  return (
    <main className="w-screen h-screen overflow-x-hidden text-text bg-background">
      <AuthPage />
    </main>
  );
}
