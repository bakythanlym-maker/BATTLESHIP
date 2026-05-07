import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Battleship — Grand Admiral Edition",
  description: "Experience the ultimate naval combat simulator. Compete globally, analyze strategies with AI, and dominate the seas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#0a1628]">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
