import type { CreatePracticePayload, PracticeDto } from "@/lib/api";
import { baseApi } from "../../baseApi";

export const practiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPractices: builder.query<PracticeDto[], void>({
      query: () => ({
        url: "/practices",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Practice" as const,
                id: item._id,
              })),
              { type: "Practice" as const, id: "LIST" },
            ]
          : [{ type: "Practice" as const, id: "LIST" }],
    }),
    createPractice: builder.mutation<PracticeDto, CreatePracticePayload>({
      query: (body) => ({
        url: "/practices",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Practice", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useCreatePracticeMutation, useGetPracticesQuery } = practiceApi;
