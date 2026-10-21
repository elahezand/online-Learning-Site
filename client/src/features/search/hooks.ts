import type { SearchResult } from "../../types/models";
import { keepPreviousData } from "@tanstack/react-query";
import { useGet } from "../../hooks/useReactQueryHooks";

export const useSearch = (value: string) =>
  useGet<SearchResult>(`/search/${encodeURIComponent(value)}`, undefined, {
    queryKey: ["search", value],
    enabled: Boolean(value?.trim()),
    placeholderData: keepPreviousData,
    silentError: true,
  });