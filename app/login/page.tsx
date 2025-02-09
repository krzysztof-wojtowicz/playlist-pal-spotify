// components
import LoginPage from "../components/LoginPage";

// next imports
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | PlaylistPal",
  description: "Login with your spotify account to discover new tracks!",
};

export default function Login() {
  return (
    <main className="w-screen h-screen overflow-x-hidden text-text bg-background">
      <LoginPage />
    </main>
  );
}
