"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetProgressQuery,
  useUpdateProgressMutation,
} from "@/redux/features/progress/progressApi";
import {
  useGetVocabularyByIdQuery,
  useUpdateVocabularyMutation,
} from "@/redux/features/vocabulary/vocabularyApi";
import { useAppSelector } from "@/redux/hooks";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Edit,
  Loader2,
  Save,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VocabularyWord {
  _id: string;
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  phonetic?: string;
  phoneticAudio?: string;
  sourceUrl?: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function WordDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const wordId = params.id as string;
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    data: word,
    isLoading,
    error: queryError,
  } = useGetVocabularyByIdQuery(wordId);
  const { data: userProgress } = useGetProgressQuery(wordId, {
    skip: !isAuthenticated,
  });
  const [updateVocabulary, { isLoading: isSaving }] =
    useUpdateVocabularyMutation();
  const [updateProgress] = useUpdateProgressMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<Partial<VocabularyWord>>({});

  useEffect(() => {
    if (word) {
      setEditForm(word);
    }
  }, [word]);

  const handleSave = async () => {
    try {
      setError(null);
      await updateVocabulary({ id: wordId, data: editForm as any }).unwrap();
      setSuccessMessage("Word updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const toggleLearned = async () => {
    if (!word) return;
    const currentStatus = userProgress?.status || "new";
    const newStatus = currentStatus === "learned" ? "learning" : "learned";
    try {
      await updateProgress({
        vocabularyId: wordId,
        status: newStatus,
      }).unwrap();
      setSuccessMessage(`Marked as ${newStatus}!`);
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  const playAudio = () => {
    if (word?.phoneticAudio) {
      const audio = new Audio(word.phoneticAudio);
      audio.play();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error && !word) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
            <div className="flex justify-center mt-4">
              <Link href="/words">
                <Button>Back to Words</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!word) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/words">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Words
          </Button>
        </Link>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button
              onClick={toggleLearned}
              variant={
                userProgress?.status === "learned" ? "default" : "outline"
              }
              className="gap-2"
            >
              {userProgress?.status === "learned" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Learned
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  Mark as Learned
                </>
              )}
            </Button>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(word);
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Word Card */}
          <Card className="glass-card border-2 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editForm.word || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, word: e.target.value })
                      }
                      className="text-4xl font-bold mb-2"
                    />
                  ) : (
                    <h1 className="text-5xl font-bold mb-3 bg-linear-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                      {word.word}
                    </h1>
                  )}
                  {word.phonetic && (
                    <div className="flex items-center gap-3 text-lg text-muted-foreground">
                      <span className="font-mono">{word.phonetic}</span>
                      {word.phoneticAudio && (
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
                </div>
                {word.partOfSpeech && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {word.partOfSpeech}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* English Meaning */}
              <div>
                <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  Meaning (English)
                </Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.meaning || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, meaning: e.target.value })
                    }
                    rows={3}
                    className="text-base"
                  />
                ) : (
                  <p className="text-lg leading-relaxed">{word.meaning}</p>
                )}
              </div>

              {/* Bengali Meaning */}
              <div>
                <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  Meaning (Bengali)
                </Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.meaningBn || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, meaningBn: e.target.value })
                    }
                    rows={2}
                    className="text-base"
                    placeholder="বাংলা অর্থ"
                  />
                ) : word.meaningBn ? (
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {word.meaningBn}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No Bengali meaning available
                  </p>
                )}
              </div>

              {/* Example */}
              {(word.exampleSentence || isEditing) && (
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Example Sentence
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.exampleSentence || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          exampleSentence: e.target.value,
                        })
                      }
                      rows={2}
                      className="text-base"
                    />
                  ) : (
                    <p className="text-base italic border-l-4 border-violet-500 pl-4 py-2 bg-violet-500/5">
                      &ldquo;{word.exampleSentence}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Synonyms & Antonyms */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Synonyms
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.synonyms?.join(", ") || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          synonyms: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      rows={2}
                      placeholder="word1, word2, word3"
                    />
                  ) : word.synonyms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map((syn, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-sm"
                        >
                          {syn}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No synonyms
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                    Antonyms
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.antonyms?.join(", ") || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          antonyms: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      rows={2}
                      placeholder="word1, word2, word3"
                    />
                  ) : word.antonyms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {word.antonyms.map((ant, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-sm"
                        >
                          {ant}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No antonyms
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                  Personal Notes
                </Label>
                {isEditing ? (
                  <Textarea
                    value={editForm.notes || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4}
                    placeholder="Add your personal notes here..."
                  />
                ) : word.notes ? (
                  <p className="text-base leading-relaxed">{word.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No notes yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="glass-card border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="learned">Learned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Difficulty</Label>
                    <Select
                      value={editForm.difficulty}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge
                      className={
                        word.status === "learned"
                          ? "bg-green-500/20 text-green-400"
                          : word.status === "learning"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }
                    >
                      {word.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Difficulty:
                    </span>
                    <Badge
                      className={
                        word.difficulty === "easy"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : word.difficulty === "hard"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-amber-500/20 text-amber-400"
                      }
                    >
                      {word.difficulty}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="glass-card border-2">
            <CardHeader>
              <CardTitle className="text-lg">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Added:</span>
                <p className="font-medium">
                  {new Date(word.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <p className="font-medium">
                  {new Date(word.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {word.sourceUrl && (
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <a
                    href={word.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:underline block truncate"
                  >
                    {word.sourceUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
