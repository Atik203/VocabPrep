"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookMarked,
  BookOpen,
  Brain,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-purple-500/10 to-primary/5 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by Free Dictionary API</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Master <span className="gradient-text">English Vocabulary</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Build your vocabulary, practice with interactive exercises, and
            track your progress. Complete with pronunciation guides, meanings,
            examples, and smart learning tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/add-word">
                <Plus className="h-5 w-5" />
                Add Your First Word
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/words">
                <BookMarked className="h-5 w-5" />
                Browse Vocabulary
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 right-32 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card card-hover">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookMarked className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Smart Vocabulary Builder</CardTitle>
            <CardDescription>
              Search any word and get instant definitions, pronunciations,
              synonyms, and examples from the Free Dictionary API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/add-word">Start Adding Words →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Target className="h-6 w-6 text-success" />
            </div>
            <CardTitle>Exam-Focused Practice</CardTitle>
            <CardDescription>
              Organize words by difficulty and exam type (IELTS, TOEFL, GRE) to
              focus your study sessions effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/words">View Collection →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Brain className="h-6 w-6 text-warning" />
            </div>
            <CardTitle>Track Learning Progress</CardTitle>
            <CardDescription>
              Mark words as new, learning, or learned to monitor your vocabulary
              growth and revisit challenging words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/practice">Practice Now →</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dictionary API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">Free & Open</div>
            <p className="text-sm text-muted-foreground">No API key required</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pronunciation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              Audio Included
            </div>
            <p className="text-sm text-muted-foreground">
              Listen & learn correct pronunciation
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              No Duplicates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">Smart Check</div>
            <p className="text-sm text-muted-foreground">
              Automatic duplicate detection
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary to-purple-600 p-8 text-center text-primary-foreground md:p-12">
        <div className="relative z-10">
          <BookOpen className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
            Join thousands of students preparing for their English proficiency
            exams with our comprehensive vocabulary builder and practice tools.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/add-word">
                <Plus className="h-5 w-5 mr-2" />
                Add First Word
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background/10 hover:bg-background/20 text-primary-foreground border-primary-foreground/30"
            >
              <Link href="/words">View All Words</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMCAxLjEwNS0uODk1IDItMiAycy0yLS44OTUtMi0yIC44OTUtMiAyLTIgMiAuODk1IDIgMm0wLTEwYzAtMS4xMDUuODk1LTIgMi0yIDF2LTRhNiA2IDAgMCAwLTYgNnptLTIgMGMtMS4xMDUgMC0yLS44OTUtMi0ycy44OTUtMiAyLTIgMiAuODk1IDIgMi0uODk1IDItMiAyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
      </section>
    </div>
  );
}
