import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Article, Paginated } from "../../types/models";
import { useGet, usePost, usePut, useDelete } from "../../hooks/useReactQueryHooks";

const ENDPOINT = "/articles";
const KEY = ["articles"];

export interface ArticleQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "published" | "draft" | "all";
  sort?: "newest" | "oldest" | "title";
}

export const useArticles = (query: ArticleQuery = {}) =>
  useGet<Paginated<Article>>(ENDPOINT, { ...query }, {
    queryKey: [...KEY, "list", query],
    placeholderData: keepPreviousData,
    errorFallback: "Failed to load articles",
  });

export const useArticle = (shortName?: string) =>
  useGet<Article>(`${ENDPOINT}/${encodeURIComponent(shortName ?? "")}`, undefined, {
    queryKey: [...KEY, shortName],
    enabled: Boolean(shortName),
    errorFallback: "Failed to load article",
  });

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

export const useUpdateArticle = (articleId: string, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return usePut<unknown, FormData>(`${ENDPOINT}/${articleId}`, {
    onSuccess: (_data, formData) => {
      const publish = formData.get("publish");
      toast.success(publish === "0" ? "The draft was saved" : publish === "1" ? "The article was published" : "The article was updated");
      queryClient.invalidateQueries({ queryKey: KEY });
      onSuccessCallback?.();
    },
    errorFallback: "Failed to update article",
  });
};

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