"use client";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListProgressQuery } from "@/redux/features/progress/progressApi";
import { useGetVocabularyQuery } from "@/redux/features/vocabulary/vocabularyApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Award,
  BookMarked,
  Brain,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function ProgressPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const { data: vocabData } = useGetVocabularyQuery();
  const { data: learnedProgress } = useListProgressQuery(
    { status: "learned" },
    { skip: !isAuthenticated }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Get learned words by matching progress with vocabulary
  const learnedWords = useMemo(() => {
    if (!learnedProgress || !vocabData) return [];
    const learnedVocabIds = new Set(learnedProgress.map((p) => p.vocabularyId));
    return vocabData.filter((word) => learnedVocabIds.has(word._id));
  }, [learnedProgress, vocabData]);

  const totalWords = vocabData?.length || 0;
  const learnedCount = learnedWords.length;
  const learningProgress =
    totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

  const daysActive = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const wordsPerDay =
    daysActive > 0 ? (totalWords / daysActive).toFixed(1) : "0";

  const stats = [
    {
      title: "Total Words",
      value: totalWords,
      icon: BookMarked,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Learned Words",
      value: learnedCount,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Progress",
      value: `${learningProgress}%`,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Words/Day",
      value: wordsPerDay,
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  const achievements = [
    {
      title: "First Word",
      description: "Added first word",
      icon: BookMarked,
      completed: totalWords > 0,
    },
    {
      title: "Quick Learner",
      description: "10+ words",
      icon: Zap,
      completed: totalWords >= 10,
    },
    {
      title: "Vocabulary Master",
      description: "100+ words",
      icon: Trophy,
      completed: totalWords >= 100,
    },
    {
      title: "Learning Champion",
      description: "50+ learned",
      icon: Award,
      completed: learnedCount >= 50,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-purple-500/10 to-primary/5 p-8 md:p-12">
          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Your VocabPrep Journey</span>
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">
              Learning <span className="gradient-text">Progress</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track your vocabulary mastery, celebrate achievements, and keep
              building your English skills
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={index}>
                <Card className="glass-card border-2 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold gradient-text">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl ${stat.bgColor} backdrop-blur-sm`}
                      >
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>

      {/* Progress Chart Section */}
      <FadeIn delay={0.2}>
        <Card className="glass-card border-2 bg-linear-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-3">
                <div className="relative">
                  <TrendingUp className="h-16 w-16 mx-auto opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                  </div>
                </div>
                <p className="font-medium">Activity Chart Coming Soon</p>
                <p className="text-sm">
                  Keep learning to unlock detailed progress insights!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Learned Words List */}
      <FadeIn delay={0.4}>
        <Card className="border-2 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Learned Words ({learnedCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learnedCount === 0 ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="h-16 w-16 mx-auto opacity-20" />
                <p className="text-muted-foreground text-lg font-medium">
                  No words learned yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start marking words as learned to track your progress!
                </p>
              </div>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learnedWords.map((word, index) => (
                    <StaggerItem key={word._id}>
                      <Link href={`/words/${word._id}`}>
                        <Card className="group cursor-pointer border-2 hover:border-green-500 hover:shadow-lg transition-all duration-300 bg-linear-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
                          <CardContent className="p-4 space-y-3">
                            {/* Word Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                  {word.word}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {word.meaning}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-green-500 group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Bengali Meaning */}
                            {word.meaningBn && (
                              <div className="pt-2 border-t">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-bengali line-clamp-1">
                                  {word.meaningBn}
                                </p>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={
                                  word.difficulty === "easy"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    : word.difficulty === "medium"
                                    ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                }
                              >
                                {word.difficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300"
                              >
                                ✓ Learned
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Achievements */}
      <FadeIn delay={0.5}>
        <Card className="glass-card border-2 bg-linear-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-orange-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      achievement.completed
                        ? "border-green-300 bg-linear-to-br from-green-50 to-emerald-50 dark:border-green-700 dark:from-green-950/30 dark:to-emerald-950/30"
                        : "border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/30 opacity-60"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div
                        className={`p-3 rounded-full ${
                          achievement.completed
                            ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.completed && (
                      <Badge className="mt-2 bg-green-600 text-white text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Learning Tips */}
      <FadeIn delay={0.5}>
        <Card className="glass-card border-2 bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg gradient-text">
                VocabPrep Learning Tips
              </h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">📚</span>
                <span className="text-muted-foreground">
                  Try to learn at least 5 new words every day for consistent
                  progress
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">🔄</span>
                <span className="text-muted-foreground">
                  Review your vocabulary regularly to improve long-term
                  retention
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✍️</span>
                <span className="text-muted-foreground">
                  Use new words in sentences to understand context and meaning
                  better
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">🔊</span>
                <span className="text-muted-foreground">
                  Practice pronunciation using the audio feature for better
                  speaking skills
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">🎯</span>
                <span className="text-muted-foreground">
                  Set daily goals and track your progress to stay motivated
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
