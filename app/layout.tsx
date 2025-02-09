import { JetBrains_Mono, Cousine } from "next/font/google";
import "./globals.css";

import { Providers } from "./components/Providers";

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const cousine = Cousine({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
