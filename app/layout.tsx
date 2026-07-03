import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLISS — Your AI Tutor",
  description: "Voice-enabled AI tutor & quiz assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body bg-cream text-ink">{children}</body>
    </html>
  );
}
