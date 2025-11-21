"use client";

import { FadeIn } from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGetPracticeFeedbackMutation } from "@/redux/features/ai/aiApi";
import { useGetVocabularyQuery } from "@/redux/features/vocabulary/vocabularyApi";
import {
  BookMarked,
  Brain,
  CheckCircle2,
  Lightbulb,
  Loader2,
  MessageSquare,
  RotateCw,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VocabularyWord {
  _id: string;
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  phonetic?: string;
  phoneticAudio?: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: string;
  status: string;
}

const PRACTICE_MODES = [
  {
    id: "flashcard",
    title: "Flashcards",
    description: "Test your vocabulary with interactive flashcards",
    icon: BookMarked,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "quiz",
    title: "Quick Quiz",
    description: "Challenge yourself with meaning-based questions",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "sentence",
    title: "Use in Sentence",
    description: "Practice using words in context",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
  },
];

export default function PracticePage() {
  const [selectedMode, setSelectedMode] = useState<string>("flashcard");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [practiceWords, setPracticeWords] = useState<VocabularyWord[]>([]);
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  const { data: allWords, isLoading } = useGetVocabularyQuery({});
  const [getPracticeFeedback, { isLoading: isGettingFeedback }] =
    useGetPracticeFeedbackMutation();

  useEffect(() => {
    if (allWords && allWords.length > 0) {
      const shuffled = [...allWords].sort(() => Math.random() - 0.5);
      setPracticeWords(shuffled.slice(0, 20));
    }
  }, [allWords]);

  const currentWord = practiceWords[currentWordIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setUserInput("");
    setAiFeedback(null);
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  const handleCheckAnswer = () => {
    if (userInput.trim().toLowerCase() === currentWord?.word.toLowerCase()) {
      setScore({
        ...score,
        correct: score.correct + 1,
        total: score.total + 1,
      });
    } else {
      setScore({ ...score, total: score.total + 1 });
    }
    setShowAnswer(true);
  };

  const handleReset = () => {
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setUserInput("");
    setAiFeedback(null);
    setScore({ correct: 0, total: 0 });
    if (allWords && allWords.length > 0) {
      const shuffled = [...allWords].sort(() => Math.random() - 0.5);
      setPracticeWords(shuffled.slice(0, 20));
    }
  };

  const handleGetAIFeedback = async () => {
    if (!userInput.trim() || !currentWord) {
      toast.error("Please write a sentence first");
      return;
    }

    try {
      const result = await getPracticeFeedback({
        vocabularyId: currentWord._id,
        word: currentWord.word,
        userAnswer: userInput,
        skill: "writing",
      }).unwrap();

      setAiFeedback(result.data);
      toast.success("✨ AI feedback received!");
    } catch (error: any) {
      const errorMessage = error?.data?.error || "Failed to get AI feedback";
      toast.error(errorMessage);
    }
  };

  const playAudio = () => {
    if (currentWord?.phoneticAudio) {
      const audio = new Audio(currentWord.phoneticAudio);
      audio.play();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <FadeIn>
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Vocabulary Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Master your vocabulary with interactive practice sessions
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Choose Your Practice Mode
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PRACTICE_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={selectedMode === mode.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedMode(mode.id);
                    setShowAnswer(false);
                    setUserInput("");
                  }}
                  className={`h-auto p-6 flex-col gap-3 ${
                    selectedMode === mode.id
                      ? `bg-linear-to-r ${mode.color} text-white border-0`
                      : ""
                  }`}
                >
                  <Icon className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-bold text-lg">{mode.title}</div>
                    <div className="text-xs opacity-90 mt-1">
                      {mode.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FadeIn>
            <Card className="glass-card border-2 shadow-xl bg-linear-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 border-violet-500/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    {selectedMode === "flashcard" && "Flashcard Practice"}
                    {selectedMode === "quiz" && "Vocabulary Quiz"}
                    {selectedMode === "sentence" && "Sentence Practice"}
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-violet-500/10 border-violet-500/40"
                  >
                    {currentWordIndex + 1} / {practiceWords.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {practiceWords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookMarked className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No words available for practice</p>
                    <p className="text-sm mt-2">
                      Add some vocabulary words to start practicing!
                    </p>
                  </div>
                ) : (
                  <>
                    {selectedMode === "flashcard" && currentWord && (
                      <div className="space-y-6">
                        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border-2 border-violet-500/20">
                          {!showAnswer ? (
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                                What does this word mean?
                              </p>
                              <h2 className="text-5xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                {currentWord.word}
                              </h2>
                              {currentWord.phonetic && (
                                <div className="flex items-center justify-center gap-2">
                                  <p className="text-lg text-muted-foreground font-mono">
                                    {currentWord.phonetic}
                                  </p>
                                  {currentWord.phoneticAudio && (
                                    <Button
                                      onClick={playAudio}
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                    >
                                      <Volume2 className="h-5 w-5" />
                                    </Button>
                                  )}
                                </div>
                              )}
                              <Button
                                onClick={() => setShowAnswer(true)}
                                className="mt-6 bg-linear-to-r from-violet-500 to-purple-500"
                              >
                                Show Answer
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h2 className="text-4xl font-bold">
                                {currentWord.word}
                              </h2>
                              {currentWord.phonetic && (
                                <p className="text-muted-foreground font-mono">
                                  {currentWord.phonetic}
                                </p>
                              )}
                              <div className="mt-6 space-y-3 text-left max-w-2xl mx-auto">
                                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                                  <p className="text-sm text-violet-500 font-semibold mb-1">
                                    Meaning
                                  </p>
                                  <p className="text-lg">
                                    {currentWord.meaning}
                                  </p>
                                </div>
                                {currentWord.meaningBn && (
                                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-sm text-blue-500 font-semibold mb-1">
                                      বাংলা অর্থ
                                    </p>
                                    <p className="text-lg">
                                      {currentWord.meaningBn}
                                    </p>
                                  </div>
                                )}
                                {currentWord.exampleSentence && (
                                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                    <p className="text-sm text-amber-500 font-semibold mb-1">
                                      Example
                                    </p>
                                    <p className="italic">
                                      &ldquo;{currentWord.exampleSentence}
                                      &rdquo;
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleNext}
                            className="flex-1 bg-linear-to-r from-pink-500 to-purple-500"
                            size="lg"
                          >
                            Next Word
                          </Button>
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedMode === "quiz" && currentWord && (
                      <div className="space-y-6">
                        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border-2 border-blue-500/20">
                          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">
                            Guess the word from its meaning
                          </p>
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
                            <p className="text-xl">{currentWord.meaning}</p>
                          </div>
                          <Textarea
                            placeholder="Type your answer..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="max-w-md mx-auto mb-4"
                            disabled={showAnswer}
                          />
                          {showAnswer && (
                            <div
                              className={`mt-4 p-4 rounded-lg ${
                                userInput.trim().toLowerCase() ===
                                currentWord.word.toLowerCase()
                                  ? "bg-green-500/20 border border-green-500/40"
                                  : "bg-red-500/20 border border-red-500/40"
                              }`}
                            >
                              <p className="font-bold text-lg">
                                {userInput.trim().toLowerCase() ===
                                currentWord.word.toLowerCase()
                                  ? "✅ Correct!"
                                  : `❌ The answer is: ${currentWord.word}`}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {!showAnswer ? (
                            <Button
                              onClick={handleCheckAnswer}
                              disabled={!userInput.trim()}
                              className="flex-1 bg-linear-to-r from-blue-500 to-cyan-500"
                              size="lg"
                            >
                              Check Answer
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNext}
                              className="flex-1 bg-linear-to-r from-pink-500 to-purple-500"
                              size="lg"
                            >
                              Next Question
                            </Button>
                          )}
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedMode === "sentence" && currentWord && (
                      <div className="space-y-6">
                        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border-2 border-amber-500/20">
                          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-4">
                            Use this word in a sentence
                          </p>
                          <h2 className="text-4xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-6">
                            {currentWord.word}
                          </h2>
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 max-w-2xl mx-auto text-left">
                            <p className="text-sm text-amber-500 font-semibold mb-1">
                              Meaning
                            </p>
                            <p>{currentWord.meaning}</p>
                          </div>
                          <Textarea
                            placeholder="Write your sentence here..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            rows={4}
                            className="max-w-2xl mx-auto mb-4"
                          />

                          {/* AI Feedback Section */}
                          {aiFeedback && (
                            <div className="max-w-2xl mx-auto space-y-3 mb-4">
                              <div
                                className={`border rounded-lg p-4 text-left ${
                                  aiFeedback.isCorrect
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-blue-500/10 border-blue-500/30"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageSquare className="h-4 w-4 text-violet-500" />
                                  <p className="text-sm font-semibold text-violet-500">
                                    AI Feedback
                                  </p>
                                  <Badge variant="outline" className="ml-auto">
                                    Rating: {aiFeedback.rating}/5
                                  </Badge>
                                </div>
                                <p className="text-sm mb-3">
                                  {aiFeedback.feedback}
                                </p>
                                {aiFeedback.suggestions &&
                                  aiFeedback.suggestions.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-violet-500/20">
                                      <p className="text-xs font-semibold text-violet-500 mb-2">
                                        Suggestions:
                                      </p>
                                      <ul className="text-xs space-y-1">
                                        {aiFeedback.suggestions.map(
                                          (suggestion: string, idx: number) => (
                                            <li key={idx}>• {suggestion}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {aiFeedback.encouragement && (
                                  <p className="text-xs mt-3 italic text-muted-foreground">
                                    💡 {aiFeedback.encouragement}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {currentWord.exampleSentence && showAnswer && (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 max-w-2xl mx-auto text-left">
                              <p className="text-sm text-green-500 font-semibold mb-1">
                                Example Sentence
                              </p>
                              <p className="italic">
                                &ldquo;{currentWord.exampleSentence}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {!aiFeedback ? (
                            <>
                              <Button
                                onClick={handleGetAIFeedback}
                                disabled={
                                  isGettingFeedback || !userInput.trim()
                                }
                                className="flex-1 bg-linear-to-r from-violet-500 to-purple-500 gap-2"
                                size="lg"
                              >
                                {isGettingFeedback ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                                Get AI Feedback
                              </Button>
                              <Button
                                onClick={() => setShowAnswer(true)}
                                variant="outline"
                                size="lg"
                              >
                                Show Example
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={handleNext}
                              className="flex-1 bg-linear-to-r from-pink-500 to-purple-500"
                              size="lg"
                            >
                              Next Word
                            </Button>
                          )}
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {selectedMode === "quiz" && (
            <FadeIn>
              <Card className="glass-card border-2 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Your Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-4xl font-bold text-violet-500">
                        {score.total > 0
                          ? Math.round((score.correct / score.total) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-2xl font-bold text-green-500">
                          {score.correct}
                        </p>
                        <p className="text-muted-foreground">Correct</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-2xl font-bold text-red-500">
                          {score.total - score.correct}
                        </p>
                        <p className="text-muted-foreground">Incorrect</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          <FadeIn>
            <Card className="glass-card border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-violet-500" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Words Practiced</span>
                      <span className="font-bold">
                        {currentWordIndex + 1} / {practiceWords.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            ((currentWordIndex + 1) / practiceWords.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center pt-4 border-t">
                    <p className="text-3xl font-bold text-purple-500">
                      {allWords?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Vocabulary
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card className="glass-card border-2 shadow-xl bg-linear-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-500">
                  <Sparkles className="h-4 w-4" />
                  Practice Tips
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Practice daily for best results</li>
                  <li>• Focus on difficult words first</li>
                  <li>• Use words in real conversations</li>
                  <li>• Review regularly to retain knowledge</li>
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
