import type { CreateVocabularyPayload, VocabularyDto } from "@/lib/api";
import { baseApi } from "../../baseApi";
import type { VocabularyFilters } from "./vocabularySlice";

export const vocabularyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVocabulary: builder.query<VocabularyDto[], VocabularyFilters | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
        const query = searchParams.toString();
        return {
          url: `/vocab${query ? `?${query}` : ""}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Vocabulary" as const,
                id: item._id,
              })),
              { type: "Vocabulary" as const, id: "LIST" },
            ]
          : [{ type: "Vocabulary" as const, id: "LIST" }],
    }),
    createVocabulary: builder.mutation<VocabularyDto, CreateVocabularyPayload>({
      query: (body) => ({
        url: "/vocab",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vocabulary", id: "LIST" }],
    }),
    deleteVocabulary: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vocab/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Vocabulary", id },
        { type: "Vocabulary", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateVocabularyMutation,
  useDeleteVocabularyMutation,
  useGetVocabularyQuery,
} = vocabularyApi;
