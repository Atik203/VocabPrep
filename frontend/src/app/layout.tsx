import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuthProvider } from "@/components/providers/auth-provider";
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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">
                  <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    {children}
                  </div>
                </main>
                <SiteFooter />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
