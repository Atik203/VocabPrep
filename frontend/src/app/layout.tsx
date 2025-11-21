import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { StoreProvider } from "@/redux/provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "VocabPrep | Master English Vocabulary",
  description:
    "Build your English vocabulary with interactive flashcards, quizzes, and practice sessions. Perfect for learners at all levels.",
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
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
