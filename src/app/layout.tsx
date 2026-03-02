import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { RootProvider } from "@/providers/root-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "EventFlow",
  description: "Sistema inteligente de gestão de eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProvider>
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
