import { baseApi } from "../../baseApi";

export interface UserProgress {
  _id: string;
  userId: string;
  vocabularyId: string;
  status: "new" | "learning" | "learned";
  reviewCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressStats {
  total: number;
  new: number;
  learning: number;
  learned: number;
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgress: builder.query<UserProgress, string>({
      query: (vocabularyId) => ({
        url: `/progress/${vocabularyId}`,
      }),
      providesTags: (_result, _error, vocabularyId) => [
        { type: "Progress", id: vocabularyId },
      ],
    }),
    updateProgress: builder.mutation<
      UserProgress,
      { vocabularyId: string; status: "new" | "learning" | "learned" }
    >({
      query: ({ vocabularyId, status }) => ({
        url: `/progress/${vocabularyId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { vocabularyId }) => [
        { type: "Progress", id: vocabularyId },
        { type: "Progress", id: "STATS" },
        { type: "Progress", id: "LIST" },
        { type: "Vocabulary", id: vocabularyId },
        { type: "Vocabulary", id: "LIST" },
      ],
    }),
    listProgress: builder.query<
      UserProgress[],
      { status?: "new" | "learning" | "learned" } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) {
          searchParams.append("status", params.status);
        }
        const query = searchParams.toString();
        return {
          url: `/progress${query ? `?${query}` : ""}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Progress" as const,
                id: item.vocabularyId,
              })),
              { type: "Progress" as const, id: "LIST" },
            ]
          : [{ type: "Progress" as const, id: "LIST" }],
    }),
    getProgressStats: builder.query<ProgressStats, void>({
      query: () => ({
        url: "/progress/stats",
      }),
      providesTags: [{ type: "Progress", id: "STATS" }],
    }),
    deleteProgress: builder.mutation<void, string>({
      query: (vocabularyId) => ({
        url: `/progress/${vocabularyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, vocabularyId) => [
        { type: "Progress", id: vocabularyId },
        { type: "Progress", id: "STATS" },
        { type: "Progress", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProgressQuery,
  useUpdateProgressMutation,
  useListProgressQuery,
  useGetProgressStatsQuery,
  useDeleteProgressMutation,
} = progressApi;
