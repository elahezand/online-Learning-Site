import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Article } from "../../types/models";
import { useGet, usePost, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/articles";
const KEY = ["articles"];

/* ---------- GET ---------- */

export const useArticles = () =>
  useGet<Article[]>(ENDPOINT, undefined, {
    queryKey: KEY,
    errorFallback: "Failed to load articles",
  });

export const useArticle = (shortName?: string) =>
  useGet<Article>(`${ENDPOINT}/${encodeURIComponent(shortName ?? "")}`, undefined, {
    queryKey: [...KEY, shortName],
    enabled: Boolean(shortName),
    errorFallback: "Failed to load article",
  });

/* ---------- POST ---------- */

export const usePublishArticle = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, FormData>(ENDPOINT, {
    onSuccess: () => {
      toast.success("The article was published");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to publish article",
  });
};

export const useSaveDraft = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePost<unknown, FormData>(`${ENDPOINT}/draft`, {
    onSuccess: () => {
      toast.success("The article was saved as draft");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to save draft",
  });
};

/* ---------- DELETE ---------- */

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useDelete<unknown, string>((id: string) => `${ENDPOINT}/${id}`, {
    onSuccess: () => {
      toast.success("The article was removed");
      queryClient.invalidateQueries({ queryKey: KEY });
    },
    errorFallback: "Failed to remove article",
  });
};