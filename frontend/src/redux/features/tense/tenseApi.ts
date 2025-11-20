import type { TenseDto } from "@/lib/api";
import { baseApi } from "../../baseApi";

export const tenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenses: builder.query<TenseDto[], void>({
      query: () => ({
        url: "/tenses",
      }),
      providesTags: [{ type: "Tense", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTensesQuery } = tenseApi;
