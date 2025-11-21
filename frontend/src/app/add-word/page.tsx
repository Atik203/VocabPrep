"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { TopicTagsSelector } from "@/components/ui/topic-tags-selector";
import { api, type CreateVocabularyPayload } from "@/lib/api";
import { searchBengaliMeaning } from "@/lib/bengali-dictionary";
import { fetchWordDefinition } from "@/lib/dictionary";
import { useEnhanceVocabMutation } from "@/redux/features/ai/aiApi";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddWordPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [enhanceVocab, { isLoading: isEnhancing }] = useEnhanceVocabMutation();

  const [formData, setFormData] = useState<CreateVocabularyPayload>({
    word: "",
    meaning: "",
    meaningBn: "",
    partOfSpeech: "",
    phonetic: "",
    phoneticAudio: "",
    sourceUrl: "",
    exampleSentence: "",
    synonyms: [],
    antonyms: [],
    topicTags: [],
    difficulty: "medium",
    status: "new",
    notes: "",
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setDuplicateWarning(null);
    setSaveSuccess(false);

    try {
      // Check for duplicate
      const duplicateCheck = await api.vocabulary.checkDuplicate(
        searchTerm.trim()
      );
      if (duplicateCheck.exists) {
        setDuplicateWarning(
          `"${searchTerm}" already exists in your vocabulary list!`
        );
      }

      // Fetch from dictionary API
      const dictionaryData = await fetchWordDefinition(searchTerm.trim());

      if (!dictionaryData || dictionaryData.length === 0) {
        setSearchError("Word not found in dictionary");
        return;
      }

      const firstEntry = dictionaryData[0];
      const phoneticWithAudio = firstEntry?.phonetics.find(
        (p) => p.audio && p.audio !== ""
      );

      // Get first meaning
      const firstMeaning = firstEntry?.meanings[0];
      const firstDefinition = firstMeaning?.definitions[0];

      // Collect unique synonyms and antonyms
      const synonymsSet = new Set<string>();
      const antonymsSet = new Set<string>();

      firstEntry?.meanings.forEach((meaning) => {
        meaning.synonyms?.forEach((s) => synonymsSet.add(s));
        meaning.antonyms?.forEach((a) => antonymsSet.add(a));
        meaning.definitions.forEach((def) => {
          def.synonyms?.forEach((s) => synonymsSet.add(s));
          def.antonyms?.forEach((a) => antonymsSet.add(a));
        });
      });

      // Fetch Bengali meaning
      let bengaliMeaning = "";
      try {
        const bengaliData = await searchBengaliMeaning(searchTerm.trim());
        if (bengaliData) {
          bengaliMeaning = bengaliData.meaning;
        }
      } catch (error) {
        console.log("Bengali meaning not found:", error);
      }

      setFormData({
        word: firstEntry?.word || searchTerm,
        meaning: firstDefinition?.definition || "",
        meaningBn: bengaliMeaning,
        partOfSpeech: firstMeaning?.partOfSpeech || "",
        phonetic: phoneticWithAudio?.text || firstEntry?.phonetic || "",
        phoneticAudio: phoneticWithAudio?.audio || "",
        sourceUrl: firstEntry?.sourceUrls?.[0] || "",
        exampleSentence: firstDefinition?.example || "",
        synonyms: Array.from(synonymsSet).slice(0, 10),
        antonyms: Array.from(antonymsSet).slice(0, 10),
        topicTags: [],
        difficulty: "medium",
        status: "new",
        notes: "",
      });
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "Failed to fetch word definition"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!formData.word || !formData.meaning) {
      setSearchError("Word and meaning are required");
      return;
    }

    setIsSaving(true);
    setSearchError(null);
    setSaveSuccess(false);

    try {
      await api.vocabulary.create(formData);
      setSaveSuccess(true);
      setDuplicateWarning(null);

      // Reset form after 2 seconds
      setTimeout(() => {
        setSearchTerm("");
        setFormData({
          word: "",
          meaning: "",
          meaningBn: "",
          partOfSpeech: "",
          phonetic: "",
          phoneticAudio: "",
          sourceUrl: "",
          exampleSentence: "",
          synonyms: [],
          antonyms: [],
          topicTags: [],
          difficulty: "medium",
          status: "new",
          notes: "",
        });
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Failed to save word"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const playAudio = () => {
    if (formData.phoneticAudio) {
      const audio = new Audio(formData.phoneticAudio);
      audio.play();
    }
  };

  const handleAIEnhancement = async () => {
    if (!formData.word || !formData.meaning) {
      toast.error("Word and meaning are required for AI enhancement");
      return;
    }

    try {
      const result = await enhanceVocab({
        word: formData.word,
        meaning: formData.meaning,
        context: "intermediate",
      }).unwrap();

      // Update form with AI-enhanced data
      setFormData((prev) => ({
        ...prev,
        meaning: result.data.enhancedMeaning || prev.meaning,
        exampleSentence:
          result.data.exampleSentences?.[0] || prev.exampleSentence,
        difficulty: result.data.suggestedDifficulty || prev.difficulty,
        topicTags: result.data.suggestedTopicTags || prev.topicTags,
        notes: result.data.memoryTip
          ? `${prev.notes ? prev.notes + "\n\n" : ""}💡 Memory Tip: ${
              result.data.memoryTip
            }`
          : prev.notes,
      }));

      toast.success("✨ AI enhancement applied!");
    } catch (error: any) {
      const errorMessage = error?.data?.error || "Failed to enhance with AI";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Add New Word</h1>
        <p className="text-muted-foreground">
          Search for a word using the dictionary API, then customize and save it
          to your vocabulary
        </p>
      </div>

      {/* Search Section */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Search Word</CardTitle>
          <CardDescription>
            Enter a word to fetch its definition from the dictionary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter word to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {searchError && (
            <div className="mt-4 flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>{searchError}</span>
            </div>
          )}

          {duplicateWarning && (
            <div className="mt-4 flex items-start gap-2 text-sm text-warning bg-warning/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="mt-4 flex items-start gap-2 text-sm text-success bg-success/10 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <span>Word saved successfully!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {formData.word && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Word Details</CardTitle>
                <CardDescription>
                  Edit and customize the word information before saving
                </CardDescription>
              </div>
              <Button
                onClick={handleAIEnhancement}
                disabled={isEnhancing || !formData.word || !formData.meaning}
                variant="outline"
                className="gap-2 bg-linear-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/40"
              >
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-violet-500" />
                )}
                <span className="bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                  Enhance with AI
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Word and Phonetic */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="word">Word *</Label>
                <Input
                  id="word"
                  value={formData.word}
                  onChange={(e) =>
                    setFormData({ ...formData, word: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phonetic">Phonetic</Label>
                <div className="flex gap-2">
                  <Input
                    id="phonetic"
                    value={formData.phonetic || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phonetic: e.target.value })
                    }
                    placeholder="/fəˈnetɪk/"
                  />
                  {formData.phoneticAudio && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={playAudio}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Part of Speech */}
            <div className="space-y-2">
              <Label htmlFor="partOfSpeech">Part of Speech</Label>
              <Input
                id="partOfSpeech"
                value={formData.partOfSpeech || ""}
                onChange={(e) =>
                  setFormData({ ...formData, partOfSpeech: e.target.value })
                }
                placeholder="noun, verb, adjective, etc."
              />
            </div>

            {/* Meaning */}
            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning (English) *</Label>
              <Textarea
                id="meaning"
                value={formData.meaning}
                onChange={(e) =>
                  setFormData({ ...formData, meaning: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            {/* Bengali Meaning */}
            <div className="space-y-2">
              <Label htmlFor="meaningBn">Meaning (Bengali)</Label>
              <Textarea
                id="meaningBn"
                value={formData.meaningBn || ""}
                onChange={(e) =>
                  setFormData({ ...formData, meaningBn: e.target.value })
                }
                rows={2}
                placeholder="বাংলা অর্থ"
              />
            </div>

            {/* Example Sentence */}
            <div className="space-y-2">
              <Label htmlFor="exampleSentence">Example Sentence</Label>
              <Textarea
                id="exampleSentence"
                value={formData.exampleSentence || ""}
                onChange={(e) =>
                  setFormData({ ...formData, exampleSentence: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Synonyms and Antonyms */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="synonyms">Synonyms (comma-separated)</Label>
                <Textarea
                  id="synonyms"
                  value={formData.synonyms?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      synonyms: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={2}
                  placeholder="similar, alike, equivalent"
                />
                {formData.synonyms && formData.synonyms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.synonyms.map((syn, idx) => (
                      <Badge key={idx} variant="secondary">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="antonyms">Antonyms (comma-separated)</Label>
                <Textarea
                  id="antonyms"
                  value={formData.antonyms?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      antonyms: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={2}
                  placeholder="different, unlike, opposite"
                />
                {formData.antonyms && formData.antonyms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.antonyms.map((ant, idx) => (
                      <Badge key={idx} variant="secondary">
                        {ant}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "new" | "learning" | "learned") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="learned">Learned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topic Tags */}
            <div className="space-y-2">
              <Label htmlFor="topicTags">Topic Tags</Label>
              <TopicTagsSelector
                value={formData.topicTags || []}
                onChange={(tags) =>
                  setFormData({ ...formData, topicTags: tags })
                }
              />
              <p className="text-xs text-muted-foreground">
                Select relevant topics from categories like Education, Science &
                Technology, Business, etc.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Add your personal notes here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving || !formData.word || !formData.meaning}
                className="flex-1"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Save Word
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFormData({
                    word: "",
                    meaning: "",
                    meaningBn: "",
                    partOfSpeech: "",
                    phonetic: "",
                    phoneticAudio: "",
                    sourceUrl: "",
                    exampleSentence: "",
                    synonyms: [],
                    antonyms: [],
                    topicTags: [],
                    difficulty: "medium",
                    status: "new",
                    notes: "",
                  });
                  setSearchError(null);
                  setDuplicateWarning(null);
                  setSaveSuccess(false);
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
