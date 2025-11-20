"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOPIC_TAGS } from "@/lib/topic-tags";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";

interface TopicTagsSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TopicTagsSelector({ value, onChange }: TopicTagsSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTag = (tag: string) => {
    const newTags = value.includes(tag)
      ? value.filter((t) => t !== tag)
      : [...value, tag];
    onChange(newTags);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  // Filter tags based on search
  const filteredCategories = Object.entries(TOPIC_TAGS).reduce(
    (acc, [category, tags]) => {
      const filtered = tags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between"
        >
          {value.length > 0
            ? `${value.length} tag${value.length > 1 ? "s" : ""} selected`
            : "Select topic tags..."}
          <ChevronDown
            className={`ml-2 h-4 w-4 shrink-0 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>

        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-3xl">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {Object.keys(filteredCategories).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No topics found
                </p>
              ) : (
                Object.entries(filteredCategories).map(([category, tags]) => (
                  <div key={category} className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      {category}
                    </p>
                    <div className="space-y-0.5">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
                        >
                          <div className="h-4 w-4 flex items-center justify-center">
                            {value.includes(tag) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <span className="flex-1 text-left">{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
