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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateVocabularyPayload } from "@/lib/api";
import {
  useCreateVocabularyMutation,
  useDeleteVocabularyMutation,
  useGetVocabularyQuery,
} from "@/redux/features/vocabulary/vocabularyApi";
import type {
  DifficultyOption,
  ExamOption,
  StatusOption,
} from "@/redux/features/vocabulary/vocabularySlice";
import {
  difficultyOptions,
  examOptions,
  resetForm as resetVocabularyForm,
  setAntonymsText,
  setFilter,
  setSearch,
  setSynonymsText,
  statusOptions,
  updateForm as updateVocabularyForm,
} from "@/redux/features/vocabulary/vocabularySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { JSX } from "react";
import { useMemo } from "react";

const exams = examOptions;
const difficulties = difficultyOptions;
const statuses = statusOptions;

const getErrorMessage = (
  error?: FetchBaseQueryError | SerializedError
): string | null => {
  if (!error) return null;
  if ("status" in error) {
    if (typeof error.data === "string" && error.data) return error.data;
    return `Request failed (${error.status})`;
  }
  return error.message ?? "Unexpected error";
};

export function VocabularyPanel(): JSX.Element {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.vocabulary.filters);
  const form = useAppSelector((state) => state.vocabulary.form);
  const synonymsText = useAppSelector((state) => state.vocabulary.synonymsText);
  const antonymsText = useAppSelector((state) => state.vocabulary.antonymsText);

  const {
    data: items = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetVocabularyQuery(filters);

  const [createVocabulary, { isLoading: isCreating, error: createError }] =
    useCreateVocabularyMutation();
  const [deleteVocabulary, { isLoading: isDeleting, error: deleteError }] =
    useDeleteVocabularyMutation();

  const loading = isLoading || isFetching;
  const submitting = isCreating || isDeleting;

  const derivedSynonyms = useMemo(
    () =>
      synonymsText
        .split(",")
        .map((value: string) => value.trim())
        .filter(Boolean),
    [synonymsText]
  );

  const derivedAntonyms = useMemo(
    () =>
      antonymsText
        .split(",")
        .map((value: string) => value.trim())
        .filter(Boolean),
    [antonymsText]
  );

  const handleChange = <K extends keyof CreateVocabularyPayload>(
    key: K,
    value: CreateVocabularyPayload[K]
  ) => {
    dispatch(updateVocabularyForm({ key, value }));
  };

  const handleCreate = async () => {
    if (!form.word || !form.meaning) return;
    try {
      await createVocabulary({
        ...form,
        synonyms: derivedSynonyms,
        antonyms: derivedAntonyms,
      }).unwrap();
      dispatch(resetVocabularyForm());
    } catch (err) {
      console.error("createVocabulary failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVocabulary(id).unwrap();
    } catch (err) {
      console.error("deleteVocabulary failed", err);
    }
  };

  const errorMessage =
    getErrorMessage(createError) ??
    getErrorMessage(deleteError) ??
    getErrorMessage(queryError);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vocabulary Tracker</CardTitle>
        <CardDescription>
          Capture new words, filter by exam focus, and keep their study status
          in sync.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="vocab-search">Search</Label>
            <Input
              id="vocab-search"
              placeholder="E.g. ubiquitous"
              value={filters.search ?? ""}
              onChange={(event) => dispatch(setSearch(event.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="vocab-exam">Exam</Label>
            <Select
              id="vocab-exam"
              value={filters.exam ?? ""}
              onChange={(event) => {
                const value = event.target.value as ExamOption | "";
                dispatch(
                  setFilter({
                    key: "exam",
                    value: (value || undefined) as ExamOption | undefined,
                  })
                );
              }}
            >
              <option value="">All Exams</option>
              {exams.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="vocab-difficulty">Difficulty</Label>
            <Select
              id="vocab-difficulty"
              value={filters.difficulty ?? ""}
              onChange={(event) => {
                const value = event.target.value as DifficultyOption | "";
                dispatch(
                  setFilter({
                    key: "difficulty",
                    value: (value || undefined) as DifficultyOption | undefined,
                  })
                );
              }}
            >
              <option value="">Any</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="vocab-status">Status</Label>
            <Select
              id="vocab-status"
              value={filters.status ?? ""}
              onChange={(event) => {
                const value = event.target.value as StatusOption | "";
                dispatch(
                  setFilter({
                    key: "status",
                    value: (value || undefined) as StatusOption | undefined,
                  })
                );
              }}
            >
              <option value="">Any</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="word">Word *</Label>
              <Input
                id="word"
                value={form.word}
                onChange={(event) => handleChange("word", event.target.value)}
                placeholder="Meticulous"
              />
            </div>
            <div>
              <Label htmlFor="meaning">Meaning *</Label>
              <Textarea
                id="meaning"
                value={form.meaning}
                onChange={(event) =>
                  handleChange("meaning", event.target.value)
                }
                placeholder="Showing great attention to detail"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="meaningBn">Meaning (Bangla)</Label>
                <Input
                  id="meaningBn"
                  value={form.meaningBn ?? ""}
                  onChange={(event) =>
                    handleChange("meaningBn", event.target.value)
                  }
                  placeholder="সতর্ক অত্যন্ত নিখুঁত"
                />
              </div>
              <div>
                <Label htmlFor="partOfSpeech">Part of speech</Label>
                <Input
                  id="partOfSpeech"
                  value={form.partOfSpeech ?? ""}
                  onChange={(event) =>
                    handleChange("partOfSpeech", event.target.value)
                  }
                  placeholder="adjective"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="exampleSentence">Example sentence</Label>
              <Textarea
                id="exampleSentence"
                value={form.exampleSentence ?? ""}
                onChange={(event) =>
                  handleChange("exampleSentence", event.target.value)
                }
                placeholder="She prepared a meticulous set of TOEFL notes."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="synonyms">Synonyms (comma separated)</Label>
                <Input
                  id="synonyms"
                  value={synonymsText}
                  onChange={(event) =>
                    dispatch(setSynonymsText(event.target.value))
                  }
                  placeholder="precise, thorough"
                />
              </div>
              <div>
                <Label htmlFor="antonyms">Antonyms</Label>
                <Input
                  id="antonyms"
                  value={antonymsText}
                  onChange={(event) =>
                    dispatch(setAntonymsText(event.target.value))
                  }
                  placeholder="careless"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="examTags">Exam focus</Label>
                <Select
                  id="examTags"
                  value={form.examTags?.[0] ?? "IELTS"}
                  onChange={(event) =>
                    handleChange("examTags", [event.target.value as ExamOption])
                  }
                >
                  {exams.map((exam) => (
                    <option key={exam} value={exam}>
                      {exam}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(event) =>
                    handleChange(
                      "difficulty",
                      event.target.value as DifficultyOption
                    )
                  }
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    handleChange("status", event.target.value as StatusOption)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={form.notes ?? ""}
                  onChange={(event) =>
                    handleChange("notes", event.target.value)
                  }
                  placeholder="Use in IELTS Writing Task 2"
                />
              </div>
            </div>
            <Button
              disabled={submitting || !form.word || !form.meaning}
              onClick={() => handleCreate()}
            >
              {submitting ? "Saving..." : "Add word"}
            </Button>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold">Saved vocabulary</h4>
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Loading words..."
                  : `${items.length} entr${items.length === 1 ? "y" : "ies"}`}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => refetch()}
              disabled={loading}
            >
              Refresh
            </Button>
          </header>
          <div className="grid gap-4">
            {items.map((item) => (
              <article
                key={item._id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h5 className="text-lg font-semibold">{item.word}</h5>
                    <p className="text-sm text-muted-foreground">
                      {item.meaning}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {item.examTags.join(", ")}
                    </Badge>
                    <Badge variant="muted">{item.difficulty}</Badge>
                    <Badge>{item.status}</Badge>
                  </div>
                </div>
                {item.exampleSentence && (
                  <p className="mt-3 text-sm italic text-muted-foreground">
                    “{item.exampleSentence}”
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {item.synonyms?.length ? (
                    <span>Synonyms: {item.synonyms.join(", ")}</span>
                  ) : null}
                  {item.antonyms?.length ? (
                    <span>Antonyms: {item.antonyms.join(", ")}</span>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                    disabled={submitting}
                  >
                    Remove
                  </Button>
                </div>
              </article>
            ))}
            {!loading && items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No words match the current filters.
              </p>
            ) : null}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
