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
import { useGetTensesQuery } from "@/redux/features/tense/tenseApi";
import { toggleViewMode } from "@/redux/features/tense/tenseSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { JSX } from "react";

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

export function TensePanel(): JSX.Element {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.tense.viewMode);
  const {
    data: tenses = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTensesQuery();

  const loading = isLoading || isFetching;
  const layoutClass =
    viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-4";
  const errorMessage = getErrorMessage(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tense Reference</CardTitle>
        <CardDescription>
          Quick structures and usage reminders for IELTS / TOEFL / GRE writing
          and speaking tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {loading ? "Syncing examples..." : `${tenses.length} tenses ready`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleViewMode())}
            >
              {viewMode === "grid" ? "List view" : "Grid view"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
        <div className={layoutClass}>
          {tenses.map((tense) => (
            <article
              key={tense.name}
              className="rounded-lg border border-border/80 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-semibold">{tense.name}</h4>
                <Badge variant="outline">Structure</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {tense.structure}
              </p>
              <p className="mt-2 text-sm">Usage: {tense.usage}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {tense.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {!loading && !tenses.length ? (
          <p className="text-sm text-muted-foreground">
            No tense data available yet.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
