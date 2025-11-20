import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { StoreProvider } from "@/redux/provider";
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

export const metadata: Metadata = {
  title: "EnglishPrep | Personal IELTS · TOEFL · GRE Coach",
  description:
    "Track vocabulary, log practice sessions, and review tense references for Phase 1 of the EnglishPrep project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col bg-background">
              <SiteHeader />
              <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
                {children}
              </main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
