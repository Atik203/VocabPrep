"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreatePracticePayload, PracticeDto } from "@/lib/api";
import {
  useCreatePracticeMutation,
  useGetPracticesQuery,
} from "@/redux/features/practice/practiceApi";
import type {
  ExamOption as PracticeExamOption,
  SkillOption as PracticeSkillOption,
} from "@/redux/features/practice/practiceSlice";
import {
  examOptions as practiceExamOptions,
  resetPracticeForm,
  skillOptions,
  updatePracticeForm,
} from "@/redux/features/practice/practiceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { JSX } from "react";
import { useMemo } from "react";

const exams = practiceExamOptions;
const skills = skillOptions;

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

export function PracticePanel(): JSX.Element {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.practice.form);

  const {
    data: entries = [],
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetPracticesQuery();

  const [createPractice, { isLoading: isCreating, error: createError }] =
    useCreatePracticeMutation();

  const loading = isLoading || isFetching;
  const submitting = isCreating;

  const handleChange = <K extends keyof CreatePracticePayload>(
    key: K,
    value: CreatePracticePayload[K]
  ) => {
    dispatch(updatePracticeForm({ key, value }));
  };

  const handleSubmit = async () => {
    if (!form.prompt) return;
    try {
      await createPractice(form).unwrap();
      dispatch(resetPracticeForm());
    } catch (err) {
      console.error("createPractice failed", err);
    }
  };

  const groupedEntries = useMemo(
    () =>
      entries.reduce<Record<string, PracticeDto[]>>((acc, entry) => {
        const key = `${entry.exam}-${entry.skill}`;
        acc[key] = acc[key] ? [...acc[key], entry] : [entry];
        return acc;
      }, {}),
    [entries]
  );

  const errorMessage =
    getErrorMessage(createError) ?? getErrorMessage(queryError);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Log</CardTitle>
        <CardDescription>
          Track prompts, answers, and feedback for each skill so you do not
          repeat the same mistakes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="practice-exam">Exam</Label>
            <Select
              id="practice-exam"
              value={form.exam}
              onChange={(event) =>
                handleChange("exam", event.target.value as PracticeExamOption)
              }
            >
              {exams.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="practice-skill">Skill</Label>
            <Select
              id="practice-skill"
              value={form.skill}
              onChange={(event) =>
                handleChange("skill", event.target.value as PracticeSkillOption)
              }
            >
              {skills.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </section>
        <div>
          <Label htmlFor="prompt">Prompt *</Label>
          <Textarea
            id="prompt"
            value={form.prompt}
            onChange={(event) => handleChange("prompt", event.target.value)}
            placeholder="Describe a recent Task 2 prompt or speaking cue card"
          />
        </div>
        <div>
          <Label htmlFor="yourAnswer">Your answer</Label>
          <Textarea
            id="yourAnswer"
            value={form.yourAnswer ?? ""}
            onChange={(event) => handleChange("yourAnswer", event.target.value)}
            placeholder="Summarize your response or key bullet points"
          />
        </div>
        <div>
          <Label htmlFor="feedbackOrNotes">Feedback / notes</Label>
          <Textarea
            id="feedbackOrNotes"
            value={form.feedbackOrNotes ?? ""}
            onChange={(event) =>
              handleChange("feedbackOrNotes", event.target.value)
            }
            placeholder="Grammar mistakes, timing issues, vocabulary targets"
          />
        </div>
        <Button
          disabled={submitting || !form.prompt}
          onClick={() => handleSubmit()}
        >
          {submitting ? "Saving..." : "Log practice"}
        </Button>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <section>
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold">Recent sessions</h4>
              <p className="text-sm text-muted-foreground">
                {loading
                  ? "Syncing entries..."
                  : `${entries.length} total saved`}
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
          <div className="space-y-4">
            {Object.entries(groupedEntries).map(([key, group]) => {
              const [exam, skill] = key.split("-");
              return (
                <article
                  key={key}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide">
                        {exam}
                      </p>
                      <p className="text-sm text-muted-foreground">{skill}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last updated{" "}
                      {new Date(
                        group[0]?.createdAt ?? Date.now()
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-3 space-y-3 text-sm">
                    {group.slice(0, 3).map((entry) => (
                      <div
                        key={entry._id}
                        className="rounded-md border border-border/60 p-3"
                      >
                        <p className="font-medium">Prompt</p>
                        <p className="text-muted-foreground">{entry.prompt}</p>
                        {entry.feedbackOrNotes ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Feedback: {entry.feedbackOrNotes}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
            {!loading && entries.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No practice entries yet. Log your first session above.
              </p>
            ) : null}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
